import { useEffect, useRef, useState } from "react";
import HeaderDesignGrid, { headerDesignCount } from "./HeaderDesignGrid";
import HeaderButtonColorPanel from "./HeaderButtonColorPanel";
import GradientPresetPanel, { GradientPresetGrid } from "./GradientPresetPanel";
import SiteContentHeaderColors from "./SiteContentHeaderColors";
import { presetsForCategory, fullPatchFromGradientPreset } from "../utils/gradientPresets";
import ImageField from "./ImageField";
import { logoSettingsAfterUpload } from "../utils/logoSettings";
import { PREVIEW_NAV } from "./previewNav";
import {
  HEADER_FADE_LIGHT_TO_BLUE_IDS,
  HEADER_LIGHT_DESIGN_IDS,
  HEADER_SIZES,
  HEADER_THEME_PRESETS,
  applyHeaderCtaPreset,
  applyHeaderDesignPreset,
  headerQuickPresets,
} from "../utils/headerTheme";
import { LOGO_IMAGE_FILTER_PRESETS } from "../utils/logoImageFilters";
import { isBuiltInLogo } from "../utils/logoSettings";
import { hasCustomLogo } from "../utils/mediaType";
import {
  HEADER_COLOR_GROUPS,
  HEADER_COLOR_SWATCHES,
  colorPickerValue,
  countHeaderColorFields,
} from "../utils/headerColorFields";
import { PAGE_HEADER_OVERRIDE_KEYS } from "../utils/pageHeaderSettings";

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
  { value: "arctic", label: "Arctic Frost (icy blue)" },
  { value: "arctic-light", label: "Arctic Frost Light (white ice)" },
  { value: "arctic-deep", label: "Arctic Frost Deep (navy ice)" },
];

function ColorField({ field, value, onChange }) {
  const v = value ?? field.default;
  const type = field.type || "color";

  if (type === "logoFilter") {
    return (
      <div className="field ve-header-color-field">
        <label htmlFor={`hdr-${field.key}`}>{field.label}</label>
        <select id={`hdr-${field.key}`} value={v || "none"} onChange={(e) => onChange(e.target.value)}>
          {LOGO_IMAGE_FILTER_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

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
  scope = "site",
  pageLabel = "",
  siteSettings = {},
  pageHeaderCustom = false,
  onClearPageHeader,
  settings = {},
  focusField,
  currentPageId,
  onNavigatePage,
  onChange,
  onSaveSettings,
  saving = false,
  onOpenSiteContent,
}) {
  const isPageScope = scope === "page";
  const patch = (p) => {
    if (!onChange) return;
    if (isPageScope) onChange(p);
    else onChange({ ...settings, ...p });
  };
  const ctaRef = useRef(null);
  const brandRef = useRef(null);
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
    <div className={`ve-inspector ve-inspector--header-colors${isPageScope ? " ve-inspector--page-header" : ""}`}>
      <div className="ve-inspector__head">
        <i className="fa-solid fa-palette" />
        <div>
          <h3>{isPageScope ? `Page header · ${pageLabel}` : "Site header & colors"}</h3>
          <p>
            {isPageScope
              ? pageHeaderCustom
                ? "Overrides site-wide header for this page only"
                : "Using site-wide header from Site Content"
              : `${totalColors} color controls · live preview`}
          </p>
        </div>
      </div>

      {isPageScope && (
        <div className="ve-page-header-toggle">
          <p className="ve-inspector__scroll-hint ve-page-header-toggle__hint">
            {pageHeaderCustom
              ? "This page has its own header. Click any theme to change it, then Save draft / Publish."
              : "Click any theme, gradient, or button color below to customize this page — no checkbox needed."}
          </p>
          <div className="ve-page-header-toggle__actions">
            <button
              type="button"
              className="ve-btn ve-btn--small ve-btn--primary"
              onClick={() => {
                const pick = {};
                for (const key of PAGE_HEADER_OVERRIDE_KEYS) {
                  if (siteSettings[key] !== undefined && siteSettings[key] !== "") {
                    pick[key] = siteSettings[key];
                  }
                }
                onChange?.(pick);
              }}
            >
              Copy site header to this page
            </button>
            {pageHeaderCustom && (
              <button type="button" className="ve-btn ve-btn--small" onClick={() => onClearPageHeader?.()}>
                Reset to site default
              </button>
            )}
          </div>
        </div>
      )}

      <p className="ve-inspector__scroll-hint">
        {isPageScope
          ? "Themes and colors apply to this page only. Site Content still controls the global default."
          : `Scroll this panel for all ${totalColors} colors, logo upload, and CTA. Use the Save buttons at the bottom.`}
      </p>

      <div className="ve-inspector__panel ve-inspector__panel--scroll">
        <div className="ve-inspector__gradient-block">
          <GradientPresetPanel
            settings={settings}
            onPatch={patch}
            showHome
            showPage={isPageScope}
            showSectionLink={!isPageScope}
          />
        </div>

        <HeaderButtonColorPanel
          settings={settings}
          onPatch={patch}
          saveHint={
            isPageScope
              ? "Save draft or Publish to apply on this page."
              : "Save site content at the top to apply on the live site."
          }
        />

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
          Light header bars ({HEADER_LIGHT_DESIGN_IDS.length}) — white &amp; pastel; dark nav text
        </p>
        <div className="ve-header-design-grid ve-header-design-grid--compact">
          {headerQuickPresets(HEADER_LIGHT_DESIGN_IDS).map((p) => (
            <button
              key={p.id}
              type="button"
              className={`ve-header-design-card${designId === p.id ? " is-active" : ""}`}
              onClick={() => patch(p.patch())}
            >
              <span className="ve-header-design-card__swatch" style={{ background: p.swatch }} />
              <span className="ve-header-design-card__label">{p.label}</span>
            </button>
          ))}
        </div>

        <p className="ve-inspector__label">Light → blue fades ({HEADER_FADE_LIGHT_TO_BLUE_IDS.length})</p>
        <div className="ve-header-design-grid ve-header-design-grid--compact">
          {headerQuickPresets(HEADER_FADE_LIGHT_TO_BLUE_IDS).map((p) => (
            <button
              key={p.id}
              type="button"
              className={`ve-header-design-card${designId === p.id ? " is-active" : ""}`}
              onClick={() => patch(p.patch())}
            >
              <span className="ve-header-design-card__swatch" style={{ background: p.swatch }} />
              <span className="ve-header-design-card__label">{p.label}</span>
            </button>
          ))}
        </div>

        <p className="ve-inspector__label">
          All bar + button designs ({headerDesignCount()} gradients &amp; colors)
        </p>
        <p className="ve-inspector__scroll-hint" style={{ marginTop: "-0.25rem" }}>
          Bar stripe + button pill — same as Site Content → Brand &amp; Logo.
        </p>
        <div className="ve-header-design-grid-wrap">
          <HeaderDesignGrid
            activeBarId={designId}
            activeCtaId={settings.headerCtaPresetId || designId}
            onSelectBar={(id) => patch(applyHeaderDesignPreset(id))}
            onSelectCta={(id) => patch(applyHeaderCtaPreset(id))}
            maxHeight={280}
          />
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

        {isPageScope && (
          <div className="ve-inspector__site-colors-wrap">
            <SiteContentHeaderColors settings={settings} onPatch={patch} />
          </div>
        )}

        <p className="ve-inspector__label">Home hero type (agency variant)</p>
        <div className="ve-inspector__chips">
          {HERO_THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={
                (settings.homeHeroTheme || siteSettings.homeHeroTheme || "it") === t.value ? "is-active" : ""
              }
              onClick={() => patch({ homeHeroTheme: t.value })}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="ve-inspector__label">Live home hero gradient</p>
        <GradientPresetGrid
          presets={presetsForCategory("homeHero")}
          activeValue={settings.homeHeroGradient || settings.headerPreviewHomeBg}
          columns={2}
          onSelect={(p) => patch(fullPatchFromGradientPreset(p))}
        />
        <div className="field">
          <label htmlFor="hdr-hero-gradient">Custom gradient (advanced)</label>
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

        <p ref={brandRef} className="ve-inspector__label" id="ve-inspector-brand">
          Brand & logo
        </p>
        <ImageField
          allowVideo
          label="Logo image or video"
          hint="PNG/SVG with transparent background. Saves automatically after upload."
          value={settings.logoImage || ""}
          onChange={(url) => {
            if (!url) {
              patch({ logoImage: "", logoImageOnDark: "/logo-maatridev-hero.svg" });
              return;
            }
            const logoPatch = url.startsWith("/uploads/")
              ? logoSettingsAfterUpload(url, settings)
              : { logoImage: url };
            patch(logoPatch);
            if (url.startsWith("/uploads/")) onSaveSettings?.({ ...settings, ...logoPatch });
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
            min="0.5"
            max="1.8"
            step="0.05"
            value={Number(settings.logoScale) || 1}
            onChange={(e) => patch({ logoScale: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label htmlFor="hdr-logo-clip">Logo max width (px) — crop / enlarge</label>
          <input
            id="hdr-logo-clip"
            type="number"
            min="100"
            max="480"
            value={Number(settings.logoClipWidth) || 300}
            onChange={(e) => patch({ logoClipWidth: Number(e.target.value) })}
          />
        </div>

        {hasCustomLogo(settings.logoImage) && !isBuiltInLogo(settings.logoImage) && (
          <>
            <p className="ve-inspector__label">Uploaded logo tone (CSS filter)</p>
            <div className="ve-inspector__chips">
              {LOGO_IMAGE_FILTER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={(settings.logoImageFilter || "none") === p.id ? "is-active" : ""}
                  onClick={() => patch({ logoImageFilter: p.id })}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}

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
          {saving
            ? "Saving…"
            : isPageScope
              ? "Save — logo size applies site-wide"
              : `Save header & logo (${totalColors} colors)`}
        </button>
        <button type="button" className="ve-btn ve-inspector__full" onClick={() => onOpenSiteContent?.("brand")}>
          <i className="fa-solid fa-sliders" />{" "}
          {isPageScope ? "Site-wide header & logo (all pages)" : "More logo options (Site Content)"}
        </button>
      </div>
    </div>
  );
}
