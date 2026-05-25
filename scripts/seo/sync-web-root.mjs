import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { PROJECT_ROOT, initSeoEnv } from "./config.mjs";
import { seoLog } from "./logger.mjs";

/**
 * Publish dist/ + IndexNow key to nginx web root (EC2).
 * Requires passwordless sudo — run once: bash deploy/setup-publish-sudo.sh
 */
export function syncWebRoot() {
  initSeoEnv();
  const webRoot = (process.env.SEO_PUBLISH_WEB_ROOT || "/var/www/maatridev").trim();
  const dist = path.join(PROJECT_ROOT, "dist");

  if (!fs.existsSync(dist)) {
    seoLog("sync-web-root: no dist/ — run npm run build on server after .env changes");
    return { ok: false, skipped: true, reason: "no_dist" };
  }

  if (!fs.existsSync(webRoot)) {
    seoLog(`sync-web-root: ${webRoot} does not exist — skip`);
    return { ok: false, skipped: true, reason: "no_web_root" };
  }

  try {
    execSync(`sudo rsync -a "${dist}/" "${webRoot}/"`, { stdio: "pipe" });
    const key = (process.env.INDEXNOW_KEY || "").trim();
    if (key) {
      const keyFile = path.join(PROJECT_ROOT, "public", `${key}.txt`);
      if (fs.existsSync(keyFile)) {
        execSync(`sudo cp -f "${keyFile}" "${webRoot}/"`, { stdio: "pipe" });
      }
    }
    seoLog(`Published dist → ${webRoot}`);
    return { ok: true, webRoot };
  } catch (err) {
    seoLog(
      `sync-web-root failed: ${err.message}. On EC2 run: bash deploy/setup-publish-sudo.sh`,
    );
    return { ok: false, skipped: true, error: err.message };
  }
}
