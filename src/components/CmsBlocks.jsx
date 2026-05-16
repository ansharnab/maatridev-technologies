import { Link } from "react-router-dom";
import { useSiteContent } from "../hooks/useSiteContent";

export default function CmsBlocks({ pageId }) {
  const { getPageBlocks } = useSiteContent();
  const blocks = getPageBlocks(pageId, []);

  if (!blocks.length) return null;

  return (
    <section className="section cms-blocks">
      <div className="container">
        {blocks.map((block) => {
          if (block.type === "hero") {
            return (
              <div key={block.id} className="cms-hero card" style={{ padding: "2rem", marginBottom: "1rem" }}>
                <h2>{block.title}</h2>
                <p>{block.subtitle}</p>
                <Link to="/contact" className="btn btn--primary">{block.cta}</Link>
              </div>
            );
          }
          if (block.type === "text") {
            return <p key={block.id} className="cms-text">{block.body}</p>;
          }
          if (block.type === "image" && block.src) {
            return <img key={block.id} src={block.src} alt={block.alt || ""} style={{ borderRadius: "var(--radius)", marginBottom: "1rem" }} />;
          }
          if (block.type === "cta") {
            return (
              <div key={block.id} className="cta-banner" style={{ borderRadius: "var(--radius)", marginTop: "1rem" }}>
                <div className="container cta-banner__inner">
                  <h2>{block.title}</h2>
                  <Link to="/contact" className="btn btn--outline-light">{block.button}</Link>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}
