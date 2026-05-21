import { HEADER_COLOR_GROUPS } from "./headerColorFields";

/** Routes that share a CMS page’s header override (matches builder preview nav). */
const PATH_TO_PAGE_ID = [
  ["/about", "about"],
  ["/services", "services"],
  ["/contact", "contact"],
  ["/pricing", "contact"],
  ["/appointment", "contact"],
  ["/engagement", "contact"],
  ["/team", "about"],
  ["/blog", "about"],
  ["/projects", "services"],
];

export const PAGE_HEADER_LOGO_KEYS = [
  "logoImage",
  "logoImageOnDark",
  "logoText",
  "logoLetter",
  "logoAnimation",
  "logoScale",
  "logoClipWidth",
  "logoColorPrimary",
  "logoColorAccent",
  "logoImageFilter",
  "headerLogoWordmarkFilter",
];

export const PAGE_HEADER_THEME_KEYS = [
  "headerDesign",
  "headerSize",
  "headerCtaLabel",
  "headerCtaLink",
  "headerCtaPresetId",
  "homeHeroTheme",
  "homeHeroGradient",
];

export const PAGE_HEADER_OVERRIDE_KEYS = [
  ...PAGE_HEADER_THEME_KEYS,
  ...PAGE_HEADER_LOGO_KEYS,
  ...HEADER_COLOR_GROUPS.flatMap((g) => g.fields.map((f) => f.key)),
];

export function pageIdFromPathname(pathname = "/") {
  if (pathname === "/" || pathname.startsWith("/home/")) return null;
  for (const [prefix, pageId] of PATH_TO_PAGE_ID) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return pageId;
  }
  return null;
}

export function pageUsesCustomHeader(headerSettings) {
  return Boolean(headerSettings && typeof headerSettings === "object" && Object.keys(headerSettings).length > 0);
}

/** Site settings with optional per-page overrides (only defined override keys win). */
export function mergePageHeaderSettings(siteSettings = {}, pageHeaderSettings = {}) {
  if (!pageUsesCustomHeader(pageHeaderSettings)) return { ...siteSettings };
  return { ...siteSettings, ...pageHeaderSettings };
}

export function getPageHeaderSettings(content, pageId) {
  if (!pageId || !content?.pages?.[pageId]) return {};
  return content.pages[pageId].headerSettings || {};
}

export function resolveSettingsForPath(siteSettings = {}, content = {}, pathname = "/") {
  const pageId = pageIdFromPathname(pathname);
  if (!pageId) return { ...siteSettings };
  const overrides = getPageHeaderSettings(content, pageId);
  return mergePageHeaderSettings(siteSettings, overrides);
}
