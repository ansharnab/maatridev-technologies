/** Theme presets & default section styles for the visual editor */

export const THEME_PRESETS = [
  {
    id: "brand",
    label: "MaatriDev Brand",
    icon: "fa-palette",
    swatch: "linear-gradient(135deg, #007cc3, #00b8a9)",
    style: {
      background: "linear-gradient(135deg, #0a1628 0%, #0d3d4a 100%)",
      textColor: "#e8f4fc",
      headingColor: "#ffffff",
      accentColor: "#007cc3",
    },
  },
  {
    id: "light",
    label: "Clean Light",
    icon: "fa-sun",
    swatch: "#f8fafc",
    style: {
      background: "#ffffff",
      textColor: "#475569",
      headingColor: "#0f172a",
      accentColor: "#007cc3",
    },
  },
  {
    id: "dark",
    label: "Dark Pro",
    icon: "fa-moon",
    swatch: "#0f172a",
    style: {
      background: "#0f172a",
      textColor: "#cbd5e1",
      headingColor: "#f8fafc",
      accentColor: "#00b8a9",
    },
  },
  {
    id: "gradient",
    label: "Blue Gradient",
    icon: "fa-water",
    swatch: "linear-gradient(90deg, #007cc3, #00b8a9)",
    style: {
      background: "linear-gradient(90deg, #007cc3, #00b8a9)",
      textColor: "#ffffff",
      headingColor: "#ffffff",
      accentColor: "#0a1628",
    },
  },
  {
    id: "warm",
    label: "Warm Accent",
    icon: "fa-fire",
    swatch: "#ea580c",
    style: {
      background: "#fff7ed",
      textColor: "#78350f",
      headingColor: "#431407",
      accentColor: "#ea580c",
    },
  },
  {
    id: "minimal",
    label: "Minimal Gray",
    icon: "fa-minus",
    swatch: "#e2e8f0",
    style: {
      background: "#f1f5f9",
      textColor: "#64748b",
      headingColor: "#1e293b",
      accentColor: "#334155",
    },
  },
];

export const PADDING_OPTIONS = [
  { id: "compact", label: "Compact", py: "2rem" },
  { id: "default", label: "Default", py: "3.5rem" },
  { id: "spacious", label: "Spacious", py: "5rem" },
];

export const DEFAULT_SECTION_STYLE = {
  theme: "brand",
  background: "",
  textColor: "",
  headingColor: "",
  accentColor: "",
  padding: "default",
  textAlign: "left",
  fontScale: 1,
};

const TYPE_STYLE_HINTS = {
  pageHero: { theme: "brand", padding: "default" },
  homeHero: { theme: "brand", padding: "spacious" },
  cta: { theme: "gradient", padding: "default", textAlign: "center" },
  featureStrip: { theme: "dark", padding: "default" },
  stats: { theme: "dark", padding: "compact" },
  servicesGrid: { theme: "light", padding: "default" },
  textContent: { theme: "light", padding: "default" },
  contactInfo: { theme: "light", padding: "default" },
  founders: { theme: "light", padding: "default" },
  contactForm: { theme: "light", padding: "default" },
};

export function defaultStyleForType(type) {
  return { ...DEFAULT_SECTION_STYLE, ...(TYPE_STYLE_HINTS[type] || {}) };
}

export function mergeSectionStyle(style = {}, type) {
  const base = defaultStyleForType(type);
  const preset = THEME_PRESETS.find((t) => t.id === (style.theme || base.theme));
  const fromPreset = preset?.style || {};
  return {
    ...base,
    ...fromPreset,
    ...style,
    background: style.background || fromPreset.background || base.background || "",
    textColor: style.textColor || fromPreset.textColor || "",
    headingColor: style.headingColor || fromPreset.headingColor || "",
    accentColor: style.accentColor || fromPreset.accentColor || "#007cc3",
  };
}

export function styleToCssVars(style, type) {
  const m = mergeSectionStyle(style, type);
  const pad = PADDING_OPTIONS.find((p) => p.id === m.padding) || PADDING_OPTIONS[1];
  return {
    "--ve-sec-bg": m.background || undefined,
    "--ve-sec-color": m.textColor || undefined,
    "--ve-sec-heading": m.headingColor || m.textColor || undefined,
    "--ve-sec-accent": m.accentColor || undefined,
    "--ve-sec-py": pad.py,
    "--ve-sec-align": m.textAlign || "left",
    "--ve-sec-scale": m.fontScale || 1,
  };
}

export function normalizeSection(section) {
  if (!section) return section;
  return {
    ...section,
    style: { ...defaultStyleForType(section.type), ...(section.style || {}) },
  };
}
