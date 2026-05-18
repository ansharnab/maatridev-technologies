export function isVideoUrl(url = "") {
  return /\.(mp4|webm)(\?|$)/i.test(String(url));
}

/** CMS logo field — image, SVG, or video (full brand lockup or mark only). */
export function hasCustomLogo(url = "") {
  return Boolean(String(url).trim());
}