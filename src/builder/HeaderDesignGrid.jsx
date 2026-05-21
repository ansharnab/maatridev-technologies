import { HEADER_DESIGNS, applyHeaderCtaPreset } from "../utils/headerTheme";

/**
 * Bar stripe + CTA pill — separate clicks for header bar vs button only.
 */
export default function HeaderDesignGrid({
  designs = Object.values(HEADER_DESIGNS),
  activeBarId = "",
  activeCtaId = "",
  onSelectBar,
  onSelectCta,
  maxHeight = 340,
}) {
  return (
    <div className="scp-header-design-grid-wrap">
      <p className="scp-header-design-grid__hint">
        <strong>Top stripe</strong> = change header bar (full theme).{" "}
        <strong>Bottom pill</strong> = button color only.
      </p>
      <div className="scp-header-design-grid" style={{ maxHeight }}>
        {designs.map((d) => {
          const barActive = activeBarId === d.id;
          const ctaActive = activeCtaId === d.id;
          return (
            <div
              key={d.id}
              className={[
                "scp-header-design-card",
                barActive ? "is-active-bar" : "",
                ctaActive ? "is-active-cta" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <button
                type="button"
                className="scp-header-design-card__bar-btn"
                style={{ background: d.swatch }}
                title={`${d.label} — header bar + full theme`}
                aria-label={`Header bar: ${d.label}`}
                onClick={() => onSelectBar?.(d.id)}
              />
              <button
                type="button"
                className="scp-header-design-card__cta-btn"
                style={{ background: d.ctaBg, color: d.ctaColor }}
                title={`${d.label} — button color only`}
                aria-label={`Button color: ${d.label}`}
                onClick={() => onSelectCta?.(d.id)}
              />
              <span className="scp-header-design-card__label">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function headerDesignCount() {
  return Object.keys(HEADER_DESIGNS).length;
}

/** Compact row — button colors only */
export function HeaderCtaColorGrid({ designs = Object.values(HEADER_DESIGNS), activeCtaId = "", onSelectCta }) {
  return (
    <div className="scp-cta-color-grid" role="list">
      {designs.map((d) => (
        <button
          key={d.id}
          type="button"
          role="listitem"
          className={`scp-cta-color-swatch${activeCtaId === d.id ? " is-active" : ""}`}
          style={{ background: d.ctaBg, color: d.ctaColor }}
          title={d.label}
          aria-label={`Button: ${d.label}`}
          onClick={() => onSelectCta?.(d.id)}
        />
      ))}
    </div>
  );
}

