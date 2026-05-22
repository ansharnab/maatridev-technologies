import { ARCTIC_FROST_GRADIENT_PRESETS } from "../utils/arcticFrostPresets";
import {
  BUTTON_CLICK_PRESETS,
  EXTRA_GRADIENT_PRESETS,
  countExtraGradients,
  fullPatchFromGradientPreset,
  presetsForCategory,
} from "../utils/gradientPresets";

/**
 * Clear gradient picker — large clickable swatches with labels.
 */
export function GradientPresetGrid({
  presets = [],
  activeValue = "",
  activeId = "",
  onSelect,
  columns = 2,
  showHint = true,
}) {
  if (!presets.length) return null;

  return (
    <div className="scp-gradient-panel">
      {showHint && (
        <p className="scp-gradient-panel__hint">
          <i className="fa-solid fa-hand-pointer" aria-hidden="true" /> Click a color to apply instantly.
        </p>
      )}
      <div
        className="scp-gradient-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        role="list"
      >
        {presets.map((p) => {
          const bg = p.background || p.swatch;
          const isActive =
            (activeId && activeId === p.id) ||
            (activeValue && bg && activeValue.trim() === String(bg).trim());
          return (
            <button
              key={p.id}
              type="button"
              role="listitem"
              className={`scp-gradient-btn${isActive ? " is-active" : ""}`}
              title={p.label}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect?.(p);
              }}
            >
              <span className="scp-gradient-btn__swatch" style={{ background: p.swatch || bg }} />
              <span className="scp-gradient-btn__label">{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Button / CTA color chips — background + text preview pill */
export function ButtonColorPresetGrid({
  presets = BUTTON_CLICK_PRESETS,
  activeBg = "",
  onSelect,
}) {
  return (
    <div className="scp-gradient-panel scp-gradient-panel--buttons">
      <p className="scp-gradient-panel__hint">
        <i className="fa-solid fa-computer-mouse" aria-hidden="true" /> Button &amp; click colors — pick one, then
        fine-tune below.
      </p>
      <div className="scp-button-color-grid" role="list">
        {presets.map((p) => {
          const isActive = activeBg && String(activeBg).trim() === String(p.bg).trim();
          return (
            <button
              key={p.id}
              type="button"
              role="listitem"
              className={`scp-button-color-btn${isActive ? " is-active" : ""}`}
              title={p.label}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect?.(p);
              }}
            >
              <span
                className="scp-button-color-btn__pill"
                style={{
                  background: p.bg,
                  color: p.color,
                  border: p.border ? `2px solid ${p.border}` : "2px solid transparent",
                }}
              >
                Aa
              </span>
              <span className="scp-button-color-btn__label">{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Grouped: home hero, page banner, all section gradients */
export default function GradientPresetPanel({
  settings = {},
  onPatch,
  showHome = true,
  showPage = true,
  showSectionLink = true,
}) {
  const homePresets = presetsForCategory("homeHero");
  const pagePresets = presetsForCategory("pageHero");

  return (
    <section className="scp-section-card scp-gradient-presets-card">
      <h4>
        <i className="fa-solid fa-palette" aria-hidden="true" /> Hero &amp; gradient colors ({countExtraGradients()}+)
      </h4>
      <p className="scp-header-themes__intro">
        Pick a swatch — updates the <strong>preview on the right</strong> (header bar, button, hero background).
        Then click <strong>Save site content</strong> at the top for the live website.
      </p>

      {showHome && (
        <div className="scp-gradient-section">
          <p className="scp-sub-label scp-gradient-section__title">1. Home hero background</p>
          <p className="scp-sub-label scp-gradient-section__subtitle">Arctic frost (icy blues)</p>
          <GradientPresetGrid
            presets={ARCTIC_FROST_GRADIENT_PRESETS.filter((p) => p.categories.includes("homeHero"))}
            activeValue={settings.homeHeroGradient || settings.headerPreviewHomeBg}
            activeId={settings.headerGradientPresetId}
            onSelect={(p) => onPatch?.(fullPatchFromGradientPreset(p), p.label)}
          />
          <p className="scp-sub-label scp-gradient-section__subtitle">All home hero colors</p>
          <GradientPresetGrid
            presets={homePresets.filter((p) => !p.id.startsWith("g-arctic"))}
            activeValue={settings.homeHeroGradient || settings.headerPreviewHomeBg}
            activeId={settings.headerGradientPresetId}
            onSelect={(p) => onPatch?.(fullPatchFromGradientPreset(p), p.label)}
          />
        </div>
      )}

      {showPage && (
        <div className="scp-gradient-section">
          <p className="scp-sub-label scp-gradient-section__title">2. Page banner (About, Services…)</p>
          <GradientPresetGrid
            presets={pagePresets}
            activeValue={settings.headerPreviewPageBg}
            onSelect={(p) =>
              onPatch?.(
                {
                  ...fullPatchFromGradientPreset(p),
                  headerPreviewPageBg: p.background,
                  headerPageGradientPresetId: p.id,
                },
                p.label,
              )
            }
          />
        </div>
      )}

      {showSectionLink && (
        <div className="scp-gradient-section">
          <p className="scp-sub-label scp-gradient-section__title">3. All {countExtraGradients()} section gradients</p>
          <GradientPresetGrid
            presets={EXTRA_GRADIENT_PRESETS}
            columns={2}
            activeId={settings.sectionGradientPresetId}
            onSelect={(p) =>
              onPatch?.(
                {
                  sectionGradientPresetId: p.id,
                  sectionGradientSample: p.background,
                },
                `Section: ${p.label}`,
              )
            }
          />
          <p className="scp-note scp-note--tight">
            In the page builder: select a section → <strong>Design</strong> tab → same presets under theme colors.
          </p>
        </div>
      )}
    </section>
  );
}
