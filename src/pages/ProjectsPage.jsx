import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { projects } from "../data/siteData";

export default function ProjectsPage() {
  return (
    <>
      <PageHero title="Our Projects" description="Enterprise software, AI, cloud, and digital delivery." breadcrumb={[{ label: "Projects" }]} />
      <section className="section">
        <div className="container grid-3">
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="card project-card">
              <img src={p.image} alt={p.title} />
              <div className="card__body">
                <span className="project-card__cat">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.client}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
