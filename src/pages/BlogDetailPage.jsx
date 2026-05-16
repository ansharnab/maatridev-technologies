import { useParams, Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { blogPosts } from "../data/siteData";

export default function BlogDetailPage() {
  const post = blogPosts.find((p) => String(p.id) === useParams().id) || blogPosts[0];

  return (
    <>
      <PageHero
        title={post.title}
        description={`${post.date} · By ${post.author}`}
        breadcrumb={[{ to: "/blog", label: "Blog" }, { label: post.title }]}
      />
      <section className="section">
        <article className="container" style={{ maxWidth: 800 }}>
          <img src={post.image} alt={post.title} style={{ borderRadius: "var(--radius)", width: "100%", marginBottom: "2rem" }} />
          <p>{post.excerpt}</p>
          <p>
            At MaatriDev Technologies, we combine deep technical expertise with practical delivery — from LLM optimization
            and prompt engineering to CRM platforms and cloud-native architectures. Contact our founders Akshansh Arnab
            and Swetav Savarn to discuss how these insights apply to your organization.
          </p>
          <Link to="/blog" className="btn btn--outline">← Back to Blog</Link>
        </article>
      </section>
    </>
  );
}
