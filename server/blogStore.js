import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { slugify } from "./slugify.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const BLOGS_FILE = path.join(__dirname, "data", "blogs.json");

const SEED_POSTS = [
  {
    id: 1,
    slug: "scaling-llms-enterprise-data-pipelines",
    title: "Scaling LLMs for Enterprise Data Pipelines",
    excerpt: "How MaatriDev optimizes large language models for secure, high-volume business data.",
    metaTitle: "Scaling LLMs for Enterprise Data Pipelines | MaatriDev Blog",
    metaDescription:
      "How MaatriDev optimizes large language models for secure, high-volume enterprise data pipelines.",
    date: "May 10, 2026",
    datePublished: "2026-05-10",
    author: "Akshansh Arnab",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop",
    imageAlt: "AI and machine learning infrastructure for enterprise data",
    category: "AI",
    bodyHtml:
      "<p>Enterprise teams rarely struggle with whether to use LLMs — they struggle with running them safely at scale on real data pipelines.</p><p>We've shipped RAG stacks for healthcare and fintech clients where latency, audit trails, and PII boundaries matter more than benchmark scores. If you're wiring models into existing ETL, start with a narrow workflow (support triage, document classification) before you open the floodgates on production databases.</p><p>Need help designing that path? See our <a href=\"/services/ai\">AI &amp; ML services</a> or <a href=\"/contact\">book a call</a>.</p>",
  },
  {
    id: 2,
    slug: "digital-transformation-2026",
    title: "Digital Transformation in 2026",
    excerpt: "A practical roadmap for CIOs balancing cloud, AI, and legacy modernization.",
    metaTitle: "Digital Transformation in 2026 | MaatriDev Blog",
    metaDescription: "A practical roadmap for CIOs balancing cloud, AI, and legacy modernization.",
    date: "Apr 28, 2026",
    datePublished: "2026-04-28",
    author: "Swetav Savarn",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop",
    imageAlt: "Team planning digital transformation strategy",
    category: "Consulting",
    bodyHtml:
      "<p>Transformation programmes fail when they're treated as a single \"big bang\" ERP swap instead of a sequence of measurable bets.</p><p>In 2026 we're seeing Indian mid-market firms prioritize integration layers first — APIs, identity, observability — so AI pilots don't sit on brittle legacy glue code.</p><p>Explore <a href=\"/services/integration\">systems integration</a> or read more on our <a href=\"/blog\">blog</a>.</p>",
  },
  {
    id: 3,
    slug: "building-crm-teams-actually-use",
    title: "Building CRM That Teams Actually Use",
    excerpt: "UX-first CRM design principles from our enterprise delivery playbook.",
    metaTitle: "Building CRM Teams Actually Use | MaatriDev Blog",
    metaDescription: "UX-first CRM design principles from our enterprise delivery playbook.",
    date: "Apr 15, 2026",
    datePublished: "2026-04-15",
    author: "MaatriDev Team",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=630&fit=crop",
    imageAlt: "CRM software dashboard on laptop",
    category: "Software",
    bodyHtml:
      "<p>Sales teams abandon CRMs when every click feels like data entry for someone else's dashboard.</p><p>We reduce fields to what reps update daily, automate the rest from email and telephony, and design mobile-first flows for field staff. Adoption jumps when the CRM sends value back — next-best action, not just reports.</p><p>Custom CRM delivery: <a href=\"/services/software\">software development</a>.</p>",
  },
];

export function normalizePost(post, index = 0) {
  const title = post.title || "Untitled";
  const slug = (post.slug || slugify(title)).trim() || `post-${post.id || index + 1}`;
  const datePublished = post.datePublished || new Date().toISOString().slice(0, 10);
  const d = new Date(datePublished);
  const date =
    post.date ||
    d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  return {
    id: post.id ?? index + 1,
    slug,
    title,
    excerpt: post.excerpt || "",
    metaTitle: post.metaTitle || `${title} | MaatriDev Blog`,
    metaDescription: post.metaDescription || post.excerpt || "",
    date,
    datePublished,
    author: post.author || "MaatriDev Team",
    image: post.image || SEED_POSTS[0].image,
    imageAlt: post.imageAlt || title,
    category: post.category || "Technology",
    tags: Array.isArray(post.tags) ? post.tags : [],
    bodyHtml: post.bodyHtml || `<p>${post.excerpt || ""}</p>`,
    generated: Boolean(post.generated),
    topicKey: post.topicKey || "",
    imageSearchQuery: post.imageSearchQuery || "",
    readingMinutes: post.readingMinutes || estimateReadingMinutes(post.bodyHtml),
  };
}

function estimateReadingMinutes(html = "") {
  const text = String(html).replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200));
}

function readRaw() {
  if (!fs.existsSync(BLOGS_FILE)) {
    const initial = { posts: SEED_POSTS.map((p, i) => normalizePost(p, i)) };
    fs.mkdirSync(path.dirname(BLOGS_FILE), { recursive: true });
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(BLOGS_FILE, "utf8"));
  } catch {
    return { posts: [] };
  }
}

function writeRaw(data) {
  fs.mkdirSync(path.dirname(BLOGS_FILE), { recursive: true });
  fs.writeFileSync(BLOGS_FILE, JSON.stringify(data, null, 2));
}

export function listBlogPosts() {
  const raw = readRaw();
  const posts = (raw.posts || []).map((p, i) => normalizePost(p, i));
  posts.sort((a, b) => String(b.datePublished).localeCompare(String(a.datePublished)));
  return posts.map((p, i) => ({ ...p, id: p.id ?? i + 1 }));
}

export function hasPostForDate(isoDate) {
  const day = isoDate.slice(0, 10);
  return listBlogPosts().some((p) => String(p.datePublished).slice(0, 10) === day);
}

export function addBlogPost(post) {
  const raw = readRaw();
  const posts = raw.posts || [];
  const nextId = posts.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
  const normalized = normalizePost({ ...post, id: nextId }, posts.length);
  posts.unshift(normalized);
  const capped = posts.slice(0, 400);
  writeRaw({ posts: capped });
  return normalized;
}

export function updateBlogPost(slug, patch) {
  const raw = readRaw();
  const posts = raw.posts || [];
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;
  posts[idx] = normalizePost({ ...posts[idx], ...patch }, idx);
  writeRaw({ posts });
  return posts[idx];
}

export function getBlogSlugs() {
  return listBlogPosts().map((p) => p.slug).filter(Boolean);
}
