import PageHero from "../components/PageHero";
import { useSiteData } from "../context/SiteDataContext";

export default function AboutPage() {
  const { founders } = useSiteData();
  return (
    <>
      <PageHero
        title="About MaatriDev Technologies"
        description="A pure-service technology, creative, and digital solutions partnership."
        breadcrumb={[{ label: "About" }]}
      />
      <section className="section">
        <div className="container grid-2">
          <div>
            <span className="eyebrow">Our Mission</span>
            <h2 className="section-title">Navigate your next with confidence</h2>
            <p>
              MaatriDev Technologies was established to deliver comprehensive technology, creative, and digital
              services in India and globally. Our objects encompass IT services, SaaS, systems integration, AI/ML,
              LLM optimization, blockchain, analytics, web development, creative services, ITeS, cloud solutions, and
              digital transformation consultancy.
            </p>
            <p>
              As incidental objects, we acquire and license intellectual property, enter technical collaborations, and
              establish AI research and digital skills workshops — scaling within the evolving service sector without
              frequent deed amendments.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
            alt="Team collaboration"
            style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
          />
        </div>
      </section>
      <section className="section section--dark">
        <div className="container">
          <h2 className="section-title">Founding Partners</h2>
          <div className="grid-2">
            {founders.map((f) => (
              <article key={f.name} className="card">
                <div className="card__body">
                  <h3>{f.name}</h3>
                  <p className="founder-card__role">{f.role}</p>
                  <p>{f.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
