import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function PageHero({ title, description, breadcrumb = [] }) {
  return (
    <section className="page-hero">
      <div className="page-hero__bg" aria-hidden="true">
        <div className="page-hero__orb" />
      </div>
      <div className="container">
        {breadcrumb.length > 0 && (
          <Reveal>
            <nav className="breadcrumb">
              <Link to="/">Home</Link>
              {breadcrumb.map((item) => (
                <span key={item.label}>
                  {" / "}
                  {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        <Reveal delay={80}>
          <h1>{title}</h1>
        </Reveal>
        {description && (
          <Reveal delay={160}>
            <p>{description}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
