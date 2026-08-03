import { createClient } from '@supabase/supabase-js'

/**
 * Utility for Wildcard Cookie Management & Supabase Client Config across *.yundev.space
 */

const COOKIE_DOMAIN = typeof window !== 'undefined' && window.location.hostname.includes('yundev.space') ? '.yundev.space' : '';

export function setSharedCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const domainAttr = COOKIE_DOMAIN ? `; Domain=${COOKIE_DOMAIN}` : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domainAttr}; SameSite=Lax; Secure`;
}

export function getSharedCookie(name) {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0].trim() === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

export function removeSharedCookie(name) {
  const domainAttr = COOKIE_DOMAIN ? `; Domain=${COOKIE_DOMAIN}` : '';
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttr}`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Hybrid Shared Cookie Storage Adapter for Wildcard SSO (*.yundev.space)
export const cookieStorage = {
  getItem: (key) => {
    if (typeof document === 'undefined') return null;
    const cookieVal = getSharedCookie(key);
    if (cookieVal) return cookieVal;
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  },
  setItem: (key, value) => {
    setSharedCookie(key, value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    removeSharedCookie(key);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

const rawUrl = import.meta.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "";
const rawKey = import.meta.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isDummyUrl = !rawUrl || rawUrl.includes("your-project") || rawUrl.includes("abcdefghijklmnopqrst");

export const SUPABASE_CONFIG = {
  url: isDummyUrl ? "https://placeholder-supabase.supabase.co" : rawUrl,
  anonKey: isDummyUrl ? "dummy-key" : rawKey
};

// Initialize Supabase Client
export let supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'yundev_supabase_auth_token',
      storage: cookieStorage
    }
  }
);

// If static build had placeholder URL, attempt dynamic runtime fetch from /api/config
if (isDummyUrl) {
  fetch('/api/config')
    .then(res => res.json())
    .then(data => {
      if (data.supabaseUrl && data.supabaseAnonKey) {
        SUPABASE_CONFIG.url = data.supabaseUrl;
        SUPABASE_CONFIG.anonKey = data.supabaseAnonKey;
        supabase = createClient(data.supabaseUrl, data.supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'yundev_supabase_auth_token',
            storage: cookieStorage
          }
        });
      }
    })
    .catch(() => { });
}

// Auth Helpers
export async function signUpWithEmail(email, password) {
  return await supabase.auth.signUp({ email, password });
}

export async function signInWithEmail(email, password) {
  const res = await supabase.auth.signInWithPassword({ email, password });
  if (res.data?.session) {
    setSharedCookie('yundev_session', res.data.session.access_token);
    setSharedCookie('yundev_supabase_auth_token', JSON.stringify(res.data.session));
    if (typeof window !== 'undefined') {
      localStorage.setItem('yundev_session', res.data.session.access_token);
      localStorage.setItem('yundev_supabase_auth_token', JSON.stringify(res.data.session));
    }
  }
  return res;
}

export async function signOutUser() {
  removeSharedCookie('yundev_session');
  removeSharedCookie('yundev_supabase_auth_token');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('yundev_session');
    localStorage.removeItem('yundev_supabase_auth_token');
  }
  return await supabase.auth.signOut();
}

// Export helper function to synchronize wildcard session across yundev.space
export async function syncSharedSSOSession() {
  if (typeof window === 'undefined') return null;

  const sharedSessionCookie = getSharedCookie('yundev_supabase_auth_token');
  const sharedAccessToken = getSharedCookie('yundev_session');
  const { data: { session: currentSession } } = await supabase.auth.getSession();

  // 1. If yundev.space has NO shared session cookie, but local app has active session -> User logged out elsewhere!
  if (!sharedSessionCookie && !sharedAccessToken && currentSession) {
    console.log('[SSO Sync] Logout detected on shared domain. Signing out...');
    await signOutUser();
    return null;
  }

  // 2. If yundev.space HAS a shared session cookie, but local app has no session or token differs -> Sync login!
  if (sharedSessionCookie) {
    try {
      const parsedSession = JSON.parse(sharedSessionCookie);
      if (parsedSession && parsedSession.access_token) {
        if (!currentSession || currentSession.access_token !== parsedSession.access_token) {
          console.log('[SSO Sync] New login detected on shared domain. Synchronizing session...');
          const { data, error } = await supabase.auth.setSession({
            access_token: parsedSession.access_token,
            refresh_token: parsedSession.refresh_token || ''
          });
          if (!error && data.session) {
            return data.session.user;
          }
        }
      }
    } catch (err) {
      console.warn('[SSO Sync Parsing Error]:', err);
    }
  }

  return currentSession?.user || null;
}
