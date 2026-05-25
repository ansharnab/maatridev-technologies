import fs from "fs";
import path from "path";
import { initSeoEnv, seoDataDir, readJson, writeJson, getSiteUrl, PROJECT_ROOT } from "./config.mjs";
import { seoLog } from "./logger.mjs";

export function generateWeeklyReport() {
  initSeoEnv();
  const siteUrl = getSiteUrl();
  const blogsFile = path.join(PROJECT_ROOT, "server/data/blogs.json");
  const posts = fs.existsSync(blogsFile)
    ? JSON.parse(fs.readFileSync(blogsFile, "utf8")).posts || []
    : [];

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = posts.filter((p) => {
    const d = new Date(p.datePublished || 0).getTime();
    return d >= weekAgo;
  });

  const health = readJson(path.join(seoDataDir(), "health-latest.json"), {});
  const keywords = readJson(path.join(seoDataDir(), "keywords.json"), { targets: [] });
  const backlinks = readJson(path.join(seoDataDir(), "backlinks-latest.json"), {});
  const broken = readJson(path.join(seoDataDir(), "broken-links-latest.json"), {});
  const state = readJson(path.join(seoDataDir(), "state.json"), {});

  const lines = [
    `# MaatriDev SEO Weekly Report`,
    ``,
    `**Site:** ${siteUrl}`,
    `**Generated:** ${new Date().toISOString().slice(0, 10)}`,
    ``,
    `## Summary`,
    `- SEO health score: **${health.score ?? "n/a"}/100** (${health.grade || "-"})`,
    `- Total blog posts: **${posts.length}**`,
    `- New posts this week: **${newThisWeek.length}**`,
    `- Broken internal links: **${broken.brokenCount ?? 0}**`,
    ``,
    `## New posts (7 days)`,
    ...(newThisWeek.length
      ? newThisWeek.map((p) => `- [${p.title}](${siteUrl}/blog/${p.slug})`)
      : [`- (none)`]),
    ``,
    `## Top keyword targets`,
    ...keywords.targets.slice(0, 8).map((t) => `- **${t.keyword}** → ${t.landingPage} (${t.priority})`),
    ``,
    `## Manual tasks this week (backlinks)`,
    ...(backlinks.thisWeek || []).map((t) => `- [${t.type}] ${t.name}: ${t.action}`),
    ``,
    `## Your 30-min checklist`,
    `1. Google Search Console → Performance → top queries`,
    `2. Fix any pages with 0 clicks but high impressions (title/meta)`,
    `3. Complete 2 backlink tasks above`,
    `4. Share 1 new blog on LinkedIn`,
    ``,
    `Last automation run: ${state.lastDailyRun || "never"}`,
  ];

  const md = lines.join("\n");
  const base = path.join(seoDataDir(), "reports");
  fs.mkdirSync(base, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const mdPath = path.join(base, `weekly-${date}.md`);
  fs.writeFileSync(mdPath, md);

  const jsonPath = path.join(seoDataDir(), "weekly-latest.json");
  writeJson(jsonPath, {
    generatedAt: new Date().toISOString(),
    siteUrl,
    healthScore: health.score,
    postCount: posts.length,
    newThisWeek: newThisWeek.length,
    brokenLinks: broken.brokenCount ?? 0,
    mdPath,
  });

  seoLog(`Weekly report → ${mdPath}`);
  return { mdPath, jsonPath };
}
