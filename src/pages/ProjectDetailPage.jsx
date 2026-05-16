import { useParams, Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { projects } from "../data/siteData";

export default function ProjectDetailPage() {
  const project = projects.find((p) => String(p.id) === useParams().id) || projects[0];

  return (
    <>
      <PageHero
        title={project.title}
        description={`Client: ${project.client} · ${project.category}`}
        breadcrumb={[{ to: "/projects", label: "Projects" }, { label: project.title }]}
      />
      <section className="section">
        <div className="container">
          <img src={project.image} alt={project.title} style={{ borderRadius: "var(--radius)", width: "100%", marginBottom: "2rem" }} />
          <p>
            MaatriDev delivered end-to-end architecture, development, and support for this {project.category.toLowerCase()}{" "}
            initiative — aligned with enterprise security, scalability, and measurable business outcomes.
          </p>
          <Link to="/contact" className="btn btn--primary">Start Similar Project</Link>
        </div>
      </section>
    </>
  );
}
