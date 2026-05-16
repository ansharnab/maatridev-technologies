import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer({ settings = {} }) {
  const email = settings.email || "hello@maatridev.com";
  const phone = settings.phone || "+91 98765 43210";

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <div className="site-footer__brand">
            <span className="site-footer__logo">M</span>
            <div>
              <strong>MaatriDev Technologies</strong>
              <p>{settings.tagline || "Navigate your next with technology"}</p>
            </div>
          </div>
          <p className="site-footer__about">
            A pure-service technology, creative, and digital firm — software, web, CRM, cloud, design,
            marketing, ITeS, events, and consultancy delivered across India and globally.
          </p>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/team">Our Team</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">All Services</Link></li>
            <li><Link to="/appointment">Appointment</Link></li>
            <li><Link to="/pricing">Engagement Models</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="site-footer__contact">
            <li><i className="fa-solid fa-envelope" /> {email}</li>
            <li><i className="fa-solid fa-phone" /> {phone}</li>
            <li><i className="fa-solid fa-location-dot" /> {settings.address || "India · Global"}</li>
          </ul>
          <div className="site-footer__social">
            <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
            <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter" /></a>
            <a href="#" aria-label="GitHub"><i className="fa-brands fa-github" /></a>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom container">
        <p>© {new Date().getFullYear()} MaatriDev Technologies. Founders: Akshansh Arnab & Swetav Savarn.</p>
        <div>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
