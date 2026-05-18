/**
 * Push site settings (logo, etc.) to live API.
 * Run: node scripts/push-live-content.js
 * Set LIVE_URL and ADMIN_PASSWORD env vars or edit below.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIVE_URL = (process.env.LIVE_URL || "http://13.126.237.163").replace(/\/$/, "");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "maatridev2026";
const CONTENT_FILE = path.join(__dirname, "..", "server", "data", "content.json");

const local = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));

const getRes = await fetch(`${LIVE_URL}/api/content`);
if (!getRes.ok) throw new Error(`GET content failed: ${getRes.status}`);
const remote = await getRes.json();

const merged = {
  pages: { ...remote.pages, ...local.pages },
  settings: {
    ...remote.settings,
    ...local.settings,
    logoScale: local.settings?.logoScale ?? 1,
    logoClipWidth: local.settings?.logoClipWidth ?? 280,
  },
  site: local.site ? { ...remote.site, ...local.site } : remote.site,
};

const putRes = await fetch(`${LIVE_URL}/api/content`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_PASSWORD}`,
  },
  body: JSON.stringify(merged),
});

if (!putRes.ok) {
  const text = await putRes.text();
  throw new Error(`PUT content failed: ${putRes.status} ${text}`);
}

const out = await putRes.json();
console.log("Live content updated.");
console.log("logoImage:", out.content?.settings?.logoImage ?? merged.settings?.logoImage);
