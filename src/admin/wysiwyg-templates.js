export const PAGE_OPTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export function getStarterHtml(pageId) {
  const templates = {
    home: `
      <section class="mdev-hero">
        <p style="letter-spacing:0.12em;text-transform:uppercase;color:#00b8a9;font-weight:600;">Pure-Service Technology Partner</p>
        <h1>Technology, creative &amp; digital services — end to end</h1>
        <p style="max-width:640px;margin:1rem auto 1.5rem;opacity:0.92;">Software, web, CRM, cloud, creative, marketing, ITeS, events, and emerging tech — one accountable partnership.</p>
        <a href="/contact" class="mdev-btn">Explore Our Services</a>
      </section>
      <section class="mdev-section">
        <h2>What we deliver</h2>
        <div class="mdev-grid">
          <div class="mdev-card"><h3>Software &amp; CRM</h3><p>Enterprise apps, SaaS, and CRM tailored to your workflow.</p></div>
          <div class="mdev-card"><h3>Web &amp; Creative</h3><p>Portals, e-commerce, design, and digital marketing.</p></div>
          <div class="mdev-card"><h3>Cloud &amp; ITeS</h3><p>Integration, data, cloud ops, and managed services.</p></div>
        </div>
      </section>
      <section class="mdev-section">
        <div class="mdev-cta">
          <h2>Ready to start?</h2>
          <p>Book a discovery call with our founders.</p>
          <a href="/appointment" class="mdev-btn" style="background:#fff;color:#007cc3;">Book Appointment</a>
        </div>
      </section>
    `,
    about: `
      <section class="mdev-hero">
        <h1>About MaatriDev Technologies</h1>
        <p>Founded by Akshansh Arnab &amp; Swetav Savarn — a pure-service technology, creative, and digital partnership.</p>
      </section>
      <section class="mdev-section">
        <h2>Our mission</h2>
        <p>We deliver comprehensive technology and digital services in India and worldwide — without limiting ourselves to a single niche.</p>
      </section>
    `,
    services: `
      <section class="mdev-hero">
        <h1>Our Services</h1>
        <p>Eight service lines. One accountable partner.</p>
      </section>
      <section class="mdev-section mdev-grid">
        <div class="mdev-card"><h3>Software Development</h3><p>Custom apps, CRM, SaaS.</p></div>
        <div class="mdev-card"><h3>AI &amp; Data</h3><p>ML, analytics, automation.</p></div>
        <div class="mdev-card"><h3>Web &amp; E-Commerce</h3><p>Portals and online stores.</p></div>
        <div class="mdev-card"><h3>Creative &amp; Marketing</h3><p>Brand, content, campaigns.</p></div>
      </section>
    `,
    contact: `
      <section class="mdev-hero">
        <h1>Contact Us</h1>
        <p>hello@maatridev.com · We respond within 24 hours.</p>
      </section>
      <section class="mdev-section">
        <p>Use the contact form on this page or book an appointment online.</p>
      </section>
    `,
  };

  return templates[pageId] || templates.home;
}
