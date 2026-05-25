import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnvFile } from "../load-env.js";
import { PROJECT_ROOT, getSiteUrl } from "../../server/seo/sitemap.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function initSeoEnv() {
  loadEnvFile(path.join(PROJECT_ROOT, ".env"));
  return process.env;
}

export function seoDataDir() {
  const dir = path.join(PROJECT_ROOT, "server/data/seo");
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, "logs"), { recursive: true });
  fs.mkdirSync(path.join(dir, "reports"), { recursive: true });
  return dir;
}

export function seoStatePath() {
  return path.join(seoDataDir(), "state.json");
}

export function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export { PROJECT_ROOT, getSiteUrl };
