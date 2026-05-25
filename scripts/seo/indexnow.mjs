import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PROJECT_ROOT, getSiteUrl, initSeoEnv } from "./config.mjs";
import { seoLog } from "./logger.mjs";

const KEY_FILE_NAME = (key) => `${key}.txt`;

/**
 * Ensure IndexNow key file exists in public/ for domain verification.
 */
export function ensureIndexNowKeyFile(key) {
  const publicDir = path.join(PROJECT_ROOT, "public");
  const filePath = path.join(publicDir, KEY_FILE_NAME(key));
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, key);
    seoLog(`Created IndexNow key file: public/${KEY_FILE_NAME(key)}`);
  }
  return filePath;
}

export function getIndexNowKey() {
  let key = (process.env.INDEXNOW_KEY || "").trim();
  if (!key) {
    key = crypto.randomBytes(16).toString("hex");
    seoLog(`Generated INDEXNOW_KEY (add to .env): ${key}`);
  }
  ensureIndexNowKeyFile(key);
  return key;
}

/**
 * Notify Bing/Yandex/etc. of new/updated URLs (white-hat indexing signal).
 */
export async function submitIndexNow(urls = []) {
  initSeoEnv();
  const list = [...new Set(urls.filter(Boolean))];
  if (!list.length) return { submitted: 0, skipped: true };

  const host = new URL(getSiteUrl()).hostname;
  const key = getIndexNowKey();
  const keyLocation = `${getSiteUrl()}/${KEY_FILE_NAME(key)}`;

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList: list,
    }),
  });

  const ok = res.ok || res.status === 202;
  if (!ok) {
    const text = await res.text();
    throw new Error(`IndexNow ${res.status}: ${text.slice(0, 200)}`);
  }
  seoLog(`IndexNow submitted ${list.length} URL(s)`);
  return { submitted: list.length, ok: true };
}
