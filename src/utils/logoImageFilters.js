/** CSS filter presets for uploaded logo images (PNG/SVG/video) in the header */

export const LOGO_IMAGE_FILTER_PRESETS = [
  { id: "none", label: "Original", css: "none" },
  { id: "bright", label: "Brighter", css: "brightness(1.12) contrast(1.05)" },
  { id: "white", label: "White (dark bar)", css: "brightness(0) invert(1)" },
  { id: "dark", label: "Darker", css: "brightness(0.75) contrast(1.15)" },
  { id: "teal", label: "Teal tint", css: "sepia(0.35) hue-rotate(145deg) saturate(1.35)" },
  { id: "blue", label: "Blue tint", css: "sepia(0.25) hue-rotate(185deg) saturate(1.25)" },
  { id: "muted", label: "Soft / muted", css: "saturate(0.55) brightness(0.92)" },
];

export function resolveLogoImageFilter(presetId = "none") {
  const id = String(presetId || "none").trim();
  const preset = LOGO_IMAGE_FILTER_PRESETS.find((p) => p.id === id);
  return preset?.css || "none";
}

/** Custom CSS filter text wins over preset id */
export function resolveHeaderLogoFilter(settings = {}) {
  const custom = String(settings.headerLogoWordmarkFilter || "").trim();
  if (custom && custom !== "none") return custom;
  return resolveLogoImageFilter(settings.logoImageFilter);
}
