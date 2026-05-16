import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { blogPosts } from "../data/siteData";

export default function BlogPage({ layout = "grid" }) {
  return (
    <>
      <PageHero
        title={layout === "list" ? "Blog — List View" : "Blog — Grid View"}
        description="Insights on AI, digital transformation, and enterprise software."
        breadcrumb={[{ label: "Blog" }]}
      />
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.75rem" }}>
            <Link to="/blog" className={`btn ${layout === "grid" ? "btn--primary" : "btn--outline"}`}>Grid</Link>
            <Link to="/blog/list" className={`btn ${layout === "list" ? "btn--primary" : "btn--outline"}`}>List</Link>
          </div>
          <div className={layout === "list" ? "blog-list" : "grid-3"}>
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className={`card blog-card ${layout === "list" ? "blog-card--list" : ""}`}>
                <img src={post.image} alt={post.title} />
                <div className="card__body">
                  <p className="blog-meta">{post.date} · {post.category}</p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
