import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useSiteData } from "../context/SiteDataContext";

export default function TeamPage() {
  const { team } = useSiteData();
  return (
    <>
      <PageHero title="Our Team" description="Founders and specialist squads behind every delivery." breadcrumb={[{ label: "Team" }]} />
      <section className="section">
        <div className="container grid-3">
          {team.map((member, idx) => (
            <Link key={member.name} to={`/team/${idx}`} className="card team-card">
              <img src={member.image} alt={member.name} />
              <div className="card__body">
                <h3>{member.name}</h3>
                <p className="founder-card__role">{member.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
