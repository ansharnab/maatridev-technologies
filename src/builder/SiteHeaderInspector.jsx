import { useEffect, useRef, useState } from "react";
import ImageField from "./ImageField";
import { logoSettingsAfterUpload } from "../utils/logoSettings";
import { PREVIEW_NAV } from "./previewNav";
import {
  HEADER_DESIGNS,
  HEADER_SIZES,
  HEADER_THEME_PRESETS,
  applyHeaderDesignPreset,
} from "../utils/headerTheme";
import {
  HEADER_COLOR_GROUPS,
  HEADER_COLOR_SWATCHES,
  colorPickerValue,
  countHeaderColorFields,
} from "../utils/headerColorFields";

const LOGO_ANIMATIONS = [
  { value: "gradient", label: "Gradient" },
  { value: "pulse", label: "Pulse" },
  { value: "glow", label: "Glow" },
  { value: "orbit", label: "Orbit" },
  { value: "none", label: "Static" },
];

const HERO_THEMES = [
  { value: "it", label: "IT Solutions (teal — live home)" },
  { value: "digital", label: "Digital Agency (purple → teal)" },
  { value: "web", label: "Web Agency (purple)" },
  { value: "startup", label: "Startup (slate)" },
];

function ColorField({ field, value, onChange }) {
  const v = value ?? field.default;
  const type = field.type || "color";

  if (type === "text") {
    return (
      <div className="field ve-header-color-field">
        <label htmlFor={`hdr-${field.key}`}>{field.label}</label>
        <input
          id={`hdr-${field.key}`}
          type="text"
          value={v}
          placeholder={field.default}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  const picker = colorPickerValue(v, colorPickerValue(field.default));
  return (
    <div className="ve-inspector__color ve-header-color-field">
      <label>
        <span>{field.label}</span>
        <input
          type="color"
          value={picker}
          onChange={(e) => onChange(e.target.value)}
          title="Solid color — use text field for rgba / gradients"
        />
        <input
          type="text"
          value={v}
          placeholder={field.default}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

export default function SiteHeaderInspector({
  settings = {},
  focusField,
  currentPageId,
  onNavigatePage,
  onChange,
  onSaveSettings,
  saving = false,
  onOpenSiteContent,
}) {
  const patch = (p) => onChange?.({ ...settings, ...p });
  const ctaRef = useRef(null);
  const designId = settings.headerDesign || "glass";
  const [activeColorKey, setActiveColorKey] = useState("headerCtaBg");
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(HEADER_COLOR_GROUPS.map((g) => [g.id, true])),
  );
  const totalColors = countHeaderColorFields();

  useEffect(() => {
    if (focusField === "cta" && ctaRef.current) {
      ctaRef.current.focus();
      ctaRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusField]);

  const applySwatch = (hex) => {
    if (!activeColorKey) return;
    patch({ [activeColorKey]: hex });
  };

  const toggleGroup = (id) => {
    setOpenGroups((g) => ({ ...g, [id]: !g[id] }));
  };

  return (
    <div className="ve-inspector ve-inspector--header-colors">
      <div className="ve-inspector__head">
        <i className="fa-solid fa-palette" />
        <div>
          <h3>Site header & colors</h3>
          <p>{totalColors} color controls · live preview</p>
        </div>
      </div>

      <p className="ve-inspector__scroll-hint">
        Scroll this panel for all {totalColors} colors, logo upload, and CTA. Use the Save buttons at the bottom.
      </p>

      <div className="ve-inspector__panel ve-inspector__panel--scroll">
        <p className="ve-inspector__label">
          Quick themes ({HEADER_THEME_PRESETS.length}) — ★ = MaatriDev live site
        </p>
        <div className="ve-inspector__chips">
          {HEADER_THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.description}
              onClick={() => patch(preset.patch())}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <p className="ve-inspector__label">
          Header design ({Object.keys(HEADER_DESIGNS).length} gradients &amp; colors)
        </p>
        <div className="ve-header-design-grid">
          {Object.values(HEADER_DESIGNS).map((d) => (
            <button
              key={d.id}
              type="button"
              className={`ve-header-design-card${designId === d.id ? " is-active" : ""}`}
              onClick={() => patch(applyHeaderDesignPreset(d.id))}
            >
              <span className="ve-header-design-card__swatch" style={{ background: d.swatch }} />
              <span className="ve-header-design-card__label">{d.label}</span>
            </button>
          ))}
        </div>

        <p className="ve-inspector__label">Header size</p>
        <div className="ve-inspector__chips">
          {Object.values(HEADER_SIZES).map((s) => (
            <button
              key={s.id}
              type="button"
              className={(settings.headerSize || "default") === s.id ? "is-active" : ""}
              onClick={() => patch({ headerSize: s.id })}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="ve-inspector__label ve-inspector__label--strong">
          Color swatches ({HEADER_COLOR_SWATCHES.length}) — click swatch, then pick target field below
        </p>
        <div className="ve-color-swatch-grid">
          {HEADER_COLOR_SWATCHES.map((s) => (
            <button
              key={s.id}
              type="button"
              className="ve-color-swatch"
              title={`Apply ${s.label} to active field`}
              style={{ background: s.hex }}
              onClick={() => applySwatch(s.hex)}
            />
          ))}
        </div>
        <div className="field">
          <label htmlFor="hdr-active-color">Apply swatches to field #</label>
          <select
            id="hdr-active-color"
            value={activeColorKey}
            onChange={(e) => setActiveColorKey(e.target.value)}
          >
            {HEADER_COLOR_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {g.fields.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {HEADER_COLOR_GROUPS.map((group) => (
          <div key={group.id} className="ve-header-color-group">
            <button
              type="button"
              className="ve-header-color-group__toggle"
              onClick={() => toggleGroup(group.id)}
            >
              <i className={`fa-solid fa-chevron-${openGroups[group.id] ? "down" : "right"}`} />
              {group.label}
            </button>
            {openGroups[group.id] &&
              group.fields.map((field) => (
                <ColorField
                  key={field.key}
                  field={field}
                  value={settings[field.key]}
                  onChange={(v) => patch({ [field.key]: v })}
                />
              ))}
          </div>
        ))}

        <p className="ve-inspector__label">Home hero (live site, behind header)</p>
        <div className="field">
          <label htmlFor="hdr-hero-theme">Hero preset</label>
          <select
            id="hdr-hero-theme"
            value={settings.homeHeroTheme || "it"}
            onChange={(e) => patch({ homeHeroTheme: e.target.value })}
          >
            {HERO_THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="hdr-hero-gradient">Custom hero gradient</label>
          <input
            id="hdr-hero-gradient"
            type="text"
            placeholder="linear-gradient(125deg, #0a1628, #003d5c)"
            value={settings.homeHeroGradient || ""}
            onChange={(e) => patch({ homeHeroGradient: e.target.value })}
          />
        </div>

        <p className="ve-inspector__label">Preview page</p>
        <div className="ve-inspector__chips ve-inspector__chips--pages">
          {PREVIEW_NAV.map((item) => (
            <button
              key={`${item.pageId}-${item.label}`}
              type="button"
              className={currentPageId === item.pageId ? "is-active" : ""}
              onClick={() => onNavigatePage?.(item.pageId)}
              title={item.path ? `Live route: ${item.path}` : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="ve-inspector__label">Brand & logo</p>
        <ImageField
          allowVideo
          label="Logo image or video"
          hint="PNG/SVG with transparent background. Saves automatically after upload."
          value={settings.logoImage || ""}
          onChange={(url) => {
            const next = { ...settings, logoImage: url };
            patch({ logoImage: url });
            if (url.startsWith("/uploads/")) onSaveSettings?.(next);
          }}
        />
        <div className="field">
          <label htmlFor="hdr-logo-ondark">Logo on dark header (optional)</label>
          <input
            id="hdr-logo-ondark"
            type="text"
            placeholder="/logo-maatridev-hero.svg"
            value={settings.logoImageOnDark || ""}
            onChange={(e) => patch({ logoImageOnDark: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="hdr-logo-text">Brand name</label>
          <input
            id="hdr-logo-text"
            type="text"
            value={settings.logoText || ""}
            onChange={(e) => patch({ logoText: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="hdr-logo-letter">Logo letter</label>
          <input
            id="hdr-logo-letter"
            type="text"
            maxLength={2}
            value={settings.logoLetter || "M"}
            onChange={(e) => patch({ logoLetter: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="hdr-logo-anim">Logo animation</label>
          <select
            id="hdr-logo-anim"
            value={settings.logoAnimation || "gradient"}
            onChange={(e) => patch({ logoAnimation: e.target.value })}
          >
            {LOGO_ANIMATIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="hdr-logo-scale">Logo scale ({settings.logoScale ?? 1})</label>
          <input
            id="hdr-logo-scale"
            type="range"
            min="0.6"
            max="1.6"
            step="0.05"
            value={Number(settings.logoScale) || 1}
            onChange={(e) => patch({ logoScale: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label htmlFor="hdr-logo-clip">Logo max width (px)</label>
          <input
            id="hdr-logo-clip"
            type="number"
            min="120"
            max="420"
            value={Number(settings.logoClipWidth) || 300}
            onChange={(e) => patch({ logoClipWidth: Number(e.target.value) })}
          />
        </div>

        <p className="ve-inspector__label">Appointment button</p>
        <div className="field">
          <label htmlFor="hdr-cta-label">Button text</label>
          <input
            ref={ctaRef}
            id="hdr-cta-label"
            type="text"
            value={settings.headerCtaLabel || "Book Appointment"}
            onChange={(e) => patch({ headerCtaLabel: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="hdr-cta-link">Button link</label>
          <input
            id="hdr-cta-link"
            type="text"
            value={settings.headerCtaLink || "/appointment"}
            onChange={(e) => patch({ headerCtaLink: e.target.value })}
          />
        </div>

      </div>

      <div className="ve-inspector__sticky-actions">
        <button
          type="button"
          className="ve-btn ve-btn--primary ve-inspector__full"
          disabled={saving}
          onClick={() => onSaveSettings?.()}
        >
          {saving ? "Saving…" : `Save header & logo (${totalColors} colors)`}
        </button>
        <button type="button" className="ve-btn ve-inspector__full" onClick={() => onOpenSiteContent?.("brand")}>
          <i className="fa-solid fa-sliders" /> More logo options (Site Content)
        </button>
      </div>
    </div>
  );
}
