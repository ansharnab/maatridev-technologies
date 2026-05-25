/**
 * Build-time sitemap — also run after each blog post (seo/run-after-publish).
 */
import { initSeoEnv } from "./seo/config.mjs";
import { generateSitemap, getSiteUrl } from "../server/seo/sitemap.js";
import { listBlogPosts } from "../server/blogStore.js";

initSeoEnv();

const result = generateSitemap({
  siteUrl: getSiteUrl(),
  blogPosts: listBlogPosts(),
  webRoot: process.env.SEO_WEB_ROOT || null,
});

console.log(`Wrote sitemap (${result.urlCount} URLs, base ${result.siteUrl})`);
console.log(result.paths.join("\n"));
