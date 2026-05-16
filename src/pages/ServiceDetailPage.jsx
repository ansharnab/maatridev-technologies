import { Link, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import { useSiteData } from "../context/SiteDataContext";

export default function ServiceDetailPage() {
  const { services } = useSiteData();
  const { id } = useParams();
  const service = services.find((s) => s.id === id) || services[0];

  return (
    <>
      <PageHero
        title={service.title}
        description={service.summary}
        breadcrumb={[{ to: "/services", label: "Services" }, { label: service.title }]}
      />
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2 className="section-title">What we deliver</h2>
            <ul className="detail-list">
              {service.details.map((d) => (
                <li key={d}>
                  <i className="fa-solid fa-circle-check" /> {d}
                </li>
              ))}
            </ul>
            <Link to="/appointment" className="btn btn--primary" style={{ marginTop: "1.5rem" }}>
              Request Consultation
            </Link>
          </div>
          <div className="card">
            <div className="card__body">
              <h3>Get a proposal</h3>
              <p>Tell us about your project — Ajax-powered, no page reload.</p>
              <ContactForm compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
