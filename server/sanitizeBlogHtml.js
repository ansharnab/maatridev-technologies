/** Strip unsafe markup from generated blog HTML before storage. */
export function sanitizeBlogHtml(html = "") {
  let out = String(html);
  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  out = out.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "");
  out = out.replace(/javascript:/gi, "");
  return out.trim();
}
