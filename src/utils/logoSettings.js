import { hasCustomLogo } from "./mediaType";

const DEFAULT_LOGO = "/logo-maatridev.svg";
const DEFAULT_LOGO_DARK = "/logo-maatridev-hero.svg";

export function isBuiltInLogo(url = "") {
  const u = String(url).trim();
  return !u || u.includes("logo-maatridev");
}

/** Resolve which logo URL to show (dark heroes were still using the built-in file). */
export function resolveLogoUrls(settings = {}, preferDark = false) {
  const primaryRaw = String(settings.logoImage || "").trim();
  if (!primaryRaw) {
    return { primary: "", onDark: "", display: "", hasUpload: false };
  }
  const primary = primaryRaw;
  let onDark = String(settings.logoImageOnDark || "").trim();

  if (hasCustomLogo(primary) && !isBuiltInLogo(primary)) {
    // Main logo upload applies to dark heroes too (avoids stale logoImageOnDark showing old file)
    onDark = primary;
  } else if (isBuiltInLogo(onDark)) {
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

/** Site Content / media upload: one file updates header logo on light and dark backgrounds. */
export function logoSettingsAfterUpload(url, settings = {}) {
  void settings;
  return {
    logoImage: url,
    logoImageOnDark: url,
    logoUpdatedAt: Date.now(),
  };
}
