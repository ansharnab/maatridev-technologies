import HeaderCtaColorGrid, { headerDesignCount } from "./HeaderDesignGrid";
import { HEADER_BEAUTY_PALETTES, SITE_CONTENT_HEADER_COLOR_UI } from "../utils/headerTextPalettes";
import { applyHeaderCtaPreset } from "../utils/headerTheme";
import { colorPickerValue } from "../utils/headerColorFields";

function ColorRow({ field, value, onChange }) {
  const v = value ?? field.default;
  if (field.type === "text") {
    return (
      <div className="scp-color-field">
        <label>{field.label}</label>
        <input type="text" value={v} onChange={(e) => onChange(field.key, e.target.value)} />
      </div>
    );
  }
  const picker = colorPickerValue(v, colorPickerValue(field.default));
  return (
    <div className="scp-color-field">
      <label>{field.label}</label>
      <div className="scp-color-field__row">
        <input
          type="color"
          value={picker}
          onChange={(e) => onChange(field.key, e.target.value)}
          title={field.label}
        />
        <input type="text" value={v} onChange={(e) => onChange(field.key, e.target.value)} />
      </div>
    </div>
  );
}

export default function SiteContentHeaderColors({ settings = {}, onPatch }) {
  const patchField = (key, val) => onPatch?.({ [key]: val });

  return (
    <section className="scp-section-card scp-header-text-colors">
      <h4>Menu, brand text &amp; button</h4>
      <p className="scp-header-themes__intro">
        Change header link colors, brand title, and the appointment button. Pick a palette or fine-tune below.
      </p>

      <p className="scp-sub-label">Appointment button only ({headerDesignCount()} colors)</p>
      <p className="scp-header-themes__intro">
        Click any swatch below to change <strong>only</strong> the header button — bar and menu stay as they are.
      </p>
      <HeaderCtaColorGrid
        activeCtaId={settings.headerCtaPresetId || settings.headerDesign || ""}
        onSelectCta={(id) => onPatch?.(applyHeaderCtaPreset(id))}
      />

      <p className="scp-sub-label">Beautiful palettes (menu + brand + button)</p>
      <div className="scp-palette-chips">
        {HEADER_BEAUTY_PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            className="scp-palette-chip"
            title={p.label}
            onClick={() => onPatch?.(p.patch)}
          >
            <span className="scp-palette-chip__swatch" style={{ background: p.swatch }} />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {SITE_CONTENT_HEADER_COLOR_UI.map((group) => (
        <div key={group.id} className="scp-header-color-group">
          <p className="scp-sub-label">{group.label}</p>
          {group.fields.map((field) => (
            <ColorRow
              key={field.key}
              field={field}
              value={settings[field.key]}
              onChange={patchField}
            />
          ))}
        </div>
      ))}
    </section>
  );
}
