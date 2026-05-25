import { generateSitemap, getSiteUrl } from "../../server/seo/sitemap.js";
import { listBlogPosts } from "../../server/blogStore.js";
import { initSeoEnv, readJson, writeJson, seoStatePath } from "./config.mjs";
import { seoLog } from "./logger.mjs";
import { submitIndexNow } from "./indexnow.mjs";
import { syncWebRoot } from "./sync-web-root.mjs";
import { pingDiscovery } from "./ping-discovery.mjs";
import { writeSocialDraft } from "./social-draft.mjs";
import { sendSocialDraftEmail } from "./send-social-email.mjs";
import { addRetroactiveLinksToRecentPosts } from "../../server/seo/retroactiveLinks.js";

/**
 * Run after a new blog post is saved: refresh sitemap, ping IndexNow, log URLs.
 */
export async function runAfterPublish({ post } = {}) {
  initSeoEnv();
  const siteUrl = getSiteUrl();
  const posts = listBlogPosts();

  const sitemap = generateSitemap({
    siteUrl,
    blogPosts: posts,
    webRoot: process.env.SEO_WEB_ROOT || null,
  });
  seoLog(`Sitemap updated (${sitemap.urlCount} URLs) → ${sitemap.paths.join(", ")}`);

  const retro = addRetroactiveLinksToRecentPosts(post);
  if (retro.updated?.length) {
    seoLog(`Retroactive internal links added to: ${retro.updated.join(", ")}`);
  }

  writeSocialDraft(post);

  try {
    await sendSocialDraftEmail(post);
  } catch (err) {
    seoLog(`Social email failed: ${err.message}`, "error");
  }

  try {
    await pingDiscovery();
  } catch (err) {
    seoLog(`Discovery ping: ${err.message}`);
  }

  const urlsToPing = [];
  if (post?.slug) {
    urlsToPing.push(`${siteUrl}/blog/${post.slug}`);
  }
  urlsToPing.push(`${siteUrl}/blog`, `${siteUrl}/sitemap.xml`);

  const state = readJson(seoStatePath(), {});
  const indexedUrls = Array.isArray(state.indexedUrls) ? state.indexedUrls : [];
  const newUrls = urlsToPing.filter((u) => !indexedUrls.includes(u));

  if (newUrls.length && process.env.INDEXNOW_KEY) {
    try {
      await submitIndexNow(newUrls);
      state.indexedUrls = [...new Set([...indexedUrls, ...newUrls])].slice(-200);
    } catch (err) {
      seoLog(`IndexNow failed: ${err.message}`, "error");
    }
  } else if (!process.env.INDEXNOW_KEY) {
    seoLog("INDEXNOW_KEY not set — skip ping (add key to .env for faster indexing)");
  }

  state.lastPublish = new Date().toISOString();
  state.lastPostSlug = post?.slug || null;
  writeJson(seoStatePath(), state);

  const publish = syncWebRoot();

  return { sitemap, pinged: newUrls, publish };
}
