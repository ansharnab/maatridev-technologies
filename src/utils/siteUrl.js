/** Canonical site origin for SEO (set VITE_SITE_URL in .env). */
export const SITE_URL = String(
  import.meta.env.VITE_SITE_URL || import.meta.env.VITE_PUBLIC_URL || "https://maatridev.com",
)
  .trim()
  .replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function absoluteAssetUrl(url = "") {
  const u = String(url || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return absoluteUrl(u.startsWith("/") ? u : `/${u}`);
}
