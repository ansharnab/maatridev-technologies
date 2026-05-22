import { Link, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useSiteData } from "../context/SiteDataContext";
import { findBlogPost } from "../utils/seo";

export default function BlogDetailPage() {
  const { slugOrId } = useParams();
  const { blog } = useSiteData();
  const post = findBlogPost(blog, slugOrId) || blog[0];

  if (!post) {
    return (
      <section className="section">
        <div className="container">
          <p>Post not found.</p>
          <Link to="/blog">← Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        title={post.title}
        description={`${post.date} · By ${post.author}`}
        breadcrumb={[{ to: "/blog", label: "Blog" }, { label: post.title }]}
      />
      <section className="section">
        <article className="container" style={{ maxWidth: 800 }}>
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            style={{ borderRadius: "var(--radius)", width: "100%", marginBottom: "2rem" }}
          />
          <p>{post.excerpt}</p>
          <p>
            At MaatriDev Technologies, we combine deep technical expertise with practical delivery — from LLM
            optimization and prompt engineering to CRM platforms and cloud-native architectures. Contact our founders
            Akshansh Arnab and Swetav Savarn to discuss how these insights apply to your organization.
          </p>
          <Link to="/blog" className="btn btn--outline">
            ← Back to Blog
          </Link>
        </article>
      </section>
    </>
  );
}
