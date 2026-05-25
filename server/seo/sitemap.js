import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.join(__dirname, "..", "..");

const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/projects",
  "/team",
  "/blog",
  "/pricing",
  "/faq",
  "/appointment",
];

const SERVICE_IDS = [
  "software",
  "ai",
  "cloud",
  "integration",
  "web",
  "creative",
  "blockchain",
  "events",
];

export function getSiteUrl(env = process.env) {
  return (env.PUBLIC_URL || env.LIVE_URL || env.VITE_SITE_URL || "https://maatridev.com").replace(
    /\/$/,
    "",
  );
}

function readBlogEntries(root = PROJECT_ROOT) {
  const blogsFile = path.join(root, "server/data/blogs.json");
  if (!fs.existsSync(blogsFile)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(blogsFile, "utf8"));
    return (data.posts || []).map((p) => ({
      slug: p.slug,
      lastmod: p.datePublished || p.updatedAt || null,
    }));
  } catch {
    return [];
  }
}

function fallbackBlogSlugsFromSiteData(root = PROJECT_ROOT) {
  const file = path.join(root, "src/data/siteData.js");
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8");
  const slugs = [];
  const re = /slug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) slugs.push({ slug: m[1], lastmod: null });
  return slugs;
}

/**
 * @param {{ blogPosts?: Array<{slug:string,datePublished?:string}> }} opts
 */
export function collectSitemapUrls({ siteUrl, blogPosts } = {}) {
  const base = siteUrl || getSiteUrl();
  const blogs =
    blogPosts?.length > 0
      ? blogPosts.map((p) => ({ slug: p.slug, lastmod: p.datePublished || null }))
      : readBlogEntries();
  const blogList = blogs.length ? blogs : fallbackBlogSlugsFromSiteData();

  const urls = [
    ...STATIC_PATHS.map((p) => ({
      loc: `${base}${p}`,
      priority: p === "/" ? "1.0" : "0.8",
      lastmod: null,
    })),
    ...SERVICE_IDS.map((id) => ({
      loc: `${base}/services/${id}`,
      priority: "0.7",
      lastmod: null,
    })),
    ...[1, 2, 3, 4].map((id) => ({
      loc: `${base}/projects/${id}`,
      priority: "0.6",
      lastmod: null,
    })),
    ...blogList
      .filter((b) => b.slug)
      .map((b) => ({
        loc: `${base}/blog/${b.slug}`,
        priority: "0.7",
        lastmod: b.lastmod,
      })),
  ];

  return urls;
}

export function buildSitemapXml(urls) {
  const body = urls
    .map((u) => {
      const lastmod = u.lastmod
        ? `\n    <lastmod>${String(u.lastmod).slice(0, 10)}</lastmod>`
        : "";
      return `  <url>\n    <loc>${u.loc}</loc>${lastmod}\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/**
 * Write sitemap to public/ and optionally production web root (SEO_WEB_ROOT).
 */
export function writeSitemapFiles({ urls, root = PROJECT_ROOT, webRoot = null } = {}) {
  const xml = buildSitemapXml(urls);
  const publicPath = path.join(root, "public/sitemap.xml");
  fs.writeFileSync(publicPath, xml);

  const targets = [publicPath];
  const wr = (webRoot || process.env.SEO_WEB_ROOT || "").trim();
  if (wr && fs.existsSync(wr)) {
    const livePath = path.join(wr, "sitemap.xml");
    let canWrite = false;
    try {
      fs.accessSync(wr, fs.constants.W_OK);
      canWrite = true;
    } catch {
      canWrite = false;
    }
    if (canWrite) {
      fs.writeFileSync(livePath, xml);
      targets.push(livePath);
    } else {
      console.log(
        `[seo] Skipped ${livePath} (no write access). Use deploy/ec2-setup.sh, or nginx proxy for /sitemap.xml → API.`,
      );
    }
  }

  const distPath = path.join(root, "dist/sitemap.xml");
  if (fs.existsSync(path.dirname(distPath))) {
    fs.writeFileSync(distPath, xml);
    targets.push(distPath);
  }

  return { xml, paths: targets, urlCount: urls.length };
}

export function generateSitemap({ siteUrl, blogPosts, root, webRoot } = {}) {
  const urls = collectSitemapUrls({ siteUrl, blogPosts });
  const result = writeSitemapFiles({ urls, root, webRoot });
  return { ...result, siteUrl: siteUrl || getSiteUrl() };
}
