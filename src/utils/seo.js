import { pageIdFromPathname } from "./pageHeaderSettings";
import { absoluteAssetUrl, absoluteUrl } from "./siteUrl";
import { slugify } from "./slugify";
import { DEFAULT_SITE_SEO, HOME_VARIANT_PATHS, ROUTE_SEO } from "./seoRoutes";

export function normalizeBlogPost(post = {}) {
  const title = post.title || "Blog";
  const slug = (post.slug || slugify(title)).trim() || `post-${post.id || 1}`;
  return {
    ...post,
    slug,
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || post.excerpt || "",
    datePublished: post.datePublished || "2026-05-10",
    imageAlt: post.imageAlt || title,
  };
}

export function findBlogPost(blogPosts, slugOrId) {
  if (!slugOrId) return null;
  const key = String(slugOrId);
  return (
    blogPosts.find((p) => p.slug === key) ||
    blogPosts.find((p) => String(p.id) === key) ||
    null
  );
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (obj?.[k] != null && obj[k] !== "") out[k] = obj[k];
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Resolve meta for current SPA route (used by SeoHead on every navigation).
 */
function breadcrumbJsonLd(items = []) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url ? absoluteUrl(item.url) : undefined,
    })),
  };
}

export function resolveSeoMeta({
  pathname = "/",
  settings = {},
  content = {},
  blogPost = null,
  service = null,
  project = null,
  teamMember = null,
  faqs = [],
} = {}) {
  const siteSeo = settings.seo || {};
  const siteName = settings.siteName || "MaatriDev Technologies";
  const defaults = {
    ...DEFAULT_SITE_SEO,
    ...pick(siteSeo, ["title", "description", "ogImage", "twitterCard", "keywords"]),
    ogImage: siteSeo.ogImage || settings.logoImage || DEFAULT_SITE_SEO.ogImage,
  };

  let title = defaults.title;
  let description = defaults.description;
  let ogImage = defaults.ogImage;
  let keywords = siteSeo.keywords || "";
  let noindex = false;
  let canonicalPath = pathname.split("?")[0].replace(/\/$/, "") || "/";
  let jsonLd = null;

  if (pathname.startsWith("/admin")) {
    return {
      title: `Admin | ${siteName}`,
      description: "",
      ogImage,
      noindex: true,
      canonicalPath: "/admin",
      jsonLd: null,
    };
  }

  if (HOME_VARIANT_PATHS.includes(pathname)) {
    noindex = true;
    canonicalPath = "/";
    const variant = ROUTE_SEO["/"] || {};
    title = variant.title || defaults.title;
    description = variant.description || defaults.description;
  } else {
    const pageId = pageIdFromPathname(pathname);
    const pageSeo = pageId ? content?.pages?.[pageId]?.seo : null;
    const routeSeo = ROUTE_SEO[pathname] || ROUTE_SEO[canonicalPath];

    if (pageSeo) {
      title = pageSeo.title || title;
      description = pageSeo.description || description;
      ogImage = pageSeo.ogImage || ogImage;
      if (pageSeo.noindex) noindex = true;
      if (pageSeo.canonical) canonicalPath = pageSeo.canonical;
      keywords = pageSeo.keywords || keywords;
    } else if (routeSeo) {
      title = routeSeo.title || title;
      description = routeSeo.description || description;
      ogImage = routeSeo.ogImage || ogImage;
      if (routeSeo.noindex) noindex = true;
      if (routeSeo.canonicalPath) canonicalPath = routeSeo.canonicalPath;
    }

    const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
    if (blogMatch && blogPost) {
      title = blogPost.metaTitle || `${blogPost.title} | ${siteName}`;
      description = blogPost.metaDescription || blogPost.excerpt || description;
      ogImage = blogPost.image || ogImage;
      canonicalPath = `/blog/${blogPost.slug}`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blogPost.title,
        description: blogPost.metaDescription || blogPost.excerpt,
        image: absoluteAssetUrl(blogPost.image),
        datePublished: blogPost.datePublished,
        dateModified: blogPost.datePublished,
        author: { "@type": "Person", name: blogPost.author },
        publisher: {
          "@type": "Organization",
          name: siteName,
          logo: { "@type": "ImageObject", url: absoluteAssetUrl(settings.logoImage) },
        },
        mainEntityOfPage: absoluteUrl(canonicalPath),
      };
    }

    const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
    if (serviceMatch && service) {
      title = `${service.title} | Services | ${siteName}`;
      description = service.summary || description;
      canonicalPath = `/services/${service.id}`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.summary,
        provider: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
      };
    }

    const projectMatch = pathname.match(/^\/projects\/(\d+)$/);
    if (projectMatch && project) {
      title = `${project.title} | Projects | ${siteName}`;
      description = `${project.category} delivery for ${project.client || "clients"}.`;
      ogImage = project.image || ogImage;
      canonicalPath = `/projects/${project.id}`;
    }

    const teamMatch = pathname.match(/^\/team\/(\d+)$/);
    if (teamMatch && teamMember) {
      title = `${teamMember.name} | Team | ${siteName}`;
      description = teamMember.bio || description;
      ogImage = teamMember.image || ogImage;
    }
  }

  const canonical = absoluteUrl(canonicalPath);
  const ogImageAbs = absoluteAssetUrl(ogImage);

  const sameAs = (settings.socialLinks || settings.sameAs || [])
    .filter(Boolean)
    .slice(0, 8);

  const organization =
    pathname === "/" || pathname.startsWith("/about")
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteName,
          url: absoluteUrl("/"),
          logo: absoluteAssetUrl(settings.logoImage),
          email: settings.email,
          telephone: settings.phone,
          address: settings.address,
          sameAs,
        }
      : null;

  const faqPage =
    pathname === "/faq" && faqs?.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  let breadcrumbs = null;
  if (blogPost) {
    breadcrumbs = breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: blogPost.title, url: `/blog/${blogPost.slug}` },
    ]);
  } else if (service) {
    breadcrumbs = breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: service.title, url: `/services/${service.id}` },
    ]);
  } else if (pathname === "/faq") {
    breadcrumbs = breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "FAQ", url: "/faq" },
    ]);
  }

  const website =
    pathname === "/"
      ? {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName,
          url: absoluteUrl("/"),
          description: defaults.description,
          publisher: { "@type": "Organization", name: siteName },
        }
      : null;

  const schemas = [organization, website, faqPage, breadcrumbs, jsonLd].filter(Boolean);

  return {
    title,
    description,
    ogImage: ogImageAbs,
    keywords,
    noindex,
    canonical,
    canonicalPath,
    twitterCard: defaults.twitterCard || "summary_large_image",
    jsonLd: schemas.length ? schemas : null,
  };
}
