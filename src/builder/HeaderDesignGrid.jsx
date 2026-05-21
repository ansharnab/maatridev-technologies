import { HEADER_DESIGNS } from "../utils/headerTheme";

/**
 * Full bar + CTA swatch grid (same designs as Page Builder → Site header & colors).
 */
export default function HeaderDesignGrid({
  designs = Object.values(HEADER_DESIGNS),
  activeId = "",
  onSelect,
  maxHeight = 340,
}) {
  return (
    <div className="scp-header-design-grid" style={{ maxHeight }}>
      {designs.map((d) => (
        <button
          key={d.id}
          type="button"
          className={`scp-header-design-card${activeId === d.id ? " is-active" : ""}`}
          title={`${d.label} — also sets appointment button colors`}
          onClick={() => onSelect?.(d.id)}
        >
          <span className="scp-header-design-card__bar" style={{ background: d.swatch }} />
          <span
            className="scp-header-design-card__cta"
            style={{ background: d.ctaBg, color: d.ctaColor }}
            aria-hidden
          />
          <span className="scp-header-design-card__label">{d.label}</span>
        </button>
      ))}
    </div>
  );
}

export function headerDesignCount() {
  return Object.keys(HEADER_DESIGNS).length;
}
