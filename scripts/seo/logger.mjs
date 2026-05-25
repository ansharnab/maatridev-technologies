import fs from "fs";
import path from "path";
import { seoDataDir } from "./config.mjs";

export function seoLog(message, level = "info") {
  const dir = path.join(seoDataDir(), "logs");
  const day = new Date().toISOString().slice(0, 10);
  const file = path.join(dir, `seo-${day}.log`);
  const line = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  fs.appendFileSync(file, line);
  if (level === "error") console.error(message);
  else console.log(message);
}
