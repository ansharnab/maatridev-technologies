import { useEffect, useRef } from "react";
import { PAGE_OPTIONS } from "./sectionRegistry";
import { PREVIEW_NAV } from "./PreviewChrome";

const LOGO_ANIMATIONS = [
  { value: "gradient", label: "Gradient" },
  { value: "pulse", label: "Pulse" },
  { value: "spin", label: "Spin" },
  { value: "glow", label: "Glow" },
  { value: "none", label: "Static" },
];

export default function SiteHeaderInspector({
  settings = {},
  focusField,
  currentPageId,
  onNavigatePage,
  onChange,
  onOpenSiteContent,
}) {
  const patch = (p) => onChange?.({ ...settings, ...p });
  const ctaRef = useRef(null);

  useEffect(() => {
    if (focusField === "cta" && ctaRef.current) {
      ctaRef.current.focus();
      ctaRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusField]);

  return (
    <div className="ve-inspector">
      <div className="ve-inspector__head">
        <i className="fa-solid fa-bars" />
        <div>
          <h3>Site header</h3>
          <p>Logo & appointment button — nav switches which page you edit</p>
        </div>
      </div>

      <div className="ve-inspector__panel">
        <p className="ve-inspector__hint">
          On desktop, use the top nav. On phone/tablet preview, tap <strong>☰</strong> then pick a page.
          Click the <strong>logo</strong> to change brand & colors.
        </p>

        <p className="ve-inspector__label">Edit page (same as nav clicks)</p>
        <div className="ve-inspector__chips ve-inspector__chips--pages">
          {PREVIEW_NAV.map((item) => {
            const full = PAGE_OPTIONS.find((p) => p.id === item.pageId);
            return (
              <button
                key={item.pageId}
                type="button"
                className={currentPageId === item.pageId ? "is-active" : ""}
                onClick={() => onNavigatePage?.(item.pageId)}
              >
                {item.label}
                {full && full.label !== item.label ? (
                  <span className="ve-inspector__chip-sub">{full.label}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="ve-inspector__label">Brand & logo</p>
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
          <label htmlFor="hdr-logo-letter">Logo letter (when no image)</label>
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

        <div className="ve-inspector__color">
          <label>
            <span>Logo primary</span>
            <input
              type="color"
              value={settings.logoColorPrimary || "#007cc3"}
              onChange={(e) => patch({ logoColorPrimary: e.target.value })}
            />
            <input
              type="text"
              value={settings.logoColorPrimary || "#007cc3"}
              onChange={(e) => patch({ logoColorPrimary: e.target.value })}
            />
          </label>
        </div>

        <div className="ve-inspector__color">
          <label>
            <span>Logo accent</span>
            <input
              type="color"
              value={settings.logoColorAccent || "#00b8a9"}
              onChange={(e) => patch({ logoColorAccent: e.target.value })}
            />
            <input
              type="text"
              value={settings.logoColorAccent || "#00b8a9"}
              onChange={(e) => patch({ logoColorAccent: e.target.value })}
            />
          </label>
        </div>

        <div className="field">
          <label htmlFor="hdr-tagline">Tagline (footer & meta)</label>
          <input
            id="hdr-tagline"
            type="text"
            value={settings.tagline || ""}
            onChange={(e) => patch({ tagline: e.target.value })}
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

        <button
          type="button"
          className="ve-btn ve-btn--primary ve-inspector__full"
          onClick={() => onOpenSiteContent?.("brand")}
        >
          <i className="fa-solid fa-image" /> Upload logo image & advanced options
        </button>
      </div>
    </div>
  );
}
