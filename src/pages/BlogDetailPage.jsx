import { Link, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useSiteData } from "../context/SiteDataContext";
import { findBlogPost } from "../utils/seo";

export default function BlogDetailPage() {
  const { slugOrId } = useParams();
  const { blog } = useSiteData();
  const post = findBlogPost(blog, slugOrId);

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

  const readLabel = post.readingMinutes ? `${post.readingMinutes} min read · ` : "";

  return (
    <>
      <PageHero
        title={post.title}
        description={`${readLabel}${post.date} · By ${post.author}`}
        breadcrumb={[{ to: "/blog", label: "Blog" }, { label: post.title }]}
      />
      <section className="section">
        <article className="container blog-article">
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            className="blog-article__hero-img"
            loading="eager"
          />
          {post.tags?.length > 0 && (
            <p className="blog-article__tags">
              {post.tags.map((t) => (
                <span key={t} className="blog-article__tag">
                  {t}
                </span>
              ))}
            </p>
          )}
          <p className="blog-article__excerpt">{post.excerpt}</p>
          <div
            className="blog-article__body"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml || "" }}
          />
          <div className="blog-article__cta">
            <p>
              Need help implementing this in your stack?{" "}
              <Link to="/services">Explore our services</Link> or{" "}
              <Link to="/contact">talk to MaatriDev</Link>.
            </p>
            <Link to="/blog" className="btn btn--outline">
              ← Back to Blog
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
