import { getSiteUrl, initSeoEnv } from "./config.mjs";
import { seoLog } from "./logger.mjs";

/**
 * Ping search engines + RSS hubs after new content (white-hat discovery signals).
 */
export async function pingDiscovery() {
  initSeoEnv();
  const siteUrl = getSiteUrl();
  const sitemap = `${siteUrl}/sitemap.xml`;
  const feed = `${siteUrl}/feed.xml`;
  const results = [];

  const ping = async (name, url, opts = {}) => {
    try {
      const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(15000) });
      results.push({ name, status: res.status, ok: res.ok });
      seoLog(`Ping ${name}: HTTP ${res.status}`);
    } catch (err) {
      results.push({ name, ok: false, error: err.message });
      seoLog(`Ping ${name} failed: ${err.message}`);
    }
  };

  await ping("bing-sitemap", `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`);
  await ping("google-sitemap", `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`);
  await ping("yandex-sitemap", `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemap)}`);

  try {
    const body = new URLSearchParams({ "hub.mode": "publish", "hub.url": feed });
    await ping("pubsubhubbub-rss", "https://pubsubhubbub.appspot.com/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  } catch {
    /* optional */
  }

  return results;
}
