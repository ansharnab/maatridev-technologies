/** All header color settings — 28+ fields + 54 swatches in Site Header inspector */

export const HEADER_COLOR_SWATCHES = [
  { id: "white", hex: "#ffffff", label: "White" },
  { id: "navy", hex: "#0a1628", label: "Navy" },
  { id: "blue", hex: "#007cc3", label: "Infosys blue" },
  { id: "cyan", hex: "#0099ff", label: "Cyan" },
  { id: "teal", hex: "#00b8a9", label: "Teal" },
  { id: "purple", hex: "#2d1b4e", label: "Purple" },
  { id: "indigo", hex: "#1a3a5c", label: "Indigo" },
  { id: "deep", hex: "#003366", label: "Deep blue" },
  { id: "slate", hex: "#1a2b3c", label: "Slate text" },
  { id: "mist", hex: "#e2e8f0", label: "Mist" },
  { id: "gold", hex: "#f5a623", label: "Gold" },
  { id: "coral", hex: "#ff6b35", label: "Coral" },
  { id: "lime", hex: "#84cc16", label: "Lime" },
  { id: "pink", hex: "#ec4899", label: "Pink" },
  { id: "black", hex: "#000000", label: "Black" },
  { id: "gray", hex: "#64748b", label: "Gray" },
  { id: "ice", hex: "#f0f9ff", label: "Ice" },
  { id: "sky", hex: "#38bdf8", label: "Sky" },
  { id: "mint", hex: "#6ee7b7", label: "Mint" },
  { id: "wine", hex: "#881337", label: "Wine" },
  { id: "amber", hex: "#fbbf24", label: "Amber" },
  { id: "forest", hex: "#166534", label: "Forest" },
  { id: "lavender", hex: "#a78bfa", label: "Lavender" },
  { id: "charcoal", hex: "#334155", label: "Charcoal" },
  { id: "ocean", hex: "#0077b6", label: "Ocean" },
  { id: "sunset", hex: "#ff6b35", label: "Sunset" },
  { id: "midnight", hex: "#302b63", label: "Midnight" },
  { id: "emerald", hex: "#10b981", label: "Emerald" },
  { id: "royal", hex: "#7c3aed", label: "Royal" },
  { id: "cyber", hex: "#00d4ff", label: "Cyber" },
  { id: "rose", hex: "#ec4899", label: "Rose" },
  { id: "arctic", hex: "#7dd3fc", label: "Arctic" },
  { id: "copper", hex: "#d97706", label: "Copper" },
  /* MaatriDev site palette (+20) */
  { id: "md-navy", hex: "#0a1628", label: "MD Navy" },
  { id: "md-deep", hex: "#003d5c", label: "MD Deep blue" },
  { id: "md-pacific", hex: "#004d73", label: "MD Pacific" },
  { id: "md-blue", hex: "#007cc3", label: "MD Infosys blue" },
  { id: "md-blue-hover", hex: "#006aa8", label: "MD Blue hover" },
  { id: "md-teal", hex: "#00b8a9", label: "MD Teal accent" },
  { id: "md-cyan", hex: "#0099ff", label: "MD Cyan CTA" },
  { id: "md-purple", hex: "#2d1b4e", label: "MD Agency purple" },
  { id: "md-indigo", hex: "#1a3a5c", label: "MD Indigo" },
  { id: "md-corp", hex: "#003366", label: "MD Corporate" },
  { id: "md-menu", hex: "#0f2844", label: "MD Menu navy" },
  { id: "md-menu2", hex: "#0c2238", label: "MD Menu edge" },
  { id: "md-text", hex: "#1a2b3c", label: "MD Body text" },
  { id: "md-ice", hex: "#f0f9ff", label: "MD Ice bg" },
  { id: "md-mist", hex: "#f4f7fb", label: "MD Mist panel" },
  { id: "md-canvas", hex: "#f0f4f8", label: "MD Editor bg" },
  { id: "md-nav-active", hex: "#00b8a9", label: "MD Nav active" },
  { id: "md-sky", hex: "#38bdf8", label: "MD Sky highlight" },
  { id: "md-violet", hex: "#6d28d9", label: "MD Violet agency" },
  { id: "md-pearl", hex: "#f4f8fc", label: "MD Pearl text" },
  { id: "md-hero-mid", hex: "#0099cc", label: "MD Hero mid" },
];

export const HEADER_COLOR_GROUPS = [
  {
    id: "bar",
    label: "Header bar (5)",
    fields: [
      { key: "headerBarOverHero", label: "1. Bar over hero", default: "rgba(10, 22, 40, 0.55)" },
      { key: "headerBarBackground", label: "2. Bar background", default: "rgba(10, 22, 40, 0.55)" },
      { key: "headerBarScrolled", label: "3. Bar when scrolled", default: "rgba(255, 255, 255, 0.92)" },
      { key: "headerBarBorderColor", label: "4. Bar bottom border", default: "rgba(255, 255, 255, 0.12)" },
      { key: "headerBarShadowColor", label: "5. Bar shadow", default: "rgba(0, 40, 80, 0.08)" },
    ],
  },
  {
    id: "nav",
    label: "Navigation links (9 fields)",
    fields: [
      { key: "headerNavOnDark", label: "6. Menu text (dark bar)", default: "#ffffff" },
      { key: "headerNavOnLight", label: "7. Menu text (light bar)", default: "#1a2b3c" },
      { key: "headerNavHoverColor", label: "8. Menu hover text", default: "#ffffff" },
      { key: "headerNavHoverBg", label: "9. Menu hover background", default: "rgba(255, 255, 255, 0.12)" },
      { key: "headerNavActiveColor", label: "10. Active link text", default: "#ffffff" },
      { key: "headerNavActiveBg", label: "11. Active link background", default: "rgba(0, 184, 169, 0.35)" },
      { key: "headerDropdownBg", label: "12. Dropdown background", default: "rgba(255, 255, 255, 0.96)" },
      { key: "headerDropdownText", label: "13. Dropdown link text", default: "#1a2b3c" },
      { key: "headerDropdownHoverBg", label: "14. Dropdown hover bg", default: "#f4f7fb" },
    ],
  },
  {
    id: "brand",
    label: "Logo & brand (6)",
    fields: [
      { key: "headerBrandTextOnDark", label: "15. Brand title (dark bar)", default: "#ffffff" },
      { key: "headerBrandSubtextOnDark", label: "16. Brand subtitle (dark bar)", default: "rgba(255, 255, 255, 0.88)" },
      { key: "logoColorPrimary", label: "17. Logo icon primary", default: "#007cc3" },
      { key: "logoColorAccent", label: "18. Logo icon accent", default: "#00b8a9" },
      { key: "logoImageFilter", label: "19. Logo tone preset", default: "none", type: "logoFilter" },
      { key: "headerLogoWordmarkFilter", label: "20. Logo custom CSS filter", default: "none", type: "text" },
    ],
  },
  {
    id: "cta",
    label: "CTA button (4)",
    fields: [
      { key: "headerCtaBg", label: "21. Button background", default: "#007cc3" },
      { key: "headerCtaColor", label: "22. Button text", default: "#ffffff" },
      { key: "headerCtaHoverBg", label: "23. Button hover background", default: "#006aa8" },
      { key: "headerCtaBorderColor", label: "24. Button border", default: "#007cc3" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile menu (3)",
    fields: [
      { key: "headerToggleBg", label: "25. Hamburger background", default: "rgba(255, 255, 255, 0.1)" },
      { key: "headerToggleBorderColor", label: "26. Hamburger border", default: "rgba(255, 255, 255, 0.25)" },
      { key: "headerToggleIconColor", label: "27. Hamburger icon lines", default: "#ffffff" },
    ],
  },
  {
    id: "preview",
    label: "Builder preview backdrop (2)",
    fields: [
      { key: "headerPreviewHomeBg", label: "28. Preview: home hero behind header", default: "linear-gradient(125deg, #0a1628, #003d5c, #004d73)", type: "gradient" },
      { key: "headerPreviewPageBg", label: "29. Preview: page banner behind header", default: "linear-gradient(135deg, #007cc3, #003d5c)", type: "gradient" },
    ],
  },
];

export function countHeaderColorFields() {
  return HEADER_COLOR_GROUPS.reduce((n, g) => n + g.fields.length, 0);
}

export function getHeaderColorDefaults() {
  const out = {};
  for (const group of HEADER_COLOR_GROUPS) {
    for (const f of group.fields) {
      out[f.key] = f.default;
    }
  }
  return out;
}

/** Pick hex for native color input when value is rgba/gradient */
export function colorPickerValue(value, fallback = "#007cc3") {
  if (!value || typeof value !== "string") return fallback;
  const hex6 = value.match(/#[0-9A-Fa-f]{6}/);
  if (hex6) return hex6[0];
  const hex3 = value.match(/#[0-9A-Fa-f]{3}/);
  if (hex3) {
    const h = hex3[0];
    return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return fallback;
}
