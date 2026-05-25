#!/usr/bin/env node
/** Test Gmail SMTP — uses latest blog post or --force with dummy */
import path from "path";
import { fileURLToPath } from "url";
import { loadEnvFile } from "../load-env.js";
import { listBlogPosts } from "../../server/blogStore.js";
import { sendSocialDraftEmail } from "./send-social-email.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnvFile(path.join(__dirname, "..", "..", ".env"));

const post = listBlogPosts()[0];
if (!post) {
  console.error("No blog posts found.");
  process.exit(1);
}

console.log(`Sending test email for: ${post.title}`);
const result = await sendSocialDraftEmail(post);
console.log(result);
