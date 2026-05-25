import path from "path";
import { writeJson, seoDataDir, initSeoEnv, getSiteUrl } from "./config.mjs";
import { seoLog } from "./logger.mjs";

/**
 * Core Web Vitals via PageSpeed Insights API (free key from Google Cloud).
 * Env: GOOGLE_PSI_API_KEY
 */
export async function runPageSpeedAudit() {
  initSeoEnv();
  const key = (process.env.GOOGLE_PSI_API_KEY || "").trim();
  const siteUrl = getSiteUrl();
  const pages = ["/", "/blog", "/services", "/contact"];

  if (!key) {
    seoLog("GOOGLE_PSI_API_KEY not set — skip PageSpeed audit");
    return { skipped: true };
  }

  const results = [];
  for (const p of pages) {
    const url = `${siteUrl}${p}`;
    const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    api.searchParams.set("url", url);
    api.searchParams.set("key", key);
    api.searchParams.set("strategy", "mobile");
    api.searchParams.append("category", "performance");
    api.searchParams.append("category", "seo");

    try {
      const res = await fetch(api, { signal: AbortSignal.timeout(60000) });
      const data = await res.json();
      const perf = data.lighthouseResult?.categories?.performance?.score;
      const seo = data.lighthouseResult?.categories?.seo?.score;
      const lcp = data.lighthouseResult?.audits?.["largest-contentful-paint"]?.displayValue;
      results.push({ path: p, performance: perf, seo, lcp });
      seoLog(`PSI ${p}: perf=${perf ?? "?"} seo=${seo ?? "?"} LCP=${lcp ?? "?"}`);
    } catch (err) {
      results.push({ path: p, error: err.message });
    }
  }

  const report = { generatedAt: new Date().toISOString(), siteUrl, results };
  writeJson(path.join(seoDataDir(), "pagespeed-latest.json"), report);
  return report;
}
