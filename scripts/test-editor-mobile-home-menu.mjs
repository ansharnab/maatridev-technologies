/**
 * Page builder mobile preview — Home row must not overlap agency links.
 * Run: node scripts/test-editor-mobile-home-menu.mjs
 * Requires: npm run dev + admin token in .env or login flow skipped via DOM mount
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
    /* try next */
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
  await page.goto(`${base}/services`, { waitUntil: "networkidle", timeout: 30000 });

  await page.evaluate(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    header.classList.add("site-header--editor-preview", "site-header--editor-mobile");
    const wrap = header.closest(".ve-chrome-block") || header.parentElement;
    if (wrap) {
      wrap.classList.add("ve-chrome-block", "ve-chrome-block--ctx-pageHero");
      const bar = document.createElement("div");
      bar.className = "ve-chrome-block__bar";
      bar.innerHTML = '<span class="ve-block__label">Page header (custom)</span>';
      wrap.prepend(bar);
    }
  });

  await page.locator(".site-header__toggle").click();

  const bar = page.locator(".ve-chrome-block__bar");
  await assert.ok((await bar.count()) === 0 || !(await bar.isVisible()), "Hint bar hidden when menu open");

  const svcActive = page.locator(
    ".site-header__nav-body >> button.site-header__link.active",
    { hasText: "Services" },
  );
  await assert.equal(await svcActive.count(), 0, "No Services highlight in editor drawer (step 2)");

  const homeToggle = page.locator(".site-header__home-toggle");
  await homeToggle.click();
  await assert.ok(await homeToggle.isVisible(), "Home row visible when expanded (step 3)");
  await assert.ok(await page.getByRole("button", { name: "Home" }).isVisible());
  await assert.ok(await page.locator("text=IT Solutions (Default)").isVisible());
  const homeInDrawer = await page.evaluate(() => {
    const nav = document.querySelector(".site-header__nav.is-open");
    const toggle = document.querySelector(".site-header__home-toggle");
    if (!nav || !toggle) return false;
    const n = nav.getBoundingClientRect();
    const t = toggle.getBoundingClientRect();
    return t.height > 0 && t.top >= n.top - 2 && t.top < n.bottom;
  });
  await assert.ok(homeInDrawer, "Home row in viewport after expand (builder bug)");
  await assert.ok(await page.locator(".site-header__home-links").isVisible());

  const boxHome = await homeToggle.boundingBox();
  const boxWeb = await page.locator(".site-header__home-links >> text=Web Agency").boundingBox();
  assert.ok(
    boxHome && boxWeb && boxWeb.y >= boxHome.y + boxHome.height - 2,
    "Web Agency below Home in editor preview styles",
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

  console.log(`✓ Editor mobile Home layout OK on ${base}`);
} catch (err) {
  console.error("✗", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
