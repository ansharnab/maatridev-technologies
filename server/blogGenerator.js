import { slugify } from "./slugify.js";
import { sanitizeBlogHtml } from "./sanitizeBlogHtml.js";
import { enrichBodyWithRelatedPosts } from "./seo/relatedPosts.js";
import { addBlogPost, hasPostForDate, listBlogPosts } from "./blogStore.js";

const AUTHORS = ["Akshansh Arnab", "Swetav Savarn", "MaatriDev Team"];

const CATEGORIES = ["AI", "Cloud", "Software", "Web", "Security", "DevOps", "Consulting", "Technology"];

/** Only used if OpenAI topic planning fails */
const FALLBACK_TOPICS = [
  {
    angle: "Practical lessons from shipping internal AI tools in 2026",
    category: "AI",
    imageSearchQuery: "software team artificial intelligence",
    imageAlt: "Developers reviewing AI product screens",
  },
  {
    angle: "What we changed after a messy Kubernetes bill spike",
    category: "Cloud",
    imageSearchQuery: "cloud infrastructure engineering",
    imageAlt: "Engineer monitoring cloud dashboards",
  },
  {
    angle: "API contracts that stopped our microservices from arguing",
    category: "Software",
    imageSearchQuery: "api development laptop",
    imageAlt: "Developer documenting API design",
  },
];

const BANNED_PHRASES = [
  "in conclusion",
  "it's worth noting",
  "delve",
  "landscape",
  "game-changer",
  "leverage",
  "robust",
  "seamless",
  "harness",
  "cutting-edge",
  "revolutionize",
  "paradigm",
  "unlock the power",
  "in today's fast-paced",
  "ever-evolving",
];

function topicKeyFromAngle(angle = "") {
  return slugify(angle).slice(0, 96);
}

function significantWords(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

function wordJaccard(a = "", b = "") {
  const A = new Set(significantWords(a));
  const B = new Set(significantWords(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter += 1;
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}

function isTooSimilarToRecent(title, posts, threshold = 0.42) {
  const t = String(title || "").trim();
  if (!t) return true;
  return posts.slice(0, 12).some((p) => wordJaccard(t, p.title) >= threshold);
}

function collectUsedTopicKeys(existingPosts, lookback = 40) {
  const used = new Set();
  for (const p of existingPosts.slice(0, lookback)) {
    if (p.topicKey) used.add(p.topicKey);
    if (p.title) used.add(slugify(p.title).slice(0, 96));
  }
  return used;
}

function pickAuthor(existingPosts = []) {
  const recentAuthors = new Set(existingPosts.slice(0, 2).map((p) => p.author));
  const pool = AUTHORS.filter((a) => !recentAuthors.has(a));
  const list = pool.length ? pool : AUTHORS;
  return list[Math.floor(Math.random() * list.length)];
}

function formatDisplayDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

async function openAiJson({ apiKey, model, system, user, temperature = 0.9 }) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${errText.slice(0, 400)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty OpenAI response");
  return JSON.parse(content);
}

/** Fresh topic every run — not from a fixed list */
async function planTopicWithAI({ apiKey, model, existing, skipKeys = new Set(), force = false }) {
  const recent = existing.slice(0, force ? 20 : 30);
  const recentLines = recent.length
    ? recent.map((p) => `- ${p.title} [${p.category}]`).join("\n")
    : "(none yet)";

  const usedKeys = collectUsedTopicKeys(existing, force ? 20 : 40);
  for (const k of skipKeys) usedKeys.add(k);

  const system = `You are the editorial planner for MaatriDev Technologies (India) — IT consultancy: AI/ML, cloud, software, web, security, DevOps.

Pick ONE new blog topic that is specific and timely (2026). It must NOT overlap recent posts.

Return JSON only:
{
  "angle": "specific working title angle in plain English",
  "category": one of ${JSON.stringify(CATEGORIES)},
  "imageSearchQuery": "3-5 English keywords for stock photo search (no people logos)",
  "imageAlt": "short accessible alt text for hero image"
}

Rules:
- angle must be unique vs recent list (not a paraphrase)
- Prefer practical engineering/business angles, not generic hype
- category must match the angle`;

  const user = `Recent posts — do NOT repeat these themes or wording:
${recentLines}

${force ? "The editor needs a clearly different topic than the most recent post above." : "Plan today's post."}`;

  const parsed = await openAiJson({ apiKey, model, system, user, temperature: 0.95 });
  const angle = String(parsed.angle || "").trim();
  const category = CATEGORIES.includes(parsed.category) ? parsed.category : "Technology";

  if (!angle) throw new Error("Topic planner returned empty angle");

  const topic = {
    angle,
    category,
    imageSearchQuery: String(parsed.imageSearchQuery || `${category} technology india`).trim(),
    imageAlt: String(parsed.imageAlt || angle).trim(),
  };

  const key = topicKeyFromAngle(angle);
  if (usedKeys.has(key) || skipKeys.has(key)) {
    throw new Error("topic_collision");
  }

  return topic;
}

function pickFallbackTopic(existing, skipKeys) {
  const used = collectUsedTopicKeys(existing);
  for (const k of skipKeys) used.add(k);
  const pool = FALLBACK_TOPICS.filter((t) => !used.has(topicKeyFromAngle(t.angle)));
  const list = pool.length ? pool : FALLBACK_TOPICS;
  return list[Math.floor(Math.random() * list.length)];
}

async function planTopic({ apiKey, model, existing, skipKeys, force }) {
  try {
    return await planTopicWithAI({ apiKey, model, existing, skipKeys, force });
  } catch (err) {
    if (err.message !== "topic_collision") {
      console.warn("[blog] Topic AI failed, using fallback:", err.message);
    }
    return pickFallbackTopic(existing, skipKeys);
  }
}

async function fetchFromUnsplash(query, avoidUrls) {
  const key = (process.env.UNSPLASH_ACCESS_KEY || "").trim();
  if (!key) return null;

  const url = new URL("https://api.unsplash.com/photos/random");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  });
  if (!res.ok) return null;

  const data = await res.json();
  const img =
    data.urls?.regular ||
    data.urls?.full ||
    `${data.urls?.raw || ""}&w=1200&h=630&fit=crop`;
  if (!img || typeof img !== "string" || avoidUrls.has(img)) return null;
  return img.includes("?") ? `${img}&w=1200&h=630&fit=crop` : `${img}?w=1200&h=630&fit=crop`;
}

async function fetchFromPexels(query, avoidUrls) {
  const key = (process.env.PEXELS_API_KEY || "").trim();
  if (!key) return null;

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "15");
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url, {
    headers: { Authorization: key },
  });
  if (!res.ok) return null;

  const data = await res.json();
  const photos = data.photos || [];
  const fresh = photos.filter((p) => p.src?.large && !avoidUrls.has(p.src.large));
  const pick = (fresh.length ? fresh : photos)[Math.floor(Math.random() * (fresh.length || photos.length))];
  return pick?.src?.large || null;
}

/** Unique hero image per post — search query from AI, not a fixed URL list */
async function fetchBlogHeroImage({ searchQuery, slug, recentPosts = [] }) {
  const avoidUrls = new Set(recentPosts.slice(0, 12).map((p) => p.image).filter(Boolean));
  const query = String(searchQuery || "technology workspace").trim();

  const unsplash = await fetchFromUnsplash(query, avoidUrls);
  if (unsplash) return unsplash;

  const pexels = await fetchFromPexels(query, avoidUrls);
  if (pexels) return pexels;

  const seed = slugify(`${slug}-${query}`).slice(0, 48) || "maatridev-blog";
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`;
}

async function writeArticleWithAI({
  apiKey,
  model,
  topic,
  author,
  recentTitles = [],
  recentPostsForLinks = [],
  mustDifferFrom = "",
}) {
  const avoidBlock =
    recentTitles.length > 0
      ? `\nDo NOT rewrite or paraphrase these recent posts:\n${recentTitles.map((t) => `- ${t}`).join("\n")}`
      : "";
  const differBlock = mustDifferFrom
    ? `\nYour title must NOT reuse the same topic as: "${mustDifferFrom}".`
    : "";

  const system = `You are ${author}, a senior consultant at MaatriDev Technologies (India). Write one blog article that reads human-written: opinionated, specific, occasionally informal.

STRICT RULES:
- Never use: ${BANNED_PHRASES.join(", ")}
- Flowing paragraphs with 3-4 <h2> sections (not only bullets)
- ONE anecdote ("Last quarter we…", "A client in Mumbai…")
- 850–1100 words in bodyHtml
- Exactly 2 links to main pages: <a href="/services"> (or a service subpath) and <a href="/contact">
- Plus 1-2 internal links to related blog posts when relevant:${recentPostsForLinks.length ? `\n${recentPostsForLinks.map((p) => `  - /blog/${p.slug} (${p.title})`).join("\n")}` : " (none yet)"}
- 1-2 external links (MDN, official docs, etc.) with rel="noopener" target="_blank"
- HTML only: p, h2, h3, ul, li, strong, em, a, blockquote — no h1
- JSON keys: title, excerpt, metaTitle, metaDescription, category, tags (3 strings), bodyHtml, imageAlt

Topic angle: ${topic.angle}
Category: ${topic.category}${avoidBlock}${differBlock}`;

  return openAiJson({
    apiKey,
    model,
    system,
    user: "Write today's article. metaTitle under 60 chars, metaDescription 140-160 chars.",
    temperature: 0.88,
  });
}

export async function generateDailyBlog(options = {}) {
  const apiKey = (options.apiKey || process.env.OPENAI_API_KEY || "").trim();
  const model = (options.model || process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
  const force = Boolean(options.force);
  const today = new Date().toISOString().slice(0, 10);

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env on the server (never commit the key).");
  }

  if (!force && hasPostForDate(today)) {
    return { skipped: true, reason: "already_generated_today", date: today };
  }

  const existing = listBlogPosts();
  const recentTitles = existing.slice(0, 12).map((p) => p.title);
  const triedKeys = new Set();
  let topic = null;
  let parsed = null;
  const author = pickAuthor(existing);
  const maxAttempts = 4;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    topic = await planTopic({ apiKey, model, existing, skipKeys: triedKeys, force });
    triedKeys.add(topicKeyFromAngle(topic.angle));

    parsed = await writeArticleWithAI({
      apiKey,
      model,
      topic,
      author,
      recentTitles,
      recentPostsForLinks: existing.slice(0, 5).map((p) => ({ slug: p.slug, title: p.title })),
      mustDifferFrom: force && existing[0]?.title ? existing[0].title : "",
    });

    const title = String(parsed.title || topic.angle).trim();
    if (!isTooSimilarToRecent(title, existing)) break;

    if (attempt === maxAttempts - 1) {
      throw new Error(
        "Generated title too similar to a recent post after several tries. Run again.",
      );
    }
  }

  const category = CATEGORIES.includes(parsed.category) ? parsed.category : topic.category;
  let slug = slugify(parsed.title || topic.angle);
  if (existing.some((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  let bodyHtml = sanitizeBlogHtml(parsed.bodyHtml || "");
  bodyHtml = enrichBodyWithRelatedPosts(bodyHtml, { slug, category }, existing);
  const excerpt = String(parsed.excerpt || "").trim();
  const title = String(parsed.title || topic.angle).trim();
  const tags = [...new Set([...(parsed.tags || []), category].filter(Boolean))].slice(0, 4);

  const image = await fetchBlogHeroImage({
    searchQuery: topic.imageSearchQuery,
    slug,
    recentPosts: existing,
  });

  const post = addBlogPost({
    slug,
    title,
    excerpt,
    metaTitle: String(parsed.metaTitle || `${title} | MaatriDev Blog`).slice(0, 70),
    metaDescription: String(parsed.metaDescription || excerpt).slice(0, 165),
    category,
    tags,
    author,
    datePublished: today,
    date: formatDisplayDate(today),
    image,
    imageAlt: parsed.imageAlt || topic.imageAlt,
    bodyHtml,
    generated: true,
    topicKey: topicKeyFromAngle(topic.angle),
    imageSearchQuery: topic.imageSearchQuery,
  });

  const imageSource = !image
    ? "none"
    : image.includes("unsplash")
      ? "unsplash"
      : image.includes("pexels")
        ? "pexels"
        : "picsum";

  return { ok: true, post, topicAngle: topic.angle, imageSource };
}
