import { useParams, Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { team } from "../data/siteData";

export default function TeamDetailPage() {
  const member = team[Number(useParams().id)] || team[0];

  return (
    <>
      <PageHero
        title={member.name}
        description={member.role}
        breadcrumb={[{ to: "/team", label: "Team" }, { label: member.name }]}
      />
      <section className="section">
        <div className="container grid-2">
          <img src={member.image} alt={member.name} style={{ borderRadius: "var(--radius)", width: "100%" }} />
          <div>
            <h2 className="section-title">Profile</h2>
            <p>{member.bio}</p>
            <Link to="/contact" className="btn btn--primary">Work With Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
