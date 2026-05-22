import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import AnimatedLogo from "../AnimatedLogo";
import LogoEditorOverlay from "../../builder/LogoEditorOverlay";
import { hasCustomLogo } from "../../utils/mediaType";
import { resolveHeaderTheme, previewContextFromPath } from "../../utils/headerTheme";
import { resolveLogoUrls } from "../../utils/logoSettings";
import "./Header.css";

/** Home dropdown — agency / homepage variants only */
const HOME_NAV_CHILDREN = [
  { to: "/", label: "IT Solutions (Default)" },
  { to: "/home/web-agency", label: "Web Agency" },
  { to: "/home/startup-agency", label: "Startup Agency" },
  { to: "/home/digital-agency", label: "Digital Agency" },
];

const nav = [
  {
    label: "Home",
    children: HOME_NAV_CHILDREN,
  },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/team", label: "Team" },
  { to: "/blog", label: "Blog" },
  { to: "/pricing", label: "Engagement" },
  { to: "/contact", label: "Contact" },
];

const EDITOR_PAGE_ROUTES = {
  home: ["/", "/home/web-agency", "/home/startup-agency", "/home/digital-agency", "/home/it-solution"],
  about: ["/about", "/team", "/blog"],
  services: ["/services"],
  contact: ["/contact", "/pricing", "/appointment", "/engagement"],
};

/** Builder pages that are not in PAGE_OPTIONS but should switch editor context */
const EDITOR_NAV_PAGE_OVERRIDES = {
  "/projects": "services",
};

function isHeroRoute(pathname) {
  return pathname === "/" || pathname.startsWith("/home/");
}

function isPageHeroRoute(pathname) {
  const roots = ["/about", "/services", "/contact", "/team", "/projects", "/blog", "/pricing", "/faq", "/appointment"];
  return roots.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function routeToEditorPage(path) {
  if (EDITOR_NAV_PAGE_OVERRIDES[path]) return EDITOR_NAV_PAGE_OVERRIDES[path];
  for (const [pageId, routes] of Object.entries(EDITOR_PAGE_ROUTES)) {
    if (routes.some((r) => path === r || path.startsWith(`${r}/`))) return pageId;
  }
  return null;
}

function pathMatchesNav(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isNavItemActive(pathname, item) {
  if (item.children?.length) {
    return item.children.some((c) => pathMatchesNav(pathname, c.to));
  }
  if (item.to) return pathMatchesNav(pathname, item.to);
  return false;
}

/** Top-level drawer link — Projects must not light up on /services and vice versa */
function isTopLevelNavActive(pathname, item) {
  if (!item?.to) return false;
  if (item.to === "/services") {
    return pathname === "/services" || pathname.startsWith("/services/");
  }
  if (item.to === "/projects") {
    return pathname === "/projects" || pathname.startsWith("/projects/");
  }
  return pathMatchesNav(pathname, item.to);
}

/** Mobile drawer open: no teal “current page” bar on About/Services (confusing in builder + live) */
function mobileDrawerLinkActive(pathname, item, menuOpen) {
  if (menuOpen) return false;
  return isTopLevelNavActive(pathname, item);
}

/** Core header UI — safe to render in admin preview (no nested Router). */
export function SiteHeaderBar({
  settings = {},
  pathname = "/",
  editorPreview = false,
  contentLoading = false,
  previewPageId = "home",
  previewDevice = "desktop",
  isSelected = false,
  editorFocus = null,
  onEditorSelect,
  onLogoPatch,
  onEditorNavigate,
}) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);
  const homeBlockRef = useRef(null);
  const [compactNav, setCompactNav] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 1100px)").matches;
  });
  const [scrolled, setScrolled] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);
  const [logoFallback, setLogoFallback] = useState(false);
  const logo = settings.logoText || "MaatriDev";
  const onHero = isHeroRoute(pathname);
  const onPageHero = isPageHeroRoute(pathname);
  const previewContext = previewContextFromPath(pathname);
  /** Live site: same glass header as home on every page */
  const unifiedHeroHeader = !editorPreview;
  const lightNav = unifiedHeroHeader || onHero || onPageHero;
  const onDarkBackdrop = editorPreview
    ? previewContext !== "inner"
    : unifiedHeroHeader
      ? !scrolled
      : (onHero && !scrolled) || (onPageHero && !scrolled);

  const theme = resolveHeaderTheme(settings, {
    editorPreview,
    scrolled: editorPreview ? false : scrolled,
    onDarkBackdrop,
    previewContext,
  });

  const onDarkHeader = editorPreview
    ? previewContextFromPath(pathname) !== "inner"
    : onDarkBackdrop;
  const logos = resolveLogoUrls(settings, onDarkHeader);
  const fullLogo = hasCustomLogo(logos.primary) || hasCustomLogo(logos.onDark);
  const fullLogoActive = fullLogo && !logoBroken;
  const hideBrandText = logos.hasUpload && fullLogoActive && Boolean(theme.logoSrc);

  const logoSrc = logoFallback ? theme.logoSrc : logoBroken ? "" : theme.logoSrc;
  const logoPending = contentLoading && !logoSrc;

  const closeMobileNav = () => {
    setOpenDropdown(null);
    setOpen(false);
  };

  useEffect(() => {
    if (editorPreview) return undefined;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [editorPreview]);

  /* Live site: desktop = inline menu + CTA column; ≤1100px = drawer (was always drawer before) */
  useEffect(() => {
    if (editorPreview) {
      setCompactNav(previewDevice !== "desktop");
      return undefined;
    }
    const mq = window.matchMedia("(max-width: 1100px)");
    const sync = () => setCompactNav(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [editorPreview, previewDevice]);

  useEffect(() => {
    setLogoBroken(false);
    setLogoFallback(false);
  }, [settings.logoImage, settings.logoImageOnDark, settings.headerDesign, scrolled, editorPreview]);

  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
    if (!editorPreview) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [pathname, editorPreview, previewPageId]);

  useEffect(() => {
    if (!editorPreview || previewDevice !== "desktop") return;
    const id = requestAnimationFrame(() => {
      const navEl = document.querySelector(
        ".site-header--editor-preview.site-header--editor-desktop .site-header__nav",
      );
      if (navEl) navEl.scrollLeft = 0;
    });
    return () => cancelAnimationFrame(id);
  }, [editorPreview, previewDevice, previewPageId]);

  const resetMobileNavScroll = () => {
    const body = navRef.current?.querySelector(".site-header__nav-body");
    if (body) body.scrollTop = 0;
  };

  useEffect(() => {
    if (!open) return;
    resetMobileNavScroll();
  }, [open]);

  useEffect(() => {
    if (editorPreview || !open) {
      if (!editorPreview) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
      return undefined;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeMobileNav();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, editorPreview]);

  const headerClass = [
    "site-header",
    editorPreview ? "site-header--editor-preview" : "",
    editorPreview ? `site-header--editor-${previewDevice}` : "",
    editorPreview ? `site-header--editor-ctx-${previewContext}` : "",
    editorPreview && isSelected ? "site-header--editor-selected" : "",
    (unifiedHeroHeader || onHero) && !editorPreview ? "site-header--hero" : "",
    !unifiedHeroHeader && !onHero && !editorPreview ? "site-header--inner" : "",
    lightNav && !editorPreview ? "site-header--light-nav" : "",
    editorPreview && (onHero || onPageHero) ? "site-header--editor-light-nav" : "",
    onDarkBackdrop ? "site-header--on-dark" : "site-header--on-light",
    fullLogoActive && onDarkBackdrop ? "site-header--logo-light" : "",
    scrolled && !editorPreview ? "site-header--scrolled" : "",
    open ? "site-header--menu-open" : "",
    compactNav ? "site-header--compact-nav" : "site-header--desktop-nav",
    `site-header--design-${settings.headerDesign || "glass"}`,
    `site-header--size-${settings.headerSize || "default"}`,
  ]
    .filter(Boolean)
    .join(" ");

  const handleBrandClick = (e) => {
    if (!editorPreview) return;
    e.preventDefault();
    e.stopPropagation();
    onEditorSelect?.("brand");
  };

  const handleCtaClick = (e) => {
    if (!editorPreview) return;
    e.preventDefault();
    onEditorSelect?.("cta");
  };

  const handleNavEditor = (e, path) => {
    const targetPageId = routeToEditorPage(path);
    if (!targetPageId) return;
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(null);
    onEditorNavigate?.(targetPageId, path);
  };

  const toggleHomeMenu = () => {
    setOpenDropdown((cur) => (cur === "Home" ? null : "Home"));
  };

  /** Phone/tablet drawer — tap Home → agency links open below (normal row, not stuck/active) */
  const renderMobileHomeSection = () => {
    const homeOpen = openDropdown === "Home";
    return (
      <div ref={homeBlockRef} className={`site-header__home-block${homeOpen ? " is-open" : ""}`}>
        <button
          type="button"
          className={`site-header__home-toggle${homeOpen ? " is-open" : ""}`}
          aria-expanded={homeOpen}
          onClick={(e) => {
            e.stopPropagation();
            toggleHomeMenu();
          }}
        >
          <span className="site-header__home-toggle__label">Home</span>
          <i className="fa-solid fa-chevron-down site-header__home-toggle__icon" aria-hidden="true" />
        </button>
        <div
          className={`site-header__home-links${homeOpen ? " is-open" : ""}`}
          aria-hidden={!homeOpen}
        >
            {HOME_NAV_CHILDREN.map((child) =>
              editorPreview ? (
                <button
                  key={child.to}
                  type="button"
                  className={pathMatchesNav(pathname, child.to) ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavEditor(e, child.to);
                    setOpenDropdown(null);
                    setOpen(false);
                  }}
                >
                  {child.label}
                </button>
              ) : (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeMobileNav}
                >
                  {child.label}
                </NavLink>
              ),
            )}
        </div>
      </div>
    );
  };

  const renderNavItem = (item) => {
    if (item.children) {
      const active = isNavItemActive(pathname, item);
      const menuOpen = openDropdown === item.label;
      return (
        <div
          key={item.label}
          className={`site-header__dropdown${menuOpen ? " is-open" : ""}`}
          onClick={(e) => (editorPreview || menuOpen) && e.stopPropagation()}
        >
          {editorPreview && !compactNav ? (
            <div className={`site-header__link site-header__link--split${active ? " active" : ""}`}>
              <button
                type="button"
                className="site-header__link-label"
                onClick={(e) => {
                  e.stopPropagation();
                  const first = item.children.find((c) => routeToEditorPage(c.to));
                  if (first) handleNavEditor(e, first.to);
                }}
              >
                {item.label}
              </button>
              <button
                type="button"
                className="site-header__link-chevron"
                aria-expanded={menuOpen}
                aria-label={`${item.label} submenu`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(menuOpen ? null : item.label);
                }}
              >
                <i className="fa-solid fa-chevron-down" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="site-header__link"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(item.label);
              }}
            >
              {item.label} <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </button>
          )}
          {editorPreview ? (
            menuOpen && (
              <div className="site-header__menu site-header__menu--editor" role="menu">
                {item.children.map((child) => (
                  <button
                    key={child.to}
                    type="button"
                    role="menuitem"
                    className={pathMatchesNav(pathname, child.to) ? "active" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavEditor(e, child.to);
                      setOpenDropdown(null);
                      if (compactNav) setOpen(false);
                    }}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="site-header__menu site-header__submenu" role="menu">
              {item.children.map((child) => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  role="menuitem"
                  className={({ isActive }) =>
                    `site-header__submenu-link${isActive ? " active" : ""}`
                  }
                  onClick={closeMobileNav}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (editorPreview) {
      const active = compactNav
        ? mobileDrawerLinkActive(pathname, item, open)
        : isNavItemActive(pathname, item);
      const pageId = item.to ? routeToEditorPage(item.to) : null;
      return (
        <button
          key={item.label}
          type="button"
          className={`site-header__link${active ? " active" : ""}`}
          onClick={(e) => pageId && handleNavEditor(e, item.to)}
        >
          {item.label}
        </button>
      );
    }

    const topActive = compactNav ? mobileDrawerLinkActive(pathname, item, open) : isTopLevelNavActive(pathname, item);
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={() => `site-header__link${topActive ? " active" : ""}`}
        onClick={closeMobileNav}
      >
        {item.label}
      </NavLink>
    );
  };

  const brandInner = (
    <>
      <AnimatedLogo
        letter={settings.logoLetter}
        animation={settings.logoAnimation}
        colorPrimary={settings.logoColorPrimary}
        colorAccent={settings.logoColorAccent}
        imageUrl={logoSrc}
        showLetterFallback={!contentLoading}
        alt={`${logo} Technologies`}
        size={previewDevice === "mobile" ? "sm" : "md"}
        fullBrand={fullLogoActive && Boolean(logoSrc)}
        scale={fullLogoActive ? Number(settings.logoScale) || 1 : 1}
        clipWidth={fullLogoActive ? Number(settings.logoClipWidth) || 280 : undefined}
        onMediaError={() => {
          if (!logoFallback && logos.onDark !== logoSrc) {
            setLogoFallback(true);
            return;
          }
          setLogoBroken(true);
        }}
      />
      {!logoPending && !hideBrandText && (!fullLogoActive || !logoSrc) && (
        <span className="site-header__brand-text">
          <strong>{logo}</strong>
          <small>Technologies</small>
        </span>
      )}
    </>
  );

  const handleHeaderShellClick = (e) => {
    if (!editorPreview) return;
    if (
      e.target.closest(
        [
          ".site-header__brand",
          ".site-header__col--brand",
          ".site-header__col--cta",
          ".site-header__cta",
          ".site-header__link",
          ".site-header__link-label",
          ".site-header__link-chevron",
          ".site-header__home-block",
          ".site-header__home-toggle",
          ".site-header__home-links",
          ".site-header__home-links button",
          ".site-header__nav-body",
          ".site-header__nav-body button",
          ".site-header__nav-body a",
          ".site-header__toggle",
          ".site-header__menu",
          ".site-header__menu--editor",
          ".site-header__menu--editor button",
          ".site-header__overlay",
          ".site-header__nav button",
        ].join(", "),
      )
    ) {
      return;
    }
    setOpenDropdown(null);
    onEditorSelect?.();
  };

  const toggleDropdown = (label) => {
    setOpenDropdown((cur) => (cur === label ? null : label));
  };

  const renderCta = (className = "btn btn--primary site-header__cta") => {
    const label = settings.headerCtaLabel || "Book Appointment";
    if (editorPreview) {
      return (
        <button type="button" className={className} onClick={handleCtaClick}>
          {label}
        </button>
      );
    }
    return (
      <Link
        to={settings.headerCtaLink || "/appointment"}
        className={className}
        onClick={closeMobileNav}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className={headerClass}
      style={theme.cssVars}
      data-ve-chrome={editorPreview ? "header" : undefined}
      onClick={handleHeaderShellClick}
    >
      <div className="site-header__glass" aria-hidden="true" />
      {open && !editorPreview && (
        <button
          type="button"
          className="site-header__overlay"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            closeMobileNav();
          }}
        />
      )}
      <div className="container site-header__inner">
        <div className="site-header__col site-header__col--brand">
          {editorPreview ? (
            <button
              type="button"
              className={`site-header__brand site-header__brand--editor${fullLogoActive ? " site-header__brand--full-logo" : ""}${isSelected ? " site-header__brand--editor-active" : ""}`}
              onClick={handleBrandClick}
              title="Click to edit header & logo size"
            >
              {brandInner}
              <LogoEditorOverlay
                visible={isSelected}
                emphasized={editorFocus === "brand"}
                hasFullLogo={fullLogoActive && Boolean(logoSrc)}
                scale={settings.logoScale}
                clipWidth={settings.logoClipWidth}
                onPatch={onLogoPatch}
              />
            </button>
          ) : (
            <Link to="/" className={`site-header__brand${fullLogoActive ? " site-header__brand--full-logo" : ""}`}>
              {brandInner}
            </Link>
          )}
        </div>

        <button
          type="button"
          className={`site-header__toggle ${open ? "is-active" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            if (open) {
              closeMobileNav();
            } else {
              setOpenDropdown(null);
              setOpen(true);
              requestAnimationFrame(resetMobileNavScroll);
            }
          }}
        >
          <span />
          <span />
          <span />
        </button>

        <nav ref={navRef} className={`site-header__col site-header__col--nav site-header__nav ${open ? "is-open" : ""}`}>
          {compactNav ? (
            <>
              {renderMobileHomeSection()}
              <div className="site-header__nav-body">
                {nav.filter((item) => item.label !== "Home").map((item) => renderNavItem(item))}
                {renderCta()}
              </div>
            </>
          ) : (
            <div className="site-header__nav-menu">
              <div className="site-header__nav-links">{nav.map((item) => renderNavItem(item))}</div>
            </div>
          )}
        </nav>

        {!compactNav && (
          <div className="site-header__col site-header__col--cta">{renderCta()}</div>
        )}
      </div>
    </header>
  );
}

/** Live site header (uses app Router for NavLink / scroll). */
export default function Header(props) {
  const { pathname } = useLocation();
  return <SiteHeaderBar {...props} pathname={pathname} />;
}
