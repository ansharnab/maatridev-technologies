import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        description="Ajax-powered contact form — we respond within 24 hours."
        breadcrumb={[{ label: "Contact" }]}
      />
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2 className="section-title">Get in touch</h2>
            <p>hello@maatridev.com · +91 98765 43210</p>
            <p>India · Global Delivery</p>
            <ul className="detail-list" style={{ marginTop: "2rem" }}>
              <li><i className="fa-solid fa-code" /> React, Angular, HTML, JS delivery</li>
              <li><i className="fa-solid fa-cloud" /> Cloud & ITeS solutions</li>
              <li><i className="fa-solid fa-robot" /> AI / ML & LLM engineering</li>
            </ul>
          </div>
          <div className="card">
            <div className="card__body">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
