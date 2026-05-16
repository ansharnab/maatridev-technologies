import { Link } from "react-router-dom";
import { homeVariants, projects, stats, techStack } from "../data/siteData";
import { useSiteData } from "../context/SiteDataContext";
import CmsBlocks from "../components/CmsBlocks";
import Reveal from "../components/Reveal";
import "./HomePage.css";

export default function HomePage({ variant = 4 }) {
  const { founders, services } = useSiteData();
  const v = homeVariants[variant] || homeVariants[4];

  return (
    <>
      <section className={`hero hero--${v.theme}`}>
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__grid-bg" />
        </div>

        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow animate-hero-in">{v.eyebrow}</span>
            <h1 className="animate-hero-in animate-hero-in-delay-1">{v.title}</h1>
            <p className="hero__subtitle animate-hero-in animate-hero-in-delay-2">{v.subtitle}</p>
            <div className="hero__actions animate-hero-in animate-hero-in-delay-3">
              <Link to="/contact" className="btn btn--primary">
                {v.cta} <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link to="/services" className="btn btn--outline btn--outline-hero">
                View Services
              </Link>
            </div>
            <div className="hero__stats">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="hero__stat animate-hero-in"
                  style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                >
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero__visual animate-hero-in animate-hero-in-delay-2">
            <div className="hero__card hero__card--main animate-float">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop"
                alt="MaatriDev team delivering technology services"
              />
            </div>
          </div>
        </div>
        <div className="hero__wave" />
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">What We Do</span>
            <h2 className="section-title">End-to-end technology & digital services</h2>
            <p className="section-sub">
              Eight service lines spanning software, web, CRM, cloud, creative, marketing, ITeS, events, and emerging
              technology — delivered as one accountable partnership.
            </p>
          </Reveal>
          <div className="grid-4 reveal-stagger">
            {services.slice(0, 8).map((s, i) => (
              <Reveal key={s.id} delay={i * 60}>
                <Link to={`/services/${s.id}`} className="card service-card">
                  <div className="card__body">
                    <div className="card__icon">
                      <i className={`fa-solid ${s.icon}`} />
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.summary}</p>
                    <span className="link-arrow">
                      Learn more <i className="fa-solid fa-arrow-right" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark about-strip">
        <div className="container about-strip__grid">
          <Reveal direction="left">
            <span className="eyebrow">About MaatriDev</span>
            <h2 className="section-title">Pure-service technology partnership</h2>
            <p>
              MaatriDev Technologies is established to carry out comprehensive technology, creative, and digital
              service solutions in India and worldwide — led by founders{" "}
              <strong>Akshansh Arnab</strong> and <strong>Swetav Savarn</strong>.
            </p>
            <Link to="/about" className="btn btn--primary">
              Our Story
            </Link>
          </Reveal>
          <Reveal direction="right" delay={120}>
            <ul className="about-strip__list">
              <li><i className="fa-solid fa-check" /> Software, SaaS & CRM</li>
              <li><i className="fa-solid fa-check" /> AI, ML & Prompt Engineering</li>
              <li><i className="fa-solid fa-check" /> Cloud, ITeS & Data Warehousing</li>
              <li><i className="fa-solid fa-check" /> Web, E-commerce & Creative</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--row">
            <div>
              <span className="eyebrow">Portfolio</span>
              <h2 className="section-title">Featured projects</h2>
            </div>
            <Link to="/projects" className="btn btn--outline">View All</Link>
          </Reveal>
          <div className="grid-3 reveal-stagger">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Link to={`/projects/${p.id}`} className="card project-card">
                  <img src={p.image} alt={p.title} />
                  <div className="card__body">
                    <span className="project-card__cat">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.client}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section founders-section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Leadership</span>
            <h2 className="section-title">Meet our founders</h2>
          </Reveal>
          <div className="grid-2 reveal-stagger">
            {founders.map((f, i) => (
              <Reveal key={f.name} delay={i * 100}>
                <article className="founder-card card">
                  <img src={f.image} alt={f.name} />
                  <div className="card__body">
                    <h3>{f.name}</h3>
                    <p className="founder-card__role">{f.role}</p>
                    <p>{f.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tech-section">
        <div className="container">
          <Reveal>
            <h2 className="section-title">Technologies we deliver</h2>
            <p className="section-sub">
              Full-stack delivery across web, mobile, enterprise, creative, and operations — tailored to your engagement
              model.
            </p>
          </Reveal>
          <div className="tech-tags">
            {techStack.map((t, i) => (
              <Reveal key={t} delay={i * 40} direction="scale" className="tech-tag-wrap">
                <span className="tech-tag">{t}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CmsBlocks pageId="home" />

      <Reveal>
        <section className="cta-banner">
          <div className="container cta-banner__inner">
            <div>
              <h2>Ready to navigate your next?</h2>
              <p>Book an appointment or send us a message — we respond within 24 hours.</p>
            </div>
            <div className="cta-banner__actions">
              <Link to="/appointment" className="btn btn--primary">Book Appointment</Link>
              <Link to="/contact" className="btn btn--outline-light">Contact Us</Link>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
