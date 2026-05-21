/**
 * Extra gradient & button presets — home hero, page banners, sections, CTAs.
 * Includes Arctic frost family (icy blues) + 20+ core palettes.
 * Used in Site Content, page builder section inspector, and header color panels.
 */

import {
  ARCTIC_FROST_BUTTON_PRESETS,
  ARCTIC_FROST_GRADIENT_PRESETS,
  arcticFrostThemeExtras,
  heroPatchFromGradientPreset,
} from "./arcticFrostPresets";
import { applyHeaderDesignPreset } from "./headerTheme";

export { heroPatchFromGradientPreset } from "./arcticFrostPresets";

/** Map gradient swatch → header bar design so clicks visibly change the live preview */
const GRADIENT_TO_HEADER_DESIGN = {
  "g-aurora": "maatridevHome",
  "g-midnight-glow": "midnight",
  "g-ocean-depth": "ocean",
  "g-sunset-blaze": "sunset",
  "g-forest-mist": "emerald",
  "g-royal-plum": "royal",
  "g-cyber-neon": "cyber",
  "g-rose-garden": "rose",
  "g-golden-hour": "copper",
  "g-arctic-frost": "arctic",
  "g-arctic-frost-light": "arctic",
  "g-arctic-frost-deep": "fadeArcticMidnight",
  "g-arctic-silver": "mistLight",
  "g-polar-glacier": "fadeSnowTeal",
  "g-icy-dawn": "arctic",
  "g-corp-cobalt": "maatridevPage",
  "g-indigo-wave": "indigoCorp",
  "g-slate-professional": "slate",
  "g-mint-fresh": "sage",
  "g-wine-luxury": "rose",
  "g-lavender-dream": "royal",
};

/** One click: hero/banner gradient + header bar + button colors (visible in Brand preview) */
export function fullPatchFromGradientPreset(p) {
  if (!p) return {};
  const heroPatch = heroPatchFromGradientPreset(p);
  if (p.id.startsWith("g-arctic")) {
    return {
      ...applyHeaderDesignPreset(GRADIENT_TO_HEADER_DESIGN[p.id] || "arctic"),
      ...arcticFrostThemeExtras(p.id),
      ...heroPatch,
    };
  }
  const designId = GRADIENT_TO_HEADER_DESIGN[p.id];
  if (designId) {
    return { ...applyHeaderDesignPreset(designId), ...heroPatch };
  }
  return heroPatch;
}

/** @typedef {'homeHero'|'pageHero'|'section'|'headerHome'|'headerPage'|'button'} GradientCategory */

/** @type {Array<{ id: string, label: string, heroTheme?: string, categories: GradientCategory[], swatch: string, background: string, textColor: string, headingColor: string, accentColor: string, buttonBg: string, buttonColor: string, buttonHoverBg?: string }>} */
const CORE_EXTRA_GRADIENT_PRESETS = [
  {
    id: "g-aurora",
    label: "Aurora teal",
    categories: ["homeHero", "section", "headerHome"],
    swatch: "linear-gradient(125deg, #0a1628 0%, #0d4a6e 40%, #00b8a9 100%)",
    background: "linear-gradient(125deg, #0a1628 0%, #003d5c 45%, #007cc3 72%, #00b8a9 100%)",
    textColor: "#e0f2fe",
    headingColor: "#ffffff",
    accentColor: "#00b8a9",
    buttonBg: "#007cc3",
    buttonColor: "#ffffff",
    buttonHoverBg: "#006aa8",
  },
  {
    id: "g-midnight-glow",
    label: "Midnight glow",
    categories: ["homeHero", "section", "headerHome"],
    swatch: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    textColor: "#e9d5ff",
    headingColor: "#faf5ff",
    accentColor: "#a78bfa",
    buttonBg: "#7c3aed",
    buttonColor: "#ffffff",
    buttonHoverBg: "#6d28d9",
  },
  {
    id: "g-ocean-depth",
    label: "Ocean depth",
    categories: ["homeHero", "section", "headerHome"],
    swatch: "linear-gradient(90deg, #0077b6, #00b4d8, #90e0ef)",
    background: "linear-gradient(90deg, #023e8a 0%, #0077b6 40%, #00b4d8 75%, #caf0f8 100%)",
    textColor: "#caf0f8",
    headingColor: "#ffffff",
    accentColor: "#00b4d8",
    buttonBg: "#0096c7",
    buttonColor: "#ffffff",
    buttonHoverBg: "#0077b6",
  },
  {
    id: "g-sunset-blaze",
    label: "Sunset blaze",
    categories: ["homeHero", "section"],
    swatch: "linear-gradient(90deg, #ff6b35, #f7931e, #c73e1d)",
    background: "linear-gradient(90deg, #7c2d12 0%, #ea580c 35%, #f97316 65%, #fb923c 100%)",
    textColor: "#ffedd5",
    headingColor: "#ffffff",
    accentColor: "#fbbf24",
    buttonBg: "#ea580c",
    buttonColor: "#ffffff",
    buttonHoverBg: "#c2410c",
  },
  {
    id: "g-forest-mist",
    label: "Forest mist",
    categories: ["homeHero", "section"],
    swatch: "linear-gradient(135deg, #064e3b, #10b981, #6ee7b7)",
    background: "linear-gradient(135deg, #022c22 0%, #065f46 45%, #059669 70%, #34d399 100%)",
    textColor: "#d1fae5",
    headingColor: "#ecfdf5",
    accentColor: "#34d399",
    buttonBg: "#059669",
    buttonColor: "#ffffff",
    buttonHoverBg: "#047857",
  },
  {
    id: "g-royal-plum",
    label: "Royal plum",
    categories: ["homeHero", "section", "headerHome"],
    swatch: "linear-gradient(135deg, #4c1d95, #7c3aed, #c4b5fd)",
    background: "linear-gradient(135deg, #2e1065 0%, #5b21b6 40%, #7c3aed 70%, #a78bfa 100%)",
    textColor: "#ede9fe",
    headingColor: "#ffffff",
    accentColor: "#c4b5fd",
    buttonBg: "#7c3aed",
    buttonColor: "#ffffff",
    buttonHoverBg: "#6d28d9",
  },
  {
    id: "g-cyber-neon",
    label: "Cyber neon",
    categories: ["homeHero", "section"],
    swatch: "linear-gradient(90deg, #0a1628, #00d4ff)",
    background: "linear-gradient(90deg, #020617 0%, #0a1628 40%, #003d5c 70%, #00d4ff 100%)",
    textColor: "#a5f3fc",
    headingColor: "#ecfeff",
    accentColor: "#00d4ff",
    buttonBg: "#00d4ff",
    buttonColor: "#0a1628",
    buttonHoverBg: "#22d3ee",
  },
  {
    id: "g-rose-garden",
    label: "Rose garden",
    categories: ["homeHero", "section"],
    swatch: "linear-gradient(135deg, #881337, #be185d, #f9a8d4)",
    background: "linear-gradient(135deg, #500724 0%, #9d174d 45%, #db2777 75%, #fbcfe8 100%)",
    textColor: "#fce7f3",
    headingColor: "#ffffff",
    accentColor: "#f9a8d4",
    buttonBg: "#db2777",
    buttonColor: "#ffffff",
    buttonHoverBg: "#be185d",
  },
  {
    id: "g-golden-hour",
    label: "Golden hour",
    categories: ["homeHero", "section"],
    swatch: "linear-gradient(135deg, #78350f, #d97706, #fcd34d)",
    background: "linear-gradient(135deg, #451a03 0%, #b45309 40%, #f59e0b 70%, #fde68a 100%)",
    textColor: "#fef3c7",
    headingColor: "#fffbeb",
    accentColor: "#fbbf24",
    buttonBg: "#d97706",
    buttonColor: "#ffffff",
    buttonHoverBg: "#b45309",
  },
  {
    id: "g-corp-cobalt",
    label: "Corp cobalt",
    categories: ["pageHero", "section", "headerPage"],
    swatch: "linear-gradient(135deg, #007cc3, #003d5c)",
    background: "linear-gradient(135deg, #007cc3 0%, #006aa8 38%, #003d5c 100%)",
    textColor: "#e0f2fe",
    headingColor: "#ffffff",
    accentColor: "#00b8a9",
    buttonBg: "#007cc3",
    buttonColor: "#ffffff",
    buttonHoverBg: "#006aa8",
  },
  {
    id: "g-indigo-wave",
    label: "Indigo wave",
    categories: ["pageHero", "section", "headerPage"],
    swatch: "linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa)",
    background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
    textColor: "#dbeafe",
    headingColor: "#ffffff",
    accentColor: "#60a5fa",
    buttonBg: "#2563eb",
    buttonColor: "#ffffff",
    buttonHoverBg: "#1d4ed8",
  },
  {
    id: "g-slate-professional",
    label: "Slate pro",
    categories: ["pageHero", "section"],
    swatch: "linear-gradient(90deg, #1e293b, #475569, #94a3b8)",
    background: "linear-gradient(90deg, #0f172a 0%, #334155 50%, #64748b 100%)",
    textColor: "#e2e8f0",
    headingColor: "#f8fafc",
    accentColor: "#38bdf8",
    buttonBg: "#334155",
    buttonColor: "#ffffff",
    buttonHoverBg: "#1e293b",
  },
  {
    id: "g-mint-fresh",
    label: "Mint fresh",
    categories: ["pageHero", "section"],
    swatch: "linear-gradient(135deg, #ecfdf5, #6ee7b7, #10b981)",
    background: "linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 40%, #34d399 75%, #059669 100%)",
    textColor: "#064e3b",
    headingColor: "#022c22",
    accentColor: "#059669",
    buttonBg: "#10b981",
    buttonColor: "#ffffff",
    buttonHoverBg: "#059669",
  },
  {
    id: "g-wine-luxury",
    label: "Wine luxury",
    categories: ["pageHero", "section"],
    swatch: "linear-gradient(135deg, #450a0a, #991b1b, #fca5a5)",
    background: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 45%, #b91c1c 75%, #fecaca 100%)",
    textColor: "#fee2e2",
    headingColor: "#ffffff",
    accentColor: "#fca5a5",
    buttonBg: "#b91c1c",
    buttonColor: "#ffffff",
    buttonHoverBg: "#991b1b",
  },
  {
    id: "g-lavender-dream",
    label: "Lavender dream",
    categories: ["section", "pageHero"],
    swatch: "linear-gradient(135deg, #ede9fe, #a78bfa, #7c3aed)",
    background: "linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 40%, #a78bfa 70%, #6d28d9 100%)",
    textColor: "#4c1d95",
    headingColor: "#2e1065",
    accentColor: "#7c3aed",
    buttonBg: "#7c3aed",
    buttonColor: "#ffffff",
    buttonHoverBg: "#6d28d9",
  },
  {
    id: "g-charcoal-gold",
    label: "Charcoal gold",
    categories: ["section"],
    swatch: "linear-gradient(135deg, #18181b, #3f3f46, #fbbf24)",
    background: "linear-gradient(135deg, #09090b 0%, #27272a 55%, #52525b 80%, #fbbf24 100%)",
    textColor: "#fafafa",
    headingColor: "#ffffff",
    accentColor: "#fbbf24",
    buttonBg: "#ca8a04",
    buttonColor: "#18181b",
    buttonHoverBg: "#a16207",
  },
  {
    id: "g-candy-pop",
    label: "Candy pop",
    categories: ["section"],
    swatch: "linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4)",
    background: "linear-gradient(90deg, #db2777 0%, #8b5cf6 45%, #06b6d4 100%)",
    textColor: "#ffffff",
    headingColor: "#ffffff",
    accentColor: "#fde047",
    buttonBg: "#ec4899",
    buttonColor: "#ffffff",
    buttonHoverBg: "#db2777",
  },
  {
    id: "g-earth-clay",
    label: "Earth clay",
    categories: ["section"],
    swatch: "linear-gradient(135deg, #44403c, #a8a29e, #d6d3d1)",
    background: "linear-gradient(135deg, #292524 0%, #57534e 50%, #a8a29e 100%)",
    textColor: "#fafaf9",
    headingColor: "#ffffff",
    accentColor: "#f59e0b",
    buttonBg: "#78716c",
    buttonColor: "#ffffff",
    buttonHoverBg: "#57534e",
  },
  {
    id: "g-electric-lime",
    label: "Electric lime",
    categories: ["section"],
    swatch: "linear-gradient(90deg, #14532d, #84cc16, #bef264)",
    background: "linear-gradient(90deg, #052e16 0%, #15803d 40%, #84cc16 80%, #ecfccb 100%)",
    textColor: "#ecfccb",
    headingColor: "#ffffff",
    accentColor: "#a3e635",
    buttonBg: "#65a30d",
    buttonColor: "#ffffff",
    buttonHoverBg: "#4d7c0f",
  },
];

/** Core palettes + Arctic frost icy family */
export const EXTRA_GRADIENT_PRESETS = [...CORE_EXTRA_GRADIENT_PRESETS, ...ARCTIC_FROST_GRADIENT_PRESETS];

/** One-click button / link colors (header CTA, hero buttons, accents) */
export const BUTTON_CLICK_PRESETS = [
  { id: "btn-md-blue", label: "Infosys blue", bg: "#007cc3", color: "#ffffff", hover: "#006aa8" },
  { id: "btn-md-teal", label: "Teal accent", bg: "#00b8a9", color: "#ffffff", hover: "#009688" },
  { id: "btn-cyan", label: "Bright cyan", bg: "#0099ff", color: "#ffffff", hover: "#0077cc" },
  { id: "btn-sky", label: "Sky blue", bg: "#0ea5e9", color: "#ffffff", hover: "#0284c7" },
  { id: "btn-indigo", label: "Indigo", bg: "#4f46e5", color: "#ffffff", hover: "#4338ca" },
  { id: "btn-violet", label: "Violet", bg: "#7c3aed", color: "#ffffff", hover: "#6d28d9" },
  { id: "btn-purple", label: "Purple", bg: "#9333ea", color: "#ffffff", hover: "#7e22ce" },
  { id: "btn-rose", label: "Rose", bg: "#e11d48", color: "#ffffff", hover: "#be123c" },
  { id: "btn-pink", label: "Pink", bg: "#ec4899", color: "#ffffff", hover: "#db2777" },
  { id: "btn-orange", label: "Orange", bg: "#ea580c", color: "#ffffff", hover: "#c2410c" },
  { id: "btn-amber", label: "Amber", bg: "#d97706", color: "#ffffff", hover: "#b45309" },
  { id: "btn-lime", label: "Lime", bg: "#65a30d", color: "#ffffff", hover: "#4d7c0f" },
  { id: "btn-emerald", label: "Emerald", bg: "#059669", color: "#ffffff", hover: "#047857" },
  { id: "btn-slate", label: "Slate", bg: "#334155", color: "#ffffff", hover: "#1e293b" },
  { id: "btn-navy", label: "Navy", bg: "#0a1628", color: "#ffffff", hover: "#003d5c" },
  { id: "btn-white", label: "White pill", bg: "#ffffff", color: "#0a1628", hover: "#f1f5f9" },
  { id: "btn-outline", label: "Outline white", bg: "transparent", color: "#ffffff", hover: "rgba(255,255,255,0.15)", border: "rgba(255,255,255,0.65)" },
  { id: "btn-gradient-teal", label: "Gradient teal", bg: "linear-gradient(90deg, #007cc3, #00b8a9)", color: "#ffffff", hover: "#006aa8" },
  { id: "btn-gradient-sunset", label: "Gradient sunset", bg: "linear-gradient(90deg, #f97316, #ec4899)", color: "#ffffff", hover: "#ea580c" },
  { id: "btn-gradient-violet", label: "Gradient violet", bg: "linear-gradient(90deg, #6d28d9, #2563eb)", color: "#ffffff", hover: "#5b21b6" },
  ...ARCTIC_FROST_BUTTON_PRESETS,
];

const CATEGORY_ALIASES = {
  headerHome: "homeHero",
  headerPage: "pageHero",
};

export function presetsForCategory(category) {
  const cat = CATEGORY_ALIASES[category] || category;
  return EXTRA_GRADIENT_PRESETS.filter((p) => p.categories.includes(cat));
}

export function presetById(id) {
  return EXTRA_GRADIENT_PRESETS.find((p) => p.id === id);
}

/** Map to page-builder section theme preset shape */
export function toSectionThemePreset(p) {
  return {
    id: p.id,
    label: p.label,
    icon: "fa-droplet",
    swatch: p.swatch,
    style: {
      background: p.background,
      textColor: p.textColor,
      headingColor: p.headingColor,
      accentColor: p.accentColor,
    },
  };
}

export const EXTRA_SECTION_THEME_PRESETS = EXTRA_GRADIENT_PRESETS.map(toSectionThemePreset);

export function countExtraGradients() {
  return EXTRA_GRADIENT_PRESETS.length;
}

export function countButtonPresets() {
  return BUTTON_CLICK_PRESETS.length;
}
