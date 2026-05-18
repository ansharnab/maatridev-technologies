import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import AnimatedLogo from "../AnimatedLogo";
import { hasCustomLogo } from "../../utils/mediaType";
import "./Header.css";

const nav = [
  {
    label: "Home",
    children: [
      { to: "/", label: "IT Solutions (Default)" },
      { to: "/home/web-agency", label: "Web Agency" },
      { to: "/home/startup-agency", label: "Startup Agency" },
      { to: "/home/digital-agency", label: "Digital Agency" },
    ],
  },
  { to: "/about", label: "About" },
  {
    label: "Services",
    children: [
      { to: "/services", label: "All Services" },
      { to: "/services/software", label: "Service Details" },
    ],
  },
  { to: "/projects", label: "Projects" },
  { to: "/team", label: "Team" },
  { to: "/blog", label: "Blog" },
  { to: "/pricing", label: "Engagement" },
  { to: "/contact", label: "Contact" },
];

function isHeroRoute(pathname) {
  return pathname === "/" || pathname.startsWith("/home/");
}

function isPageHeroRoute(pathname) {
  const roots = ["/about", "/services", "/contact", "/team", "/projects", "/blog", "/pricing", "/faq", "/appointment"];
  return roots.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function Header({ settings = {} }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const logo = settings.logoText || "MaatriDev";
  const fullLogo = hasCustomLogo(settings.logoImage);
  const onHero = isHeroRoute(pathname);
  const onPageHero = isPageHeroRoute(pathname);
  const lightNav = onHero || onPageHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return undefined;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const headerClass = [
    "site-header",
    onHero ? "site-header--hero" : "site-header--inner",
    lightNav && !onHero ? "site-header--light-nav" : "",
    scrolled ? "site-header--scrolled" : "",
    open ? "site-header--menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className="site-header__glass" aria-hidden="true" />
      <div className="container site-header__inner">
        <Link
          to="/"
          className={`site-header__brand${fullLogo ? " site-header__brand--full-logo" : ""}`}
        >
          <AnimatedLogo
            letter={settings.logoLetter}
            animation={settings.logoAnimation}
            colorPrimary={settings.logoColorPrimary}
            colorAccent={settings.logoColorAccent}
            imageUrl={settings.logoImage}
            alt={`${logo} Technologies`}
            size="md"
            fullBrand={fullLogo}
            scale={fullLogo ? Number(settings.logoScale) || 1 : 1}
            clipWidth={fullLogo ? Number(settings.logoClipWidth) || 220 : undefined}
          />
          {!fullLogo && (
            <span className="site-header__brand-text">
              <strong>{logo}</strong>
              <small>Technologies</small>
            </span>
          )}
        </Link>

        <button
          type="button"
          className={`site-header__toggle ${open ? "is-active" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-header__nav ${open ? "is-open" : ""}`}>
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="site-header__dropdown">
                <button type="button" className="site-header__link" aria-haspopup="true">
                  {item.label} <i className="fa-solid fa-chevron-down" aria-hidden="true" />
                </button>
                <div className="site-header__menu" role="menu">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `site-header__link ${isActive ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            )
          )}
          <Link to="/appointment" className="btn btn--primary site-header__cta" onClick={() => setOpen(false)}>
            Book Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}
