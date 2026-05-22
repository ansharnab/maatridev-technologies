import { useState } from "react";
import HeaderDesignGrid, { HeaderCtaColorGrid, headerDesignCount } from "./HeaderDesignGrid";
import { ButtonColorPresetGrid } from "./GradientPresetPanel";
import { colorPickerValue } from "../utils/headerColorFields";
import { countButtonPresets } from "../utils/gradientPresets";
import { applyHeaderCtaPreset, applyHeaderDesignPreset } from "../utils/headerTheme";

function ctaSwatchStyle(design) {
  const bg = String(design.ctaBg || "");
  if (bg.includes("gradient")) return { background: bg };
  return { background: bg || design.swatch };
}

export default function HeaderButtonColorPanel({
  settings = {},
  onPatch,
  saveHint = "Save site content at the top.",
}) {
  const [picked, setPicked] = useState("");

  const applyCta = (designId, label) => {
    const patch = applyHeaderCtaPreset(designId);
    onPatch?.(patch, label || designId);
    setPicked(label || designId);
    window.setTimeout(() => setPicked(""), 2400);
  };

  const patchField = (key, val) => {
    onPatch?.({ [key]: val, headerCtaPresetId: "" }, "Custom button color");
    setPicked("Custom color updated");
    window.setTimeout(() => setPicked(""), 2400);
  };

  const ctaBg = settings.headerCtaBg || "#007cc3";
  const ctaColor = settings.headerCtaColor || "#ffffff";

  return (
    <section className="scp-section-card scp-header-btn-panel">
      <h4>Appointment button colors</h4>
      <p className="scp-header-themes__intro">
        Pick a color below — only the header <strong>Book Appointment</strong> button changes. Then {saveHint}
      </p>

      <div className="scp-cta-live-preview">
        <span className="scp-cta-live-preview__label">Live button preview</span>
        <button
          type="button"
          className="scp-cta-live-preview__btn"
          style={{
            background: ctaBg,
            color: ctaColor,
            borderColor: settings.headerCtaBorderColor || ctaBg,
          }}
        >
          {settings.headerCtaLabel || "Book Appointment"}
        </button>
      </div>

      {picked && <p className="scp-cta-live-preview__status">{picked}</p>}

      <p className="scp-sub-label">Button colors — click to apply ({countButtonPresets()} presets)</p>
      <ButtonColorPresetGrid
        activeBg={ctaBg}
        onSelect={(p) => {
          onPatch?.(
            {
              headerCtaBg: p.bg,
              headerCtaColor: p.color,
              headerCtaHoverBg: p.hover || p.bg,
              headerCtaBorderColor: p.border || p.bg,
              headerCtaPresetId: p.id,
            },
            p.label,
          );
          setPicked(`Button: ${p.label}`);
          window.setTimeout(() => setPicked(""), 2400);
        }}
      />

      <p className="scp-sub-label">From header themes ({headerDesignCount()} — bottom pill only)</p>
      <HeaderCtaColorGrid
        activeCtaId={settings.headerCtaPresetId || ""}
        onSelectCta={(id) => {
          const d = applyHeaderCtaPreset(id);
          const label = `Button: ${id}`;
          onPatch?.(d);
          setPicked(label);
          window.setTimeout(() => setPicked(""), 2400);
        }}
        swatchStyle={ctaSwatchStyle}
      />

      <div className="scp-row-2 scp-cta-pickers">
        <div className="scp-color-field">
          <label>Button background</label>
          <div className="scp-color-field__row">
            <input
              type="color"
              value={colorPickerValue(ctaBg, "#007cc3")}
              onChange={(e) => patchField("headerCtaBg", e.target.value)}
            />
            <input
              type="text"
              value={ctaBg}
              onChange={(e) => patchField("headerCtaBg", e.target.value)}
            />
          </div>
        </div>
        <div className="scp-color-field">
          <label>Button text color</label>
          <div className="scp-color-field__row">
            <input
              type="color"
              value={colorPickerValue(ctaColor, "#ffffff")}
              onChange={(e) => patchField("headerCtaColor", e.target.value)}
            />
            <input
              type="text"
              value={ctaColor}
              onChange={(e) => patchField("headerCtaColor", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="scp-color-field">
        <label>Button label</label>
        <input
          type="text"
          value={settings.headerCtaLabel || "Book Appointment"}
          onChange={(e) => onPatch?.({ headerCtaLabel: e.target.value })}
        />
      </div>

      <p className="scp-sub-label">More button styles (click bottom pill on each card — top stripe changes full header)</p>
      <HeaderDesignGrid
        activeBarId={settings.headerDesign || "glass"}
        activeCtaId={settings.headerCtaPresetId || ""}
        onSelectBar={(id) => {
          onPatch?.(applyHeaderDesignPreset(id));
          setPicked(`Header bar: ${id}`);
          window.setTimeout(() => setPicked(""), 2400);
        }}
        onSelectCta={(id) => applyCta(id, `Button style: ${id}`)}
        maxHeight={220}
      />
    </section>
  );
}
