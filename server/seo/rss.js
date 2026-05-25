import { getSiteUrl } from "./sitemap.js";

/**
 * RSS 2.0 feed for blog posts (discovery + freshness signals).
 * @param {Array} posts newest first
 */
export function buildRssXml(posts = [], { siteUrl, siteName = "MaatriDev Technologies" } = {}) {
  const base = siteUrl || getSiteUrl();
  const items = posts.slice(0, 50).map((p) => {
    const link = `${base}/blog/${p.slug}`;
    const pubDate = p.datePublished
      ? new Date(p.datePublished).toUTCString()
      : new Date().toUTCString();
  const desc = (p.excerpt || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `    <item>
      <title><![CDATA[${p.title || "Post"}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName} Blog</title>
    <link>${base}/blog</link>
    <description>AI, cloud, and software insights from ${siteName}</description>
    <language>en-in</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>
`;
}
