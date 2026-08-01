/**
 * Utility for Wildcard Cookie Management across *.yundev.com subdomains
 */

const COOKIE_DOMAIN = window.location.hostname.includes('yundev.com') ? '.yundev.com' : '';

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
 * Supabase Config Placeholder
 * Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project credentials
 */
export const SUPABASE_CONFIG = {
  url: "https://ekyfmoouhgwggtiznxnz.supabase.co",
  anonKey: "sb_publishable_zfqS-5Y-9d8dYoTjPGp3CQ_gUTHa5U-"
};
