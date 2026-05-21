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

  const homeBtn = page.locator(".site-header__home-toggle");
  await assert.ok(await homeBtn.isVisible(), "Home row visible");
  await assert.ok(!(await page.locator(".site-header__home-links").isVisible()), "Links hidden before tap");

  await homeBtn.click();
  await assert.ok(await page.locator(".site-header__home-links").isVisible());
  await assert.ok(await page.getByRole("button", { name: "Home" }).isVisible(), "Home row stays visible when submenu open");
  await assert.ok(await page.locator("text=IT Solutions (Default)").isVisible());
  await assert.ok(await homeBtn.isVisible(), "Home row stays visible when submenu open");

  const boxHome = await homeBtn.boundingBox();
  const boxFirst = await page.locator(".site-header__home-links >> text=IT Solutions (Default)").boundingBox();
  const boxWeb = await page.locator(".site-header__home-links >> text=Web Agency").boundingBox();
  assert.ok(boxHome && boxFirst && boxFirst.y >= boxHome.y + boxHome.height - 2, "Submenu opens downward");
  assert.ok(
    boxHome && boxWeb && boxWeb.y >= boxHome.y + boxHome.height - 2,
    "Web Agency must not overlap Home row",
  );

  const noOverlap = await page.evaluate(() => {
    const toggle = document.querySelector(".site-header__home-toggle");
    const link = document.querySelector(".site-header__home-links button, .site-header__home-links a");
    if (!toggle || !link) return false;
    const t = toggle.getBoundingClientRect();
    const f = link.getBoundingClientRect();
    return f.top >= t.bottom - 1;
  });
  await assert.ok(noOverlap, "Home label must not overlap first agency link");

  await page.goto(`${base}/projects`, { waitUntil: "networkidle", timeout: 30000 });
  await page.goto(`${base}/services`, { waitUntil: "networkidle", timeout: 30000 });
  await page.locator(".site-header__toggle").click();
  const servicesActiveMenu = page.locator(".site-header__nav.is-open >> a.site-header__link.active", {
    hasText: "Services",
  });
  await assert.equal(await servicesActiveMenu.count(), 0, "Services not teal-highlighted when drawer open (step 2)");

  await page.locator(".site-header__home-toggle").click();
  const homeToggle = page.locator(".site-header__home-toggle");
  await assert.ok(await homeToggle.isVisible(), "Home row visible when expanded (step 3)");
  const homeInDrawer = await page.evaluate(() => {
    const nav = document.querySelector(".site-header__nav.is-open");
    const toggle = document.querySelector(".site-header__home-toggle");
    if (!nav || !toggle) return false;
    const n = nav.getBoundingClientRect();
    const t = toggle.getBoundingClientRect();
    return t.height > 0 && t.top >= n.top - 2 && t.top < n.bottom;
  });
  await assert.ok(homeInDrawer, "Home row stays in drawer viewport (not scrolled away)");
  const servicesActiveHomeOpen = page.locator(".site-header__nav.is-open >> a.site-header__link.active", {
    hasText: "Services",
  });
  await assert.equal(await servicesActiveHomeOpen.count(), 0, "Services not highlighted when Home open");

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
