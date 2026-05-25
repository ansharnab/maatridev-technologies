import path from "path";
import { seoDataDir, writeJson, initSeoEnv, getSiteUrl } from "./config.mjs";
import { seoLog } from "./logger.mjs";

/**
 * White-hat only: curated outreach opportunities (no auto-spam submissions).
 */
export function generateBacklinkReport() {
  initSeoEnv();
  const site = getSiteUrl();

  const opportunities = [
    {
      type: "directory",
      name: "Clutch.co",
      action: "Create company profile with services + case studies",
      impact: "high",
      effort: "medium",
    },
    {
      type: "directory",
      name: "GoodFirms",
      action: "List MaatriDev under software development India",
      impact: "medium",
      effort: "low",
    },
    {
      type: "directory",
      name: "Google Business Profile",
      action: "Verify business + link to website + weekly posts",
      impact: "high",
      effort: "low",
    },
    {
      type: "guest_post",
      name: "Dev.to / Hashnode",
      action: "Republish technical blog excerpts with canonical to maatridev.com",
      impact: "medium",
      effort: "low",
    },
    {
      type: "guest_post",
      name: "Medium (MaatriDev publication)",
      action: "Cross-post AI/cloud articles with canonical link",
      impact: "medium",
      effort: "low",
    },
    {
      type: "citation",
      name: "LinkedIn company page",
      action: "Add website + link blog posts weekly",
      impact: "medium",
      effort: "low",
    },
    {
      type: "partnership",
      name: "Client case study pages",
      action: "Ask 2 clients for testimonial page linking to /projects",
      impact: "high",
      effort: "high",
    },
  ];

  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: site,
    note: "Manual outreach only — never automate directory spam or paid link farms.",
    thisWeek: opportunities.slice(0, 3),
    backlog: opportunities.slice(3),
  };

  const out = path.join(seoDataDir(), "reports", `backlinks-${report.generatedAt.slice(0, 10)}.json`);
  writeJson(out, report);
  writeJson(path.join(seoDataDir(), "backlinks-latest.json"), report);
  seoLog(`Backlink report: ${report.thisWeek.length} actions for this week → ${out}`);
  return report;
}
