import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { pricingPlans } from "../data/siteData";

export default function PricingPage() {
  return (
    <>
      <PageHero
        title="Engagement Models"
        description="Flexible ways to partner with MaatriDev — project-based, managed services, or enterprise programs."
        breadcrumb={[{ label: "Engagement" }]}
      />
      <section className="section">
        <div className="container grid-3">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={`card pricing-card ${plan.featured ? "featured" : ""}`}>
              <div className="card__body">
                <h3>{plan.name}</h3>
                <p className="pricing-card__price">
                  {plan.price}
                  <small style={{ fontSize: "1rem", fontWeight: 500 }}>{plan.period}</small>
                </p>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link to="/contact" className="btn btn--primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}>
                  Get Started
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
