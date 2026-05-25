import { listBlogPosts, updateBlogPost } from "../blogStore.js";

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Link 2–3 recent posts → newest post (topical cluster / crawl depth).
 */
export function addRetroactiveLinksToRecentPosts(newPost, { maxUpdates = 3 } = {}) {
  if (!newPost?.slug) return { updated: [] };

  const posts = listBlogPosts();
  const candidates = posts
    .filter((p) => p.slug !== newPost.slug)
    .slice(0, 12)
    .sort((a, b) => {
      const catA = a.category === newPost.category ? 1 : 0;
      const catB = b.category === newPost.category ? 1 : 0;
      return catB - catA;
    })
    .slice(0, maxUpdates);

  const updated = [];
  const linkNeedle = `/blog/${newPost.slug}`;

  for (const p of candidates) {
    const html = p.bodyHtml || "";
    if (html.includes(linkNeedle) || html.includes("retro-link-auto")) continue;

    const block = `<p class="retro-link-auto">Related update: <a href="/blog/${encodeURIComponent(newPost.slug)}">${escapeHtml(newPost.title)}</a>.</p>`;
    updateBlogPost(p.slug, { bodyHtml: `${html.trim()}\n${block}` });
    updated.push(p.slug);
  }

  return { updated };
}
