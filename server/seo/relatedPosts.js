/**
 * Internal linking: append related posts block to generated articles.
 */

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreRelated(post, { slug, category }) {
  let score = 0;
  if (post.slug === slug) return -1;
  if (post.category && post.category === category) score += 3;
  const tagsA = new Set((post.tags || []).map((t) => String(t).toLowerCase()));
  if (category && tagsA.has(String(category).toLowerCase())) score += 2;
  return score + Math.random() * 0.5;
}

export function pickRelatedPosts(allPosts = [], current = {}, limit = 3) {
  const ranked = allPosts
    .map((p) => ({ p, score: scoreRelated(p, current) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);

  const picked = [];
  const seen = new Set();
  for (const { p } of ranked) {
    if (picked.length >= limit) break;
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    picked.push(p);
  }
  return picked;
}

export function appendRelatedPostsBlock(bodyHtml = "", related = []) {
  if (!related.length) return bodyHtml;
  if (String(bodyHtml).includes("related-posts-auto")) return bodyHtml;

  const items = related
    .map(
      (p) =>
        `<li><a href="/blog/${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a></li>`,
    )
    .join("\n");

  return `${bodyHtml.trim()}\n<h2>Related reading</h2>\n<ul class="related-posts-auto">\n${items}\n</ul>`;
}

export function enrichBodyWithRelatedPosts(bodyHtml, current, allPosts) {
  const related = pickRelatedPosts(allPosts, current, 3);
  return appendRelatedPostsBlock(bodyHtml, related);
}
