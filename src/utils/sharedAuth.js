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

// Auto-sync valid Supabase credentials to shared wildcard cookie (.yundev.space)
if (SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.includes('your-project')) {
  setSharedCookie('yundev_supabase_url', SUPABASE_CONFIG.url);
  setSharedCookie('yundev_supabase_key', SUPABASE_CONFIG.anonKey);
}

/**
 * Helper to test connection with configured Supabase project
 */
export async function testSupabaseConnection() {
  if (!SUPABASE_CONFIG.url || SUPABASE_CONFIG.url.includes("your-project")) {
    return { success: false, message: "Chưa điền Supabase URL & Anon Key thực tế." };
  }

  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/`, {
      headers: { 'apikey': SUPABASE_CONFIG.anonKey }
    });
    if (res.ok) {
      return { success: true, message: "Kết nối thành công tới Supabase API!" };
    }
    return { success: false, message: `Máy chủ phản hồi mã lỗi: ${res.status}` };
  } catch (err) {
    return { success: false, message: `Lỗi kết nối mạng: ${err.message}` };
  }
}
