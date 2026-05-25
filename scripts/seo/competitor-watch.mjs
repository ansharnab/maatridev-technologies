import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { writeJson, seoDataDir, initSeoEnv } from "./config.mjs";
import { seoLog } from "./logger.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED = path.join(__dirname, "competitors.seed.json");

async function countSitemapUrls(domain) {
  const bases = [`https://${domain}/sitemap.xml`, `https://www.${domain}/sitemap.xml`];
  for (const url of bases) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const xml = await res.text();
      const count = (xml.match(/<loc>/g) || []).length;
      if (count) return { url, count };
    } catch {
      /* try next */
    }
  }
  return { url: null, count: 0 };
}

export async function watchCompetitors() {
  initSeoEnv();
  const target = path.join(seoDataDir(), "competitors.json");
  if (!fs.existsSync(target)) fs.copyFileSync(SEED, target);

  const list = JSON.parse(fs.readFileSync(target, "utf8")).domains || [];
  const results = [];

  for (const domain of list) {
    const { url, count } = await countSitemapUrls(domain);
    results.push({ domain, sitemap: url, urlCount: count });
    seoLog(`Competitor ${domain}: ~${count} URLs in sitemap`);
  }

  const report = { generatedAt: new Date().toISOString(), results };
  writeJson(path.join(seoDataDir(), "competitor-watch-latest.json"), report);
  return report;
}
