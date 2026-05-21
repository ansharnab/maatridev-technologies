import { homeVariants } from "../data/siteData";

/** Live site routes → HomePage variant index (matches App.jsx) */
export const HOME_PATH_TO_VARIANT = {
  "/": 4,
  "/home/web-agency": 1,
  "/home/startup-agency": 2,
  "/home/digital-agency": 3,
  "/home/it-solution": 4,
};

/** Header preview backdrop behind nav (matches hero themes) */
export const HOME_PATH_PREVIEW_BG = {
  "/": "linear-gradient(125deg, #0a1628 0%, #003d5c 55%, #004d73 100%)",
  "/home/web-agency": "linear-gradient(125deg, #1a0a2e 0%, #4a148c 50%, #007cc3 100%)",
  "/home/startup-agency": "linear-gradient(125deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "/home/digital-agency": "linear-gradient(125deg, #1a1040 0%, #4c1d95 42%, #007cc3 72%, #00b8a9 100%)",
  "/home/it-solution": "linear-gradient(125deg, #0a1628 0%, #003d5c 55%, #004d73 100%)",
};

export function homeVariantForPath(path = "/") {
  return HOME_PATH_TO_VARIANT[path] ?? null;
}

export function homeAgencyLabel(path = "/") {
  const variant = homeVariantForPath(path);
  if (!variant) return null;
  return homeVariants[variant]?.label ?? null;
}

export function homeHeroPropsForVariant(variant) {
  const v = homeVariants[variant];
  if (!v) return null;
  return {
    eyebrow: v.eyebrow,
    title: v.title,
    subtitle: v.subtitle,
    primaryLabel: v.cta,
    primaryLink: "/contact",
    secondaryLabel: "View Services",
    secondaryLink: "/services",
    heroTheme: v.theme,
  };
}

/** Swap home hero section to match agency homepage in page builder */
export function sectionsWithHomeAgency(sections, path) {
  const variant = homeVariantForPath(path);
  if (!variant) return sections;
  const heroProps = homeHeroPropsForVariant(variant);
  if (!heroProps) return sections;
  return sections.map((s) =>
    s.type === "homeHero" ? { ...s, props: { ...s.props, ...heroProps } } : s,
  );
}

export function previewBgForHomePath(path, settings = {}) {
  return (
    HOME_PATH_PREVIEW_BG[path] ||
    settings.headerPreviewHomeBg ||
    HOME_PATH_PREVIEW_BG["/"]
  );
}
