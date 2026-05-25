import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seoDataDir, readJson, writeJson, initSeoEnv } from "./config.mjs";
import { seoLog } from "./logger.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED = path.join(__dirname, "keywords.seed.json");

export function ensureKeywordPlan() {
  initSeoEnv();
  const target = path.join(seoDataDir(), "keywords.json");
  if (!fs.existsSync(target)) {
    fs.copyFileSync(SEED, target);
    seoLog(`Initialized keywords.json from seed (${target})`);
  }
  return readJson(target, { targets: [] });
}

/**
 * Weekly: suggest 3 new long-tail keywords via OpenAI (optional).
 */
export async function expandKeywordsWithAI() {
  initSeoEnv();
  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  const plan = ensureKeywordPlan();
  if (!apiKey) {
    seoLog("OPENAI_API_KEY missing — keyword expansion skipped");
    return plan;
  }

  const existing = plan.targets.map((t) => t.keyword).join(", ");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an SEO strategist for MaatriDev Technologies (India): software, AI, cloud, web, consulting. Return JSON: { suggestions: [{ keyword, intent, priority, landingPage, competition }] } with exactly 3 NEW long-tail keywords not in the existing list. Focus quick-win informational + commercial local intent.",
        },
        {
          role: "user",
          content: `Existing keywords: ${existing || "none"}. Site: maatridev.com`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
  const add = parsed.suggestions || [];
  const known = new Set(plan.targets.map((t) => t.keyword.toLowerCase()));
  for (const s of add) {
    if (!s.keyword || known.has(s.keyword.toLowerCase())) continue;
    plan.targets.push({ ...s, addedAt: new Date().toISOString().slice(0, 10) });
    known.add(s.keyword.toLowerCase());
  }
  plan.updatedAt = new Date().toISOString().slice(0, 10);
  writeJson(path.join(seoDataDir(), "keywords.json"), plan);
  seoLog(`Keyword plan: +${add.length} suggestions (total ${plan.targets.length})`);
  return plan;
}
