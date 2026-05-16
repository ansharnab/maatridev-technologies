import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";

export default function AppointmentPage() {
  return (
    <>
      <PageHero
        title="Book an Appointment"
        description="Schedule a discovery call with MaatriDev founders or delivery leads."
        breadcrumb={[{ label: "Appointment" }]}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card">
            <div className="card__body">
              <p style={{ marginBottom: "1.5rem" }}>
                Prefer a specific time? Include your timezone and availability in the message field.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
