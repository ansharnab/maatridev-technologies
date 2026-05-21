import { useEffect, useState } from "react";
import AnimatedLogo from "../components/AnimatedLogo";
import { hasCustomLogo } from "../utils/mediaType";

/** Preview nav → page builder page ids */
export const PREVIEW_NAV = [
  { pageId: "home", label: "Home" },
  { pageId: "about", label: "About" },
  { pageId: "services", label: "Services" },
  { pageId: "contact", label: "Contact" },
];

/**
 * Site header preview — matches live site layout per breakpoint.
 * Mobile/tablet: logo + menu button only; links live in the slide-down menu.
 */
export default function PreviewChrome({
  device = "desktop",
  settings = {},
  currentPageId = "home",
  isSelected = false,
  onSelect,
  onNavigatePage,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logo = settings.logoText || "MaatriDev";
  const fullLogo = hasCustomLogo(settings.logoImage) || hasCustomLogo(settings.logoImageOnDark);
  const previewLogo =
    settings.logoImageOnDark || settings.logoImage || "/logo-maatridev-hero.svg";
  const ctaLabel = settings.headerCtaLabel || "Book Appointment";
  const useDrawer = device === "mobile" || device === "tablet";

  useEffect(() => {
    setMenuOpen(false);
  }, [device, currentPageId]);

  const selectHeader = (e, focus) => {
    e.stopPropagation();
    setMenuOpen(false);
    onSelect?.(focus);
  };

  const goToPage = (e, pageId) => {
    e.stopPropagation();
    setMenuOpen(false);
    onNavigatePage?.(pageId);
  };

  const navLinks = PREVIEW_NAV.map((item) => (
    <button
      key={item.pageId}
      type="button"
      className={`ve-preview-chrome__link${currentPageId === item.pageId ? " is-active" : ""}`}
      title={`Edit ${item.label} page`}
      onClick={(e) => goToPage(e, item.pageId)}
    >
      {item.label}
    </button>
  ));

  return (
    <div
      className={`ve-chrome-block${isSelected ? " is-selected" : ""}`}
      data-ve-chrome="header"
    >
      <div className="ve-chrome-block__bar">
        <span className="ve-block__label">Site header</span>
      </div>

      <header
        className={`ve-preview-chrome ve-preview-chrome--${device}${isSelected ? " ve-preview-chrome--editing" : ""}${menuOpen ? " ve-preview-chrome--menu-open" : ""}`}
      >
        <div className="ve-preview-chrome__inner">
          <button
            type="button"
            className={`ve-preview-chrome__brand${fullLogo ? " ve-preview-chrome__brand--logo" : ""}`}
            title="Edit logo & brand"
            onClick={(e) => selectHeader(e, "brand")}
          >
            <AnimatedLogo
              letter={settings.logoLetter}
              animation={settings.logoAnimation}
              colorPrimary={settings.logoColorPrimary}
              colorAccent={settings.logoColorAccent}
              imageUrl={previewLogo}
              alt={`${logo} Technologies`}
              size={device === "mobile" ? "sm" : useDrawer ? "sm" : "md"}
              fullBrand={fullLogo}
              scale={fullLogo ? Number(settings.logoScale) || 1 : 1}
              clipWidth={
                fullLogo
                  ? Number(settings.logoClipWidth) ||
                    (device === "mobile" ? 140 : device === "tablet" ? 180 : 200)
                  : undefined
              }
            />
            {!fullLogo && (
              <span className="ve-preview-chrome__text">
                <strong>{logo}</strong>
                {device === "desktop" && <small>Technologies</small>}
              </span>
            )}
          </button>

          {useDrawer ? (
            <button
              type="button"
              className={`ve-preview-chrome__toggle${menuOpen ? " is-open" : ""}`}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu to switch page"}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((open) => !open);
              }}
            >
              <span />
              <span />
              <span />
            </button>
          ) : (
            <nav className="ve-preview-chrome__nav ve-preview-chrome__nav--inline" aria-label="Switch page to edit">
              {navLinks}
              <button
                type="button"
                className="ve-preview-chrome__cta"
                title="Edit appointment button"
                onClick={(e) => selectHeader(e, "cta")}
              >
                {ctaLabel}
              </button>
            </nav>
          )}
        </div>

        {useDrawer && menuOpen && (
          <nav className="ve-preview-chrome__drawer" aria-label="Switch page to edit">
            {navLinks}
            <button
              type="button"
              className="ve-preview-chrome__cta ve-preview-chrome__cta--drawer"
              title="Edit appointment button"
              onClick={(e) => selectHeader(e, "cta")}
            >
              {ctaLabel}
            </button>
          </nav>
        )}
      </header>
    </div>
  );
}
