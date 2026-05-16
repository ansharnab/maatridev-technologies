import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useSiteData } from "../context/SiteDataContext";

export default function ServicesPage() {
  const { services } = useSiteData();
  return (
    <>
      <PageHero
        title="Our Services"
        description="IT, AI, cloud, web, creative, blockchain, analytics, and enterprise consultancy."
        breadcrumb={[{ label: "Services" }]}
      />
      <section className="section">
        <div className="container grid-3">
          {services.map((s) => (
            <Link key={s.id} to={`/services/${s.id}`} className="card">
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
      </section>
    </>
  );
}
