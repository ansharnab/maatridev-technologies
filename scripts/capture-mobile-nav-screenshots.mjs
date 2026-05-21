/**
 * Capture mobile nav UI states for visual review.
 * Run: node scripts/capture-mobile-nav-screenshots.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "assets", "nav-test-screenshots");

const PORTS = [5173, 5174, 5175, 5176];
let base = null;
for (const port of PORTS) {
  try {
    const res = await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      base = `http://localhost:${port}`;
      break;
    }
  } catch {
    /* next */
  }
}
if (!base) {
  console.error("Start dev server: npm run dev");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch {
  browser = await chromium.launch({ channel: "chrome", headless: true });
}

const viewports = [
  { name: "live-services", url: `${base}/services`, editor: false },
  { name: "live-home-variant", url: `${base}/home/digital-agency`, editor: false },
];

async function capture(page, file, label) {
  const p = path.join(OUT, file);
  await page.screenshot({ path: p, fullPage: false });
  const metrics = await page.evaluate(() => {
    const toggle = document.querySelector(".site-header__home-toggle");
    const links = document.querySelector(".site-header__home-links");
    const nav = document.querySelector(".site-header__nav.is-open");
    const body = document.querySelector(".site-header__nav-body");
    const firstLink = document.querySelector(".site-header__home-links button, .site-header__home-links a");
    const svc = [...document.querySelectorAll(".site-header__nav-body .site-header__link, .site-header__nav-body button.site-header__link")].find(
      (el) => el.textContent?.trim() === "Services",
    );
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height), visible: r.height > 0 && r.width > 0 };
    };
    const t = rect(toggle);
    const f = rect(firstLink);
    return {
      navOpen: Boolean(nav),
      homeExpanded: links && !links.hidden,
      homeToggle: t,
      firstAgencyLink: f ? { ...f, label: firstLink?.textContent?.trim() } : null,
      noOverlap: t && f ? f.top >= t.bottom - 2 : null,
      homeInNavViewport:
        t && nav
          ? t.top >= nav.getBoundingClientRect().top - 2 && t.top < nav.getBoundingClientRect().bottom
          : null,
      servicesActive: svc?.classList.contains("active") ?? null,
      navScrollTop: nav?.scrollTop ?? null,
      bodyScrollTop: body?.scrollTop ?? null,
      itSolutionsVisible: Boolean(
        [...(links?.querySelectorAll("button, a") ?? [])].some((el) =>
          el.textContent?.includes("IT Solutions"),
        ),
      ),
    };
  });
  console.log(`[${label}]`, JSON.stringify(metrics, null, 2));
  return { path: p, metrics };
}

const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const report = [];

try {
  for (const { name, url } of viewports) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    await page.locator(".site-header__toggle").click();
    report.push(await capture(page, `${name}-01-menu-open.png`, `${name} menu open`));

    const homeBtn = page.locator(".site-header__home-toggle");
    await assertVisible(homeBtn, "Home toggle when menu open");
    report.push(await capture(page, `${name}-02-before-home-click.png`, `${name} before Home click`));

    await homeBtn.click();
    report.push(await capture(page, `${name}-03-home-expanded.png`, `${name} Home expanded`));

    await homeBtn.click();
    report.push(await capture(page, `${name}-04-home-collapsed.png`, `${name} Home collapsed`));
  }

  // Editor-style classes on services (builder preview simulation)
  await page.goto(`${base}/services`, { waitUntil: "networkidle", timeout: 30000 });
  await page.evaluate(() => {
    document.querySelector(".site-header")?.classList.add(
      "site-header--editor-preview",
      "site-header--editor-mobile",
    );
  });
  await page.locator(".site-header__toggle").click();
  await page.locator(".site-header__home-toggle").click();
  report.push(await capture(page, "editor-sim-03-home-expanded.png", "editor sim Home expanded"));

  const summaryPath = path.join(OUT, "analysis.json");
  fs.writeFileSync(summaryPath, JSON.stringify(report, null, 2));
  console.log(`\nScreenshots: ${OUT}`);
  console.log(`Analysis: ${summaryPath}`);
} catch (err) {
  console.error("FAIL:", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}

function assertVisible(locator, msg) {
  return locator.isVisible().then((ok) => {
    if (!ok) throw new Error(msg);
  });
}
