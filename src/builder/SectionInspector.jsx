import { useState } from "react";
import { SECTION_TYPES } from "./sectionRegistry";
import { DEFAULT_SECTION_STYLE, PADDING_OPTIONS, THEME_PRESETS } from "./editorTheme";

function ColorField({ label, value, onChange }) {
  return (
    <div className="ve-inspector__color">
      <label>
        <span>{label}</span>
        <input type="color" value={value || "#007cc3"} onChange={(e) => onChange(e.target.value)} />
        <input
          type="text"
          value={value || ""}
          placeholder="Auto from theme"
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

export default function SectionInspector({
  section,
  pageLabel = "",
  onChange,
  onStyleChange,
  onOpenSiteContent,
  onDuplicate,
  onDelete,
  onMove,
}) {
  const [tab, setTab] = useState("design");
  const def = section ? SECTION_TYPES[section.type] : null;
  const style = { ...DEFAULT_SECTION_STYLE, ...(section?.style || {}) };

  if (!section || !def) {
    return (
      <div className="ve-inspector ve-inspector--empty">
        <div className="ve-inspector__hero">
          <i className="fa-solid fa-hand-pointer" />
          <h3>Click a section to edit</h3>
          <p>
            {pageLabel ? (
              <>
                You are on <strong>{pageLabel}</strong>. Click a block in the preview, or use{" "}
                <strong>Home / About / Services / Contact</strong> in the header to switch pages.
              </>
            ) : (
              <>
                Click a block in the preview, or use header nav to switch pages. Logo opens site header
                settings.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  const updateProp = (key, value) => {
    onChange({ ...section, props: { ...section.props, [key]: value } });
  };

  const updateStyle = (patch) => {
    onStyleChange({ ...style, ...patch });
  };

  const applyTheme = (preset) => {
    onStyleChange({
      ...style,
      theme: preset.id,
      background: preset.style.background,
      textColor: preset.style.textColor,
      headingColor: preset.style.headingColor,
      accentColor: preset.style.accentColor,
    });
  };

  return (
    <div className="ve-inspector">
      <div className="ve-inspector__head">
        <i className={`fa-solid ${def.icon}`} />
        <div>
          <h3>{def.label}</h3>
          <p>Section selected — edits show live in preview</p>
        </div>
      </div>

      <div className="ve-inspector__tabs">
        {["design", "content", "actions"].map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? "is-active" : ""}
            onClick={() => setTab(t)}
          >
            {t === "design" ? "Design" : t === "content" ? "Content" : "Actions"}
          </button>
        ))}
      </div>

      {tab === "design" && (
        <div className="ve-inspector__panel">
          {section.type === "pageHero" && (
            <p className="ve-inspector__hint ve-inspector__hint--callout">
              This is the <strong>blue page banner</strong> (title area). Pick <strong>Blue page banner</strong> below
              for the standard look. Header bar colors are edited by clicking the logo in the preview.
            </p>
          )}
          <p className="ve-inspector__label">Theme presets</p>
          <div className="ve-inspector__themes">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={style.theme === preset.id ? "is-active" : ""}
                onClick={() => applyTheme(preset)}
                title={preset.label}
              >
                <span className="ve-inspector__swatch" style={{ background: preset.swatch }} />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          <p className="ve-inspector__label">Colors</p>
          {section.type === "pageHero" && (
            <div className="ve-inspector__chips" style={{ marginBottom: "0.5rem" }}>
              <button
                type="button"
                className={style.theme === "hero-banner" ? "is-active" : ""}
                onClick={() => {
                  const p = THEME_PRESETS.find((t) => t.id === "hero-banner");
                  if (p) applyTheme(p);
                }}
              >
                Blue banner
              </button>
              <button
                type="button"
                className={style.theme === "brand" ? "is-active" : ""}
                onClick={() => {
                  const p = THEME_PRESETS.find((t) => t.id === "brand");
                  if (p) applyTheme(p);
                }}
              >
                Dark navy
              </button>
            </div>
          )}
          <ColorField label="Background" value={style.background} onChange={(v) => updateStyle({ background: v })} />
          <ColorField label="Text" value={style.textColor} onChange={(v) => updateStyle({ textColor: v })} />
          <ColorField label="Headings" value={style.headingColor} onChange={(v) => updateStyle({ headingColor: v })} />
          <ColorField label="Buttons / accent" value={style.accentColor} onChange={(v) => updateStyle({ accentColor: v })} />

          <p className="ve-inspector__label">Spacing</p>
          <div className="ve-inspector__chips">
            {PADDING_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={style.padding === p.id ? "is-active" : ""}
                onClick={() => updateStyle({ padding: p.id })}
              >
                {p.label}
              </button>
            ))}
          </div>

          <p className="ve-inspector__label">Text alignment</p>
          <div className="ve-inspector__chips">
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                type="button"
                className={style.textAlign === align ? "is-active" : ""}
                onClick={() => updateStyle({ textAlign: align })}
              >
                <i className={`fa-solid fa-align-${align}`} /> {align}
              </button>
            ))}
          </div>

          <p className="ve-inspector__label">Text size ({Math.round((style.fontScale || 1) * 100)}%)</p>
          <input
            type="range"
            min="0.85"
            max="1.35"
            step="0.05"
            value={style.fontScale || 1}
            onChange={(e) => updateStyle({ fontScale: Number(e.target.value) })}
            className="ve-inspector__range"
          />
        </div>
      )}

      {tab === "content" && (
        <div className="ve-inspector__panel">
          {!def.fields?.length ? (
            <>
              <p className="ve-inspector__hint">
                This section uses global <strong>Site Content</strong> (logo, services, founders).
              </p>
              <button type="button" className="ve-btn ve-btn--primary ve-inspector__full" onClick={() => onOpenSiteContent?.()}>
                Open Site Content
              </button>
            </>
          ) : (
            <>
              <p className="ve-inspector__hint">Click highlighted text in the preview, or edit here.</p>
              {def.fields.map((field) => (
                <div key={field.key} className="field">
                  <label htmlFor={`ins-${field.key}`}>{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={`ins-${field.key}`}
                      value={section.props[field.key] ?? ""}
                      onChange={(e) => updateProp(field.key, e.target.value)}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={`ins-${field.key}`}
                      value={String(section.props[field.key] ?? field.options[0]?.value)}
                      onChange={(e) => {
                        const opt = field.options.find((o) => String(o.value) === e.target.value);
                        updateProp(field.key, opt?.value);
                      }}
                    >
                      {field.options.map((o) => (
                        <option key={String(o.value)} value={String(o.value)}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`ins-${field.key}`}
                      type="text"
                      value={section.props[field.key] ?? ""}
                      onChange={(e) => updateProp(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tab === "actions" && (
        <div className="ve-inspector__panel ve-inspector__actions">
          <button type="button" className="ve-btn" onClick={() => onMove(section.id, -1)}>
            <i className="fa-solid fa-arrow-up" /> Move up
          </button>
          <button type="button" className="ve-btn" onClick={() => onMove(section.id, 1)}>
            <i className="fa-solid fa-arrow-down" /> Move down
          </button>
          <button type="button" className="ve-btn" onClick={() => onDuplicate(section.id)}>
            <i className="fa-solid fa-copy" /> Duplicate
          </button>
          <button type="button" className="ve-btn ve-btn--danger" onClick={() => onDelete(section.id)}>
            <i className="fa-solid fa-trash" /> Delete section
          </button>
        </div>
      )}
    </div>
  );
}
