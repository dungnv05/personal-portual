import { createClient } from '@supabase/supabase-js'

/**
 * Utility for Wildcard Cookie Management & Supabase Client Config across *.yundev.space
 */

const COOKIE_DOMAIN = window.location.hostname.includes('yundev.space') ? '.yundev.space' : '';

export function setSharedCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const domainAttr = COOKIE_DOMAIN ? `; Domain=${COOKIE_DOMAIN}` : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domainAttr}; SameSite=Lax; Secure`;
}

export function getSharedCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

export function removeSharedCookie(name) {
  const domainAttr = COOKIE_DOMAIN ? `; Domain=${COOKIE_DOMAIN}` : '';
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttr}`;
}

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
      storageKey: 'yundev_supabase_auth_token'
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
            storageKey: 'yundev_supabase_auth_token'
          }
        });
      }
    })
    .catch(() => {});
}

// Auth Helpers
export async function signUpWithEmail(email, password) {
  return await supabase.auth.signUp({ email, password });
}

export async function signInWithEmail(email, password) {
  const res = await supabase.auth.signInWithPassword({ email, password });
  if (res.data?.session) {
    setSharedCookie('yundev_session', res.data.session.access_token);
  }
  return res;
}

export async function signOutUser() {
  removeSharedCookie('yundev_session');
  return await supabase.auth.signOut();
}
