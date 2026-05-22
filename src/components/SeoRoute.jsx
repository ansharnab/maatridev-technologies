import { useMemo } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { useSiteData } from "../context/SiteDataContext";
import { findBlogPost, resolveSeoMeta } from "../utils/seo";
import SeoHead from "./SeoHead";

/** Numeric /blog/:id → canonical /blog/:slug */
function BlogSlugRedirect() {
  const { slugOrId } = useParams();
  const { blog } = useSiteData();
  const post = findBlogPost(blog, slugOrId);
  if (post?.slug && /^\d+$/.test(String(slugOrId))) {
    return <Navigate to={`/blog/${post.slug}`} replace />;
  }
  return null;
}

export default function SeoRoute() {
  const { pathname } = useLocation();
  const params = useParams();
  const { settings, content, blog, services, projects, team } = useSiteData();

  const blogPost = useMemo(() => {
    if (!pathname.startsWith("/blog/") || pathname === "/blog/list") return null;
    const key = params.slugOrId || pathname.split("/")[2];
    return findBlogPost(blog, key);
  }, [pathname, params.slugOrId, blog]);

  const service = useMemo(() => {
    if (!params.id || !pathname.startsWith("/services/")) return null;
    return services.find((s) => s.id === params.id) || null;
  }, [pathname, params.id, services]);

  const project = useMemo(() => {
    const m = pathname.match(/^\/projects\/(\d+)$/);
    if (!m) return null;
    return projects.find((p) => String(p.id) === m[1]) || null;
  }, [pathname, projects]);

  const teamMember = useMemo(() => {
    const m = pathname.match(/^\/team\/(\d+)$/);
    if (!m) return null;
    const idx = Number(m[1]);
    return team[idx] || null;
  }, [pathname, team]);

  const meta = useMemo(
    () =>
      resolveSeoMeta({
        pathname,
        settings,
        content,
        blogPost,
        service,
        project,
        teamMember,
      }),
    [pathname, settings, content, blogPost, service, project, teamMember],
  );

  const needsRedirect =
    pathname.match(/^\/blog\/([^/]+)$/) &&
    blogPost?.slug &&
    params.slugOrId &&
    /^\d+$/.test(String(params.slugOrId));

  return (
    <>
      {needsRedirect ? <BlogSlugRedirect /> : null}
      <SeoHead {...meta} />
    </>
  );
}
