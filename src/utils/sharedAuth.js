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

/**
 * Supabase Client Configuration
 * Reads dynamically from Vite environment variables (.env / Vercel Environment Variables)
 */
export const SUPABASE_CONFIG = {
  url: import.meta.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co",
  anonKey: import.meta.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY"
};

// Initialize Supabase Client with cross-domain session support
export const supabase = createClient(
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
