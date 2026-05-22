/**
 * Admin panel smoke + click tests (Page Builder, Site Content, gradients, header).
 * Run: node scripts/test-admin-panel.mjs
 * Requires: npm run dev, ADMIN_PASSWORD in .env
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function loadPassword() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return "maatridev2026";
  const line = fs.readFileSync(envPath, "utf8").split(/\r?\n/).find((l) => l.startsWith("ADMIN_PASSWORD="));
  return line?.split("=")[1]?.trim() || "maatridev2026";
}

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
  console.error("✗ Start dev server: npm run dev");
  process.exit(1);
}

const PASS = loadPassword();
const failures = [];
const passes = [];

function ok(name) {
  passes.push(name);
  console.log(`  ✓ ${name}`);
}

function fail(name, err) {
  failures.push({ name, err: err?.message || String(err) });
  console.error(`  ✗ ${name}: ${err?.message || err}`);
}

async function login(page) {
  await page.goto(`${base}/admin`, { waitUntil: "networkidle", timeout: 30000 });
  await page.locator('input[type="password"]').fill(PASS);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch {
  browser = await chromium.launch({ channel: "chrome", headless: true });
}

const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

try {
  console.log(`\nAdmin tests on ${base}\n`);

  await login(page);
  ok("Admin login");

  // Dashboard tabs
  for (const tab of ["Page Builder", "Media", "Settings", "Messages"]) {
    try {
      await page.getByRole("button", { name: tab }).click();
      await page.waitForTimeout(400);
      ok(`Dashboard tab: ${tab}`);
    } catch (e) {
      fail(`Dashboard tab: ${tab}`, e);
    }
  }

  await page.getByRole("button", { name: "Page Builder" }).click();
  await page.waitForTimeout(500);

  // Editor modes
  try {
    await page.getByRole("button", { name: "Site Content" }).click();
    await page.waitForSelector(".scp-tabs", { timeout: 8000 });
    ok("Editor mode: Site Content");
  } catch (e) {
    fail("Editor mode: Site Content", e);
  }

  // Site Content tabs
  for (const t of ["Brand & Logo", "Founders", "Services", "Company Contact"]) {
    try {
      await page.locator(".scp-tabs button", { hasText: t }).click();
      await page.waitForTimeout(300);
      ok(`Site Content tab: ${t}`);
    } catch (e) {
      fail(`Site Content tab: ${t}`, e);
    }
  }

  // Brand tab — gradient click
  await page.locator(".scp-tabs button", { hasText: "Brand & Logo" }).click();
  try {
    const cta = page.locator(".scp-brand-preview--live .site-header__cta");
    await page.locator(".scp-gradient-btn", { hasText: "Aurora teal" }).first().click();
    await page.waitForTimeout(350);
    const ctaBefore = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    const arcticBtn = page.locator(".scp-gradient-btn", { hasText: "Arctic frost" }).first();
    await arcticBtn.click();
    await page.waitForTimeout(400);
    await assert.ok(await arcticBtn.evaluate((el) => el.classList.contains("is-active")), "gradient active class");
    const ctaAfter = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    assert.notEqual(ctaBefore, ctaAfter, "header CTA color should change in preview");
    const status = await page.locator(".ve-history-toolbar__status, .ve-status").first().textContent();
    assert.match(status || "", /Applied/i, "status should confirm apply");
    ok("Gradient preset click updates preview (Brand)");
  } catch (e) {
    fail("Gradient preset click (Brand)", e);
  }

  try {
    const btnColor = page.locator(".scp-button-color-btn").first();
    await btnColor.click();
    await page.waitForTimeout(200);
    ok("Button color preset click");
  } catch (e) {
    fail("Button color preset click", e);
  }

  try {
    const headerChip = page.locator(".scp-theme-chip").first();
    await headerChip.click();
    ok("Header theme chip click");
  } catch (e) {
    fail("Header theme chip click", e);
  }

  try {
    const barBtn = page.locator(".scp-header-btn-panel .scp-header-design-card__bar-btn, .scp-header-design-grid .scp-header-design-card__bar-btn").first();
    await barBtn.click({ timeout: 5000 });
    ok("Header design bar stripe click");
  } catch (e) {
    fail("Header design bar stripe click", e);
  }

  // Pages mode
  try {
    await page.getByRole("button", { name: "Pages" }).click();
    await page.waitForSelector(".ve-canvas", { timeout: 8000 });
    ok("Editor mode: Pages");
  } catch (e) {
    fail("Editor mode: Pages", e);
  }

  // Page select
  try {
    await page.locator(".ve-toolbar select").selectOption("services");
    await page.waitForTimeout(600);
    ok("Page select: Services");
  } catch (e) {
    fail("Page select: Services", e);
  }

  // Header chrome select (desktop — bar visible)
  try {
    await page.getByRole("button", { name: "Desktop" }).click();
    await page.waitForTimeout(400);
    await page.locator(".ve-chrome-block__bar .ve-block__label").click({ timeout: 5000 });
    await page.waitForTimeout(400);
    await page.locator(".ve-inspector--header-colors").waitFor({ state: "visible", timeout: 5000 });
    ok("Header inspector opens");
  } catch (e) {
    fail("Header inspector opens", e);
  }

  // Mobile preview + menu
  try {
    await page.locator(".ve-preview-strip__buttons button", { hasText: /^Mobile$/ }).click();
    await page.waitForTimeout(500);
    const preview = page.locator(".ve-canvas");
    await preview.locator(".site-header__toggle").click();
    await preview.locator(".site-header__home-toggle").click();
    assert.ok(await preview.locator(".site-header__home-toggle").isVisible());
    ok("Mobile menu Home expand");
  } catch (e) {
    fail("Mobile menu Home expand", e);
  }

  // Header label click while menu open (closes menu + opens inspector)
  try {
    await page.locator(".ve-chrome-block__bar .ve-block__label").click({ timeout: 5000 });
    await page.waitForTimeout(400);
    await page.locator(".ve-inspector--header-colors").waitFor({ state: "visible", timeout: 5000 });
    ok("Header label click with menu open");
  } catch (e) {
    fail("Header label click with menu open", e);
  }

  // Inspector gradient in page builder
  try {
    const g = page.locator(".ve-inspector__gradient-block .scp-gradient-btn, .ve-inspector__gradient-wrap .scp-gradient-btn").first();
    if (await g.isVisible()) {
      await g.click();
      ok("Header inspector gradient click");
    }
  } catch (e) {
    fail("Header inspector gradient click", e);
  }

  // Section select + design gradient
  try {
    await page.locator(".ve-section-item").first().click({ timeout: 5000 });
    await page.waitForTimeout(400);
    await page.locator('.ve-inspector__tabs button:has-text("Design")').click();
    const secGrad = page.locator(".ve-inspector__gradient-wrap .scp-gradient-btn").first();
    if (await secGrad.isVisible()) {
      await secGrad.click();
      ok("Section gradient preset click");
    } else {
      const themeBtn = page.locator(".ve-inspector__themes button").first();
      await themeBtn.click();
      ok("Section theme preset click (fallback)");
    }
  } catch (e) {
    fail("Section design preset click", e);
  }

  // Desktop preview
  try {
    await page.getByRole("button", { name: "Desktop" }).click();
    await page.waitForTimeout(400);
    ok("Preview device: Desktop");
  } catch (e) {
    fail("Preview device: Desktop", e);
  }

  console.log(`\n---\nPassed: ${passes.length}, Failed: ${failures.length}\n`);
  if (failures.length) {
    for (const f of failures) console.error(`  • ${f.name}: ${f.err}`);
    process.exitCode = 1;
  } else {
    console.log("✓ All admin panel checks passed\n");
  }
} catch (err) {
  console.error("✗ Fatal:", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
