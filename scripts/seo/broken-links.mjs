import fs from "fs";
import path from "path";
import { PROJECT_ROOT, initSeoEnv, seoDataDir, writeJson } from "./config.mjs";
import { seoLog } from "./logger.mjs";

const STATIC_OK = new Set([
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
]);

const SERVICE_IDS = new Set([
  "software",
  "ai",
  "cloud",
  "integration",
  "web",
  "creative",
  "blockchain",
  "events",
]);

function isValidInternal(href, blogSlugs) {
  const p = href.split("?")[0].replace(/\/$/, "") || "/";
  if (STATIC_OK.has(p)) return true;
  if (p.startsWith("/services/") && SERVICE_IDS.has(p.split("/")[2])) return true;
  if (p.match(/^\/projects\/\d+$/)) return true;
  if (p.startsWith("/blog/")) {
    const slug = p.slice(6);
    return blogSlugs.has(slug);
  }
  return false;
}

export function scanBrokenInternalLinks() {
  initSeoEnv();
  const blogsFile = path.join(PROJECT_ROOT, "server/data/blogs.json");
  const posts = JSON.parse(fs.readFileSync(blogsFile, "utf8")).posts || [];
  const blogSlugs = new Set(posts.map((p) => p.slug).filter(Boolean));
  const broken = [];

  for (const post of posts) {
    const html = post.bodyHtml || "";
    const re = /href="(\/[^"#?]+)"/g;
    let m;
    while ((m = re.exec(html))) {
      const href = m[1];
      if (!isValidInternal(href, blogSlugs)) {
        broken.push({ slug: post.slug, href, title: post.title });
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    postsScanned: posts.length,
    brokenCount: broken.length,
    broken: broken.slice(0, 50),
  };

  const out = path.join(seoDataDir(), "reports", `broken-links-${report.generatedAt.slice(0, 10)}.json`);
  writeJson(out, report);
  writeJson(path.join(seoDataDir(), "broken-links-latest.json"), report);
  seoLog(`Broken internal links: ${broken.length} issue(s) in ${posts.length} posts`);
  return report;
}
