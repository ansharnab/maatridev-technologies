import fs from "fs";
import path from "path";
import { initSeoEnv, seoDataDir, getSiteUrl } from "./config.mjs";
import { seoLog } from "./logger.mjs";

/** LinkedIn + X copy for a blog post */
export function buildSocialDraftContent(post) {
  if (!post?.slug) return null;
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;
  const title = post.title || "Blog post";

  const imageUrl = String(post.image || "").trim();
  const imageLine = imageUrl
    ? `\nHero image (attach to LinkedIn post): ${imageUrl}`
    : "";

  const linkedin = `New on the MaatriDev blog 👇

${title}

${post.excerpt || ""}

Read more: ${url}${imageLine}

#AI #Cloud #SoftwareDevelopment #DevOps #MaatriDev #TechIndia

---
Copy-paste to LinkedIn. Use the hero image URL below (or the image in this email).`;

  const twitter = `${title.slice(0, 200)}

${url}

#AI #cloud #devops #software`;

  const markdown = `# Social drafts — ${title}\n\n## LinkedIn\n\n${linkedin}\n\n## X (Twitter)\n\n${twitter}\n`;

  return {
    title,
    url,
    linkedin,
    twitter,
    markdown,
    imageUrl,
    imageAlt: post.imageAlt || title,
  };
}

/**
 * Save draft to server/data/seo/social-drafts/{slug}.md
 */
export function writeSocialDraft(post) {
  if (!post?.slug) return null;
  initSeoEnv();
  const content = buildSocialDraftContent(post);
  if (!content) return null;

  const dir = path.join(seoDataDir(), "social-drafts");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${post.slug}.md`);
  fs.writeFileSync(file, content.markdown);
  seoLog(`Social draft → ${file}`);
  return file;
}
