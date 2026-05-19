import { Link } from "react-router-dom";
import ContactForm from "../../components/ContactForm";
import { founders as defaultFounders, services as defaultServices, stats } from "../../data/siteData";
import { useSiteDataOptional } from "../../context/SiteDataContext";
import { VeEditable } from "../VeInlineEdit";

/** Same look as the live site — used in editor preview and public pages */

export function PageHeroBlock({ title, description, breadcrumbLabel = "Page" }) {
  return (
    <section className="page-hero">
      <div className="page-hero__bg" aria-hidden="true">
        <div className="page-hero__orb" />
      </div>
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>
            {" / "}
            <VeEditable field="breadcrumbLabel">{breadcrumbLabel}</VeEditable>
          </span>
        </nav>
        <h1>
          <VeEditable field="title">{title}</VeEditable>
        </h1>
        {description && (
          <p>
            <VeEditable field="description" multiline>
              {description}
            </VeEditable>
          </p>
        )}
      </div>
    </section>
  );
}

export function HomeHeroBlock({
  eyebrow,
  title,
  subtitle,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
  image = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop",
}) {
  return (
    <section className="hero hero--it">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
      </div>
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="eyebrow">
            <VeEditable field="eyebrow">{eyebrow}</VeEditable>
          </span>
          <h1>
            <VeEditable field="title">{title}</VeEditable>
          </h1>
          <p className="hero__subtitle">
            <VeEditable field="subtitle" multiline>
              {subtitle}
            </VeEditable>
          </p>
          <div className="hero__actions">
            {primaryLabel && (
              <Link to={primaryLink || "/contact"} className="btn btn--primary">
                {primaryLabel} <i className="fa-solid fa-arrow-right" />
              </Link>
            )}
            {secondaryLabel && (
              <Link to={secondaryLink || "/services"} className="btn btn--outline btn--outline-hero">
                {secondaryLabel}
              </Link>
            )}
          </div>
          <div className="hero__stats">
            {stats.map((s) => (
              <div key={s.label} className="hero__stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__card hero__card--main">
            <img src={image} alt="" />
          </div>
        </div>
      </div>
      <div className="hero__wave" />
    </section>
  );
}

export function StatsBlock({ stat1, label1, stat2, label2, stat3, label3, stat4, label4 }) {
  const items = [
    { value: stat1, label: label1, valueKey: "stat1", labelKey: "label1" },
    { value: stat2, label: label2, valueKey: "stat2", labelKey: "label2" },
    { value: stat3, label: label3, valueKey: "stat3", labelKey: "label3" },
    { value: stat4, label: label4, valueKey: "stat4", labelKey: "label4" },
  ];
  return (
    <section className="section section--dark about-strip">
      <div className="container">
        <div className="hero__stats" style={{ border: "none", paddingTop: 0 }}>
          {items.map((s) => (
            <div key={s.label} className="hero__stat">
              <strong>
                <VeEditable field={s.valueKey}>{s.value}</VeEditable>
              </strong>
              <span>
                <VeEditable field={s.labelKey}>{s.label}</VeEditable>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesGridBlock({ showAll = true, title, subtitle, services: servicesProp }) {
  const ctx = useSiteDataOptional();
  const all = servicesProp ?? ctx?.services ?? defaultServices;
  const list = showAll ? all : all.slice(0, 3);
  return (
    <section className="section">
      <div className="container">
        {(title || subtitle) && (
          <div className="section-head" style={{ marginBottom: "2rem" }}>
            {title && (
              <h2 className="section-title">
                <VeEditable field="title">{title}</VeEditable>
              </h2>
            )}
            {subtitle && (
              <p className="section-sub">
                <VeEditable field="subtitle" multiline>
                  {subtitle}
                </VeEditable>
              </p>
            )}
          </div>
        )}
        <div className="grid-3">
          {list.map((s) => (
            <Link key={s.id} to={`/services/${s.id}`} className="card service-card">
              <div className="card__body">
                <div className="card__icon">
                  <i className={`fa-solid ${s.icon}`} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureStripBlock({ eyebrow, title, body, buttonLabel, buttonLink }) {
  return (
    <section className="section section--dark about-strip">
      <div className="container about-strip__grid">
        <div>
          <span className="eyebrow">
            <VeEditable field="eyebrow">{eyebrow}</VeEditable>
          </span>
          <h2 className="section-title">
            <VeEditable field="title">{title}</VeEditable>
          </h2>
          <p>
            <VeEditable field="body" multiline>
              {body}
            </VeEditable>
          </p>
          {buttonLabel && (
            <Link to={buttonLink || "/about"} className="btn btn--primary">
              <VeEditable field="buttonLabel">{buttonLabel}</VeEditable>
            </Link>
          )}
        </div>
        <ul className="about-strip__list">
          <li><i className="fa-solid fa-check" /> Software, SaaS & CRM</li>
          <li><i className="fa-solid fa-check" /> Web, Creative & Marketing</li>
          <li><i className="fa-solid fa-check" /> Cloud, ITeS & Integration</li>
          <li><i className="fa-solid fa-check" /> Events & Consultancy</li>
        </ul>
      </div>
    </section>
  );
}

export function FoundersBlock({ founders: foundersProp }) {
  const ctx = useSiteDataOptional();
  const list = foundersProp ?? ctx?.founders ?? defaultFounders;

  return (
    <section className="section founders-section">
      <div className="container">
        <span className="eyebrow">Leadership</span>
        <h2 className="section-title">Meet our founders</h2>
        <div className="grid-2">
          {list.map((f) => (
            <article key={f.name} className="founder-card card">
              <img src={f.image} alt={f.name} />
              <div className="card__body">
                <h3>{f.name}</h3>
                <p className="founder-card__role">{f.role}</p>
                <p>{f.bio}</p>
                {(f.phone || f.email || f.linkedin) && (
                  <div className="founder-card__contact">
                    {f.phone && (
                      <a href={`tel:${String(f.phone).replace(/\s/g, "")}`}>
                        <i className="fa-solid fa-phone" /> {f.phone}
                      </a>
                    )}
                    {f.email && (
                      <a href={`mailto:${f.email}`}>
                        <i className="fa-solid fa-envelope" /> {f.email}
                      </a>
                    )}
                    {f.linkedin && (
                      <a href={f.linkedin} target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-linkedin-in" /> LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTABlock({ title, text, buttonLabel, buttonLink }) {
  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <div>
          <h2>
            <VeEditable field="title">{title}</VeEditable>
          </h2>
          <p>
            <VeEditable field="text" multiline>
              {text}
            </VeEditable>
          </p>
        </div>
        <div className="cta-banner__actions">
          <Link to={buttonLink || "/contact"} className="btn btn--primary">
            <VeEditable field="buttonLabel">{buttonLabel}</VeEditable>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TextContentBlock({ title, body, align = "left" }) {
  return (
    <section className="section">
      <div
        className="container"
        style={{ textAlign: align, maxWidth: 800, margin: align === "center" ? "0 auto" : undefined }}
      >
        <h2 className="section-title">
          <VeEditable field="title">{title}</VeEditable>
        </h2>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
          <VeEditable field="body" multiline>
            {body}
          </VeEditable>
        </p>
      </div>
    </section>
  );
}

export function ContactInfoBlock({ title, email, phone, note }) {
  return (
    <section className="section">
      <div className="container grid-2">
        <div>
          <h2 className="section-title">
            <VeEditable field="title">{title}</VeEditable>
          </h2>
          <p>
            <i className="fa-solid fa-envelope" />{" "}
            <VeEditable field="email">{email}</VeEditable>
          </p>
          <p>
            <i className="fa-solid fa-phone" />{" "}
            <VeEditable field="phone">{phone}</VeEditable>
          </p>
          <p style={{ color: "var(--text-muted)" }}>
            <VeEditable field="note" multiline>
              {note}
            </VeEditable>
          </p>
        </div>
        <div className="card">
          <div className="card__body">
            <p>Book a call or email us — we reply within one business day.</p>
            <Link to="/appointment" className="btn btn--primary">Book Appointment</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactFormBlock() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 640 }}>
        <ContactForm />
      </div>
    </section>
  );
}
