import express from "express";
import cors from "cors";
import crypto from "crypto";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const BRAND_DEFAULTS = {
  siteName: "MaatriDev Technologies",
  logoText: "MaatriDev",
  logoImage: "/logo-maatridev.svg",
  logoImageOnDark: "/logo-maatridev-hero.svg",
  logoLetter: "M",
  logoAnimation: "gradient",
  logoColorPrimary: "#007cc3",
  logoColorAccent: "#00b8a9",
  headerDesign: "glass",
  headerSize: "default",
  headerBarBackground: "rgba(10, 22, 40, 0.55)",
  headerBarOverHero: "rgba(10, 22, 40, 0.55)",
  headerCtaLabel: "Book Appointment",
  headerCtaBg: "#007cc3",
  headerCtaColor: "#ffffff",
};

function normalizeBrandSettings(settings = {}) {
  const s = { ...BRAND_DEFAULTS, ...settings };
  const blob = `${s.logoText || ""} ${s.siteName || ""}`.toLowerCase();
  if (blob.includes("saumya")) {
    return { ...s, ...BRAND_DEFAULTS };
  }
  if (!String(s.logoImage || "").trim()) {
    s.logoImage = BRAND_DEFAULTS.logoImage;
    s.logoImageOnDark = BRAND_DEFAULTS.logoImageOnDark;
  }
  const custom = String(s.logoImage || "").trim() && !s.logoImage.includes("logo-maatridev");
  if (custom && (!String(s.logoImageOnDark || "").trim() || s.logoImageOnDark.includes("logo-maatridev-hero"))) {
    s.logoImageOnDark = s.logoImage;
  }
  return s;
}

function sanitizePages(pages = {}) {
  if (!pages || typeof pages !== "object") return {};
  const out = {};
  for (const [pageId, page] of Object.entries(pages)) {
    /* Home is always the built-in React homepage — never replace with empty CMS output */
    if (pageId === "home") continue;
    if (!page || typeof page !== "object") continue;
    const next = { ...page };
    const sec = next.sections;
    if (sec?.enabled && !(sec.items?.length > 0)) {
      delete next.sections;
    }
    const puck = next.puck;
    if (puck?.enabled && !(puck.data?.content?.length > 0)) {
      delete next.puck;
    }
    const w = next.wysiwyg;
    const wText = w?.html ? w.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
    if (w?.enabled && wText.length < 24) {
      delete next.wysiwyg;
    }
    if (Object.keys(next).length > 0) out[pageId] = next;
  }
  return out;
}

function normalizeContent(content) {
  const base = content && typeof content === "object" ? content : { pages: {}, settings: {} };
  return {
    ...base,
    pages: sanitizePages(base.pages),
    settings: normalizeBrandSettings(base.settings),
  };
}

function repairContentFile() {
  const raw = readJson(CONTENT_FILE, { pages: {}, settings: {} });
  const fixed = normalizeContent(raw);
  const before = JSON.stringify(raw.settings || {});
  const after = JSON.stringify(fixed.settings || {});
  if (before !== after) {
    writeJson(CONTENT_FILE, fixed);
    console.log("Repaired branding in content.json (MaatriDev logo restored).");
  }
}
const MEDIA_DIR = path.join(DATA_DIR, "media");
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");
const CONTACT_FILE = path.join(DATA_DIR, "contacts.json");

const ENV_FILE = path.join(__dirname, "..", ".env");

function loadEnvFile() {
  if (!fs.existsSync(ENV_FILE)) return {};
  const text = fs.readFileSync(ENV_FILE, "utf8").replace(/^\uFEFF/, "");
  const fromFile = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fromFile[key] = val.replace(/\uFEFF/g, "").trim();
  }
  /* .env file always wins for admin password (avoids stale shell ADMIN_PASSWORD) */
  if (fromFile.ADMIN_PASSWORD) {
    process.env.ADMIN_PASSWORD = fromFile.ADMIN_PASSWORD;
  }
  for (const [key, val] of Object.entries(fromFile)) {
    if (key === "ADMIN_PASSWORD") continue;
    if (!process.env[key]) process.env[key] = val;
  }
  return fromFile;
}

const envFromFile = loadEnvFile();

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "").trim();
if (!ADMIN_PASSWORD) {
  console.error("ADMIN_PASSWORD is required. Copy .env.example to .env and set ADMIN_PASSWORD.");
  process.exit(1);
}

[DATA_DIR, MEDIA_DIR, UPLOADS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

if (!fs.existsSync(CONTENT_FILE)) {
  writeJson(CONTENT_FILE, { pages: {}, settings: {} });
}
if (!fs.existsSync(CONTACT_FILE)) {
  writeJson(CONTACT_FILE, []);
}

repairContentFile();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuid().slice(0, 8)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = /\.(jpe?g|png|gif|webp|svg|mp4|webm|pdf)$/i;
    cb(null, allowed.test(file.originalname));
  },
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(UPLOADS_DIR));

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/health", (_, res) => {
  res.json({ ok: true, service: "maatridev-api" });
});

/** Helps login UI when password mismatches (length only — never the secret). */
app.get("/api/auth/status", (_, res) => {
  res.json({
    ok: true,
    passwordSource: envFromFile.ADMIN_PASSWORD ? "env-file" : "default",
    passwordLength: ADMIN_PASSWORD.length,
    envFilePresent: fs.existsSync(ENV_FILE),
  });
});

app.post("/api/auth/login", (req, res) => {
  const password = normalizePassword(req.body?.password);
  if (password && passwordsMatch(password)) {
    return res.json({ token: ADMIN_PASSWORD, ok: true });
  }
  res.status(401).json({
    error: "Invalid password",
    hint:
      envFromFile.ADMIN_PASSWORD || fs.existsSync(ENV_FILE)
        ? "Password must match ADMIN_PASSWORD in website/.env — restart npm run dev after editing."
        : "Default is maatridev2026 — set ADMIN_PASSWORD in website/.env if you changed it.",
    expectedLength: ADMIN_PASSWORD.length,
  });
});

app.get("/api/content", (_, res) => {
  res.json(normalizeContent(readJson(CONTENT_FILE, { pages: {}, settings: {} })));
});

function mergeContent(existing, incoming) {
  const base = existing && typeof existing === "object" ? existing : { pages: {}, settings: {}, site: {} };
  const body = incoming && typeof incoming === "object" ? incoming : {};
  return {
    pages: body.pages ? { ...base.pages, ...body.pages } : base.pages,
    settings: body.settings ? { ...base.settings, ...body.settings } : base.settings,
    site: body.site
      ? {
          founders: body.site.founders ?? base.site?.founders,
          services: body.site.services ?? base.site?.services,
        }
      : base.site,
  };
}

app.put("/api/content", requireAuth, (req, res) => {
  const existing = readJson(CONTENT_FILE, { pages: {}, settings: {}, site: {} });
  const merged = normalizeContent(mergeContent(existing, req.body));
  writeJson(CONTENT_FILE, merged);
  res.json({ ok: true, content: merged });
});

app.get("/api/media", (_, res) => {
  const files = fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR) : [];
  res.json(
    files.map((name) => ({
      id: name,
      name,
      url: `/uploads/${name}`,
      type: /\.(mp4|webm)$/i.test(name) ? "video" : "image",
    }))
  );
});

app.post("/api/media/upload", requireAuth, upload.array("files", 20), (req, res) => {
  const items = (req.files || []).map((f) => ({
    id: f.filename,
    name: f.originalname,
    url: `/uploads/${f.filename}`,
    type: /\.(mp4|webm)$/i.test(f.filename) ? "video" : "image",
  }));
  res.json({ items });
});

app.delete("/api/media/:id", requireAuth, (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.id);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  res.json({ ok: true });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  const contacts = readJson(CONTACT_FILE, []);
  const entry = {
    id: uuid(),
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || "",
    subject: subject?.trim() || "General Inquiry",
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  contacts.unshift(entry);
  writeJson(CONTACT_FILE, contacts);
  res.json({ ok: true, message: "Thank you! We will respond within 24 hours." });
});

app.get("/api/contact", requireAuth, (_, res) => {
  res.json(readJson(CONTACT_FILE, []));
});

const DIST_DIR = path.join(__dirname, "..", "dist");
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  const source = envFromFile.ADMIN_PASSWORD ? ".env file" : "default";
  console.log(`MaatriDev API running on http://localhost:${PORT}`);
  console.log(`Admin password loaded from ${source} (${ADMIN_PASSWORD.length} characters)`);
  if (fs.existsSync(DIST_DIR)) console.log("Serving production build from /dist");
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use — an OLD API may be running with a different password.`,
    );
    console.error(`Run: npm run free-port   then: npm run dev\n`);
    process.exit(1);
  }
  throw err;
});
