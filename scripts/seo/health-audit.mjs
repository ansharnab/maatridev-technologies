import fs from "fs";
import path from "path";
import { PROJECT_ROOT, getSiteUrl, initSeoEnv, readJson, writeJson, seoDataDir } from "./config.mjs";
import { seoLog } from "./logger.mjs";

function duplicateTitles(posts) {
  const seen = new Map();
  const dups = [];
  for (const p of posts) {
    const t = (p.title || "").trim().toLowerCase();
    if (!t) continue;
    if (seen.has(t)) dups.push({ title: p.title, slugs: [seen.get(t), p.slug] });
    else seen.set(t, p.slug);
  }
  return dups;
}

function postsMissingMeta(posts) {
  return posts.filter(
    (p) =>
      !p.metaDescription ||
      p.metaDescription.length < 80 ||
      !p.metaTitle ||
      !p.excerpt,
  );
}

function weakInternalLinks(html = "") {
  const internal = (html.match(/href="\/(services|blog|contact)/gi) || []).length;
  return internal < 2;
}

export function runHealthAudit() {
  initSeoEnv();
  const siteUrl = getSiteUrl();
  const issues = [];
  const warnings = [];
  const passed = [];

  const robotsPath = path.join(PROJECT_ROOT, "public/robots.txt");
  if (!fs.existsSync(robotsPath)) {
    issues.push({ id: "robots_missing", message: "public/robots.txt missing" });
  } else {
    const robots = fs.readFileSync(robotsPath, "utf8");
    if (!robots.includes("Sitemap:")) warnings.push({ id: "robots_no_sitemap", message: "robots.txt has no Sitemap line" });
    else passed.push("robots.txt includes sitemap");
  }

  const sitemapPath = path.join(PROJECT_ROOT, "public/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    issues.push({ id: "sitemap_missing", message: "public/sitemap.xml missing — run npm run seo:sitemap" });
  } else {
    const xml = fs.readFileSync(sitemapPath, "utf8");
    const count = (xml.match(/<loc>/g) || []).length;
    passed.push(`sitemap.xml has ${count} URLs`);
    if (count < 15) warnings.push({ id: "sitemap_thin", message: `Only ${count} URLs in sitemap` });
  }

  const blogsFile = path.join(PROJECT_ROOT, "server/data/blogs.json");
  const posts = readJson(blogsFile, { posts: [] }).posts || [];
  passed.push(`${posts.length} blog posts in store`);

  const missingMeta = postsMissingMeta(posts);
  if (missingMeta.length) {
    warnings.push({
      id: "meta_thin",
      message: `${missingMeta.length} post(s) missing strong metaTitle/metaDescription`,
      slugs: missingMeta.slice(0, 5).map((p) => p.slug),
    });
  }

  const dups = duplicateTitles(posts);
  if (dups.length) {
    issues.push({ id: "duplicate_titles", message: `${dups.length} duplicate title(s)`, items: dups });
  }

  const weakLinks = posts.slice(0, 20).filter((p) => weakInternalLinks(p.bodyHtml));
  if (weakLinks.length > 3) {
    warnings.push({
      id: "weak_internal_links",
      message: `${weakLinks.length} recent posts have fewer than 2 internal links`,
    });
  }

  const score = Math.max(0, 100 - issues.length * 15 - warnings.length * 5);
  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    score,
    grade: score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D",
    issues,
    warnings,
    passed,
    postCount: posts.length,
  };

  const out = path.join(seoDataDir(), "reports", `health-${report.generatedAt.slice(0, 10)}.json`);
  writeJson(out, report);
  writeJson(path.join(seoDataDir(), "health-latest.json"), report);

  seoLog(`SEO health score: ${score}/100 (${report.grade}) — ${issues.length} issues, ${warnings.length} warnings`);
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthAudit();
}
