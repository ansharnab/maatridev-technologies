import { hasCustomLogo } from "./mediaType";

const DEFAULT_LOGO = "/logo-maatridev.svg";
const DEFAULT_LOGO_DARK = "/logo-maatridev-hero.svg";

export function isBuiltInLogo(url = "") {
  const u = String(url).trim();
  return !u || u.includes("logo-maatridev");
}

/** Resolve which logo URL to show (dark heroes were still using the built-in file). */
export function resolveLogoUrls(settings = {}, preferDark = false) {
  const primary = String(settings.logoImage || "").trim() || DEFAULT_LOGO;
  let onDark = String(settings.logoImageOnDark || "").trim();

  if (hasCustomLogo(primary) && isBuiltInLogo(onDark)) {
    onDark = primary;
  }
  if (!onDark) onDark = DEFAULT_LOGO_DARK;

  return {
    primary,
    onDark,
    display: preferDark ? onDark : primary,
    hasUpload: hasCustomLogo(primary) && !isBuiltInLogo(primary),
  };
}

/** Keep uploaded logo on both light and dark headers unless user set a custom on-dark file. */
export function logoSettingsAfterUpload(url, settings = {}) {
  const patch = {
    logoImage: url,
    logoUpdatedAt: Date.now(),
  };
  const onDark = String(settings.logoImageOnDark || "").trim();
  if (!onDark || isBuiltInLogo(onDark)) {
    patch.logoImageOnDark = url;
  }
  return patch;
}
