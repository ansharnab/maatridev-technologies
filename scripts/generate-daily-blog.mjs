#!/usr/bin/env node
/**
 * Daily blog generator — run via cron on EC2 (see deploy/install-blog-cron.sh).
 * Requires OPENAI_API_KEY in .env
 */
import path from "path";
import { fileURLToPath } from "url";
import { loadEnvFile } from "./load-env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnvFile(path.join(__dirname, "..", ".env"));

const { generateDailyBlog } = await import("../server/blogGenerator.js");
const { listBlogPosts } = await import("../server/blogStore.js");

try {
  const result = await generateDailyBlog({ force: process.argv.includes("--force") });
  if (result.skipped) {
    console.log(`Skipped: ${result.reason} (${result.date})`);
    process.exit(0);
  }
  const { runAfterPublish } = await import("./seo/run-after-publish.mjs");
  await runAfterPublish({ post: result.post });
  console.log(`Published: ${result.post.title}`);
  console.log(`URL slug: /blog/${result.post.slug}`);
  console.log(`Total posts: ${listBlogPosts().length}`);
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
