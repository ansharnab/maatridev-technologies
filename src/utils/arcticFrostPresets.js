/**
 * Arctic frost palette — icy blues, silver mist, polar gradients for home hero, sections, headers.
 */

/** @typedef {'homeHero'|'pageHero'|'section'|'headerHome'|'headerPage'} ArcticCategory */

/** @type {Array<{ id: string, label: string, heroTheme?: string, categories: ArcticCategory[], swatch: string, background: string, textColor: string, headingColor: string, accentColor: string, buttonBg: string, buttonColor: string, buttonHoverBg?: string }>} */
export const ARCTIC_FROST_GRADIENT_PRESETS = [
  {
    id: "g-arctic-frost",
    label: "Arctic frost",
    heroTheme: "arctic",
    categories: ["homeHero", "section", "headerHome", "headerPage"],
    swatch: "linear-gradient(135deg, #f0f9ff 0%, #7dd3fc 50%, #0ea5e9 100%)",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 28%, #bae6fd 52%, #38bdf8 78%, #0284c7 100%)",
    textColor: "#0c4a6e",
    headingColor: "#082f49",
    accentColor: "#0284c7",
    buttonBg: "#0284c7",
    buttonColor: "#ffffff",
    buttonHoverBg: "#0369a1",
  },
  {
    id: "g-arctic-frost-light",
    label: "Arctic frost light",
    heroTheme: "arctic-light",
    categories: ["homeHero", "section", "headerHome"],
    swatch: "linear-gradient(135deg, #ffffff, #e0f2fe, #bae6fd)",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 22%, #e0f2fe 48%, #bae6fd 72%, #7dd3fc 100%)",
    textColor: "#075985",
    headingColor: "#0c4a6e",
    accentColor: "#0ea5e9",
    buttonBg: "#0ea5e9",
    buttonColor: "#ffffff",
    buttonHoverBg: "#0284c7",
  },
  {
    id: "g-arctic-frost-deep",
    label: "Arctic frost deep",
    heroTheme: "arctic-deep",
    categories: ["homeHero", "section", "headerHome"],
    swatch: "linear-gradient(135deg, #0c4a6e, #0369a1, #38bdf8)",
    background: "linear-gradient(135deg, #082f49 0%, #0c4a6e 32%, #0369a1 58%, #0284c7 82%, #38bdf8 100%)",
    textColor: "#e0f2fe",
    headingColor: "#f0f9ff",
    accentColor: "#7dd3fc",
    buttonBg: "#38bdf8",
    buttonColor: "#082f49",
    buttonHoverBg: "#0ea5e9",
  },
  {
    id: "g-arctic-silver",
    label: "Silver frost",
    heroTheme: "arctic",
    categories: ["homeHero", "section", "headerPage", "pageHero"],
    swatch: "linear-gradient(135deg, #f8fafc, #cbd5e1, #94a3b8)",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 55%, #cbd5e1 75%, #94a3b8 100%)",
    textColor: "#334155",
    headingColor: "#0f172a",
    accentColor: "#64748b",
    buttonBg: "#475569",
    buttonColor: "#ffffff",
    buttonHoverBg: "#334155",
  },
  {
    id: "g-polar-glacier",
    label: "Polar glacier",
    heroTheme: "arctic-deep",
    categories: ["homeHero", "section", "headerHome"],
    swatch: "linear-gradient(125deg, #ecfeff, #22d3ee, #0891b2)",
    background: "linear-gradient(125deg, #ecfeff 0%, #cffafe 25%, #67e8f9 50%, #22d3ee 72%, #0891b2 100%)",
    textColor: "#164e63",
    headingColor: "#083344",
    accentColor: "#06b6d4",
    buttonBg: "#0891b2",
    buttonColor: "#ffffff",
    buttonHoverBg: "#0e7490",
  },
  {
    id: "g-icy-dawn",
    label: "Icy dawn",
    heroTheme: "arctic-light",
    categories: ["homeHero", "pageHero", "section", "headerHome", "headerPage"],
    swatch: "linear-gradient(120deg, #fdfefe, #a5f3fc, #38bdf8)",
    background: "linear-gradient(120deg, #fdfefe 0%, #f0fdfa 20%, #ecfeff 40%, #a5f3fc 65%, #38bdf8 100%)",
    textColor: "#155e75",
    headingColor: "#0e7490",
    accentColor: "#22d3ee",
    buttonBg: "#06b6d4",
    buttonColor: "#ffffff",
    buttonHoverBg: "#0891b2",
  },
];

export const ARCTIC_FROST_BUTTON_PRESETS = [
  { id: "btn-arctic-sky", label: "Arctic sky", bg: "#0ea5e9", color: "#ffffff", hover: "#0284c7" },
  { id: "btn-ice-blue", label: "Ice blue", bg: "#38bdf8", color: "#082f49", hover: "#0ea5e9" },
  { id: "btn-frost-white", label: "Frost white", bg: "#f0f9ff", color: "#0c4a6e", hover: "#e0f2fe" },
  { id: "btn-glacier", label: "Glacier teal", bg: "#0891b2", color: "#ffffff", hover: "#0e7490" },
  { id: "btn-polar-cyan", label: "Polar cyan", bg: "linear-gradient(90deg, #22d3ee, #0ea5e9)", color: "#ffffff", hover: "#0284c7" },
];

/** Live home + builder patch when an arctic / hero gradient swatch is chosen */
export function heroPatchFromGradientPreset(p) {
  if (!p) return {};
  const patch = {
    homeHeroGradient: p.background,
    headerPreviewHomeBg: p.background,
    headerGradientPresetId: p.id,
    headerCtaBg: p.buttonBg,
    headerCtaColor: p.buttonColor,
    headerCtaHoverBg: p.buttonHoverBg,
    headerCtaBorderColor: p.buttonBg,
  };
  if (p.heroTheme) patch.homeHeroTheme = p.heroTheme;
  return patch;
}

/** Extra fields for header theme one-click (merge with applyHeaderDesignPreset in headerTheme.js) */
export function arcticFrostThemeExtras(presetId) {
  const p = ARCTIC_FROST_GRADIENT_PRESETS.find((x) => x.id === presetId);
  if (!p) return {};
  const extras = {
    ...heroPatchFromGradientPreset(p),
    headerCtaBg: p.buttonBg,
    headerCtaColor: p.buttonColor,
    headerCtaHoverBg: p.buttonHoverBg,
  };
  if (p.heroTheme === "arctic-light") {
    extras.headerNavOnDark = "#075985";
    extras.headerBrandTextOnDark = "#0c4a6e";
    extras.headerBrandSubOnDark = "rgba(12, 74, 110, 0.75)";
  }
  return extras;
}
