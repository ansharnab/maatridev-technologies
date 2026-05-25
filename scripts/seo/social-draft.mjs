import fs from "fs";
import path from "path";
import { initSeoEnv, seoDataDir, getSiteUrl } from "./config.mjs";
import { seoLog } from "./logger.mjs";

/**
 * Ready-to-post LinkedIn copy for each new blog (manual paste = safe, no spam API).
 */
export function writeSocialDraft(post) {
  if (!post?.slug) return null;
  initSeoEnv();
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;
  const dir = path.join(seoDataDir(), "social-drafts");
  fs.mkdirSync(dir, { recursive: true });

  const linkedin = `New on the MaatriDev blog 👇

${post.title}

${post.excerpt || ""}

Read more: ${url}

#AI #Cloud #SoftwareDevelopment #DevOps #MaatriDev #TechIndia

---
Copy-paste to LinkedIn company page. Add 1 relevant image from the blog hero if you have it.`;

  const twitter = `${(post.title || "").slice(0, 200)}

${url}

#AI #cloud #devops #software`;

  const file = path.join(dir, `${post.slug}.md`);
  fs.writeFileSync(
    file,
    `# Social drafts — ${post.title}\n\n## LinkedIn\n\n${linkedin}\n\n## X (Twitter)\n\n${twitter}\n`,
  );
  seoLog(`Social draft → ${file}`);
  return file;
}
