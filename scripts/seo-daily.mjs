#!/usr/bin/env node
/**
 * Daily automation: blog + SEO + static publish.
 * Cron: deploy/install-daily-automation.sh
 */
import { initSeoEnv } from "./seo/config.mjs";
import { seoLog } from "./seo/logger.mjs";
import { runHealthAudit } from "./seo/health-audit.mjs";
import { generateSitemap, getSiteUrl } from "../server/seo/sitemap.js";
import { listBlogPosts } from "../server/blogStore.js";
import { submitIndexNow, getIndexNowKey } from "./seo/indexnow.mjs";
import { ensureKeywordPlan, expandKeywordsWithAI } from "./seo/keyword-plan.mjs";
import { generateBacklinkReport } from "./seo/backlink-report.mjs";
import { readJson, writeJson, seoStatePath } from "./seo/config.mjs";
import { syncWebRoot } from "./seo/sync-web-root.mjs";
import { scanBrokenInternalLinks } from "./seo/broken-links.mjs";
import { generateWeeklyReport } from "./seo/weekly-report.mjs";
import { pingDiscovery } from "./seo/ping-discovery.mjs";
import { runPageSpeedAudit } from "./seo/pagespeed.mjs";
import { watchCompetitors } from "./seo/competitor-watch.mjs";

initSeoEnv();

const day = new Date().getDay(); // 0 Sun, 1 Mon, 2 Tue, 3 Wed, 4 Thu, 6 Sat
const withBlog = process.argv.includes("--with-blog") || !process.argv.includes("--seo-only");

async function main() {
  seoLog("=== Daily automation start ===");

  if (withBlog) {
    const { generateDailyBlog } = await import("../server/blogGenerator.js");
    const { runAfterPublish } = await import("./seo/run-after-publish.mjs");
    const result = await generateDailyBlog({ force: process.argv.includes("--force") });
    if (result.ok && result.post) {
      await runAfterPublish({ post: result.post });
      seoLog(`Blog published: ${result.post.title}`);
    } else if (result.skipped) {
      seoLog(`Blog skipped: ${result.reason}`);
    }
  }

  ensureKeywordPlan();
  const siteUrl = getSiteUrl();
  const posts = listBlogPosts();
  generateSitemap({ siteUrl, blogPosts: posts });
  seoLog("Sitemap regenerated");

  const health = runHealthAudit();

  if (process.env.INDEXNOW_KEY) {
    getIndexNowKey();
    const latest = posts[0];
    const urls = [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/blog`,
      ...(latest?.slug ? [`${siteUrl}/blog/${latest.slug}`] : []),
    ];
    try {
      await submitIndexNow(urls);
    } catch (err) {
      seoLog(`IndexNow: ${err.message}`);
    }
  }

  if (!withBlog || process.argv.includes("--ping-only")) {
    try {
      await pingDiscovery();
    } catch (err) {
      seoLog(`Discovery ping: ${err.message}`);
    }
  }

  if (day === 1) {
    try {
      await expandKeywordsWithAI();
    } catch (err) {
      seoLog(`Keyword expansion: ${err.message}`);
    }
  }

  if (day === 2) {
    try {
      await runPageSpeedAudit();
    } catch (err) {
      seoLog(`PageSpeed: ${err.message}`);
    }
  }

  if (day === 3) {
    generateBacklinkReport();
  }

  if (day === 4) {
    try {
      await watchCompetitors();
    } catch (err) {
      seoLog(`Competitor watch: ${err.message}`);
    }
  }

  if (day === 6) {
    scanBrokenInternalLinks();
  }

  if (day === 0) {
    generateWeeklyReport();
  }

  syncWebRoot();

  const state = readJson(seoStatePath(), {});
  state.lastDailyRun = new Date().toISOString();
  state.lastHealthScore = health.score;
  writeJson(seoStatePath(), state);

  seoLog(`=== Daily automation complete (health ${health.score}/100) ===`);
}

main().catch((err) => {
  seoLog(err.message || String(err), "error");
  process.exit(1);
});
