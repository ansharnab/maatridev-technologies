import PageHero from "../components/PageHero";
import { faqs } from "../data/siteData";

export default function FAQPage() {
  return (
    <>
      <PageHero title="FAQ" description="Common questions about our services and delivery." breadcrumb={[{ label: "FAQ" }]} />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {faqs.map((f) => (
            <details key={f.q} className="faq-item" open>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
