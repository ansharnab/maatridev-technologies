/**
 * Browser test: mobile Home opens links below Home row (not orphaned at top).
 * Run: node scripts/test-mobile-home-menu.mjs
 * Requires: npm run dev (Vite) on port 5173–5176
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";

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
    /* try next port */
  }
}

if (!base) {
  console.error("✗ Start dev server first: npm run dev");
  process.exit(1);
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch {
  browser = await chromium.launch({ channel: "chrome", headless: true });
}
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  await page.goto(`${base}/home/digital-agency`, { waitUntil: "networkidle", timeout: 30000 });
  await page.locator(".site-header__toggle").click();

  const homeHeading = page.locator(".site-header__home-heading");
  await assert.ok(await homeHeading.isVisible(), "Home heading visible in drawer");
  await assert.equal(await homeHeading.textContent(), "Home");

  const homeLinks = page.locator(".site-header__home-links");
  await assert.ok(await homeLinks.isVisible(), "Home agency links always visible");
  await assert.ok(await page.locator(".site-header__home-links >> text=IT Solutions (Default)").isVisible());
  await assert.ok(await page.locator(".site-header__home-links >> text=Web Agency").isVisible());
  await assert.ok(await page.locator(".site-header__home-links >> text=Digital Agency").isVisible());

  const boxHome = await homeHeading.boundingBox();
  const boxFirst = await page.locator(".site-header__home-links >> text=IT Solutions (Default)").boundingBox();
  const boxAbout = await page.locator(".site-header__nav >> text=About").boundingBox();
  assert.ok(boxHome && boxFirst && boxAbout, "bounding boxes");
  assert.ok(boxFirst.y > boxHome.y, "Agency links below Home heading");
  assert.ok(boxAbout.y > boxFirst.y, "About below Home section");

  await page.locator(".site-header__nav >> text=Services").click();
  await page.waitForURL(/\/services\/?$/);
  assert.match(page.url(), /\/services\/?$/, "Services goes to /services");

  console.log(`✓ Mobile Home accordion OK on ${base}`);
} catch (err) {
  console.error("✗", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
