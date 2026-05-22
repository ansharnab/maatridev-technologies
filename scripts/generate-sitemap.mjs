/**
 * Build-time sitemap (also served dynamically at /sitemap.xml in production).
 * Run: node scripts/generate-sitemap.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    out[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...process.env, ...loadEnv() };
const SITE_URL = (env.PUBLIC_URL || env.LIVE_URL || "https://maatridev.com").replace(/\/$/, "");

const STATIC = [
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

function readBlogSlugs() {
  const file = path.join(root, "src/data/siteData.js");
  const text = fs.readFileSync(file, "utf8");
  const slugs = [];
  const re = /slug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) slugs.push(m[1]);
  return slugs;
}

function urlEntry(loc, priority = "0.8") {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const urls = [
  ...STATIC.map((p) => urlEntry(`${SITE_URL}${p}`, p === "/" ? "1.0" : "0.8")),
  ...SERVICE_IDS.map((id) => urlEntry(`${SITE_URL}/services/${id}`, "0.7")),
  ...[1, 2, 3, 4].map((id) => urlEntry(`${SITE_URL}/projects/${id}`, "0.6")),
  ...readBlogSlugs().map((slug) => urlEntry(`${SITE_URL}/blog/${slug}`, "0.7")),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

const outPath = path.join(root, "public/sitemap.xml");
fs.writeFileSync(outPath, xml);
console.log(`Wrote ${outPath} (${urls.length} URLs, base ${SITE_URL})`);
