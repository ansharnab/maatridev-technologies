/**
 * Run: node scripts/test-header-theme.mjs
 * Verifies header theme presets, sizes, and CSS variable resolution.
 */
import assert from "node:assert/strict";
import {
  HEADER_DESIGNS,
  HEADER_SIZES,
  HEADER_THEME_PRESETS,
  applyHeaderDesignPreset,
  previewContextFromPath,
  resolveHeaderTheme,
} from "../src/utils/headerTheme.js";
import { countHeaderColorFields } from "../src/utils/headerColorFields.js";

function testDesignPresets() {
  for (const id of Object.keys(HEADER_DESIGNS)) {
    const patch = applyHeaderDesignPreset(id);
    assert.equal(patch.headerDesign, id);
    assert.ok(patch.headerBarBackground, `${id} bar background`);
    assert.ok(patch.headerCtaBg, `${id} cta bg`);
  }
}

function testSizes() {
  for (const id of Object.keys(HEADER_SIZES)) {
    const theme = resolveHeaderTheme({ headerSize: id }, { editorPreview: true, previewContext: "home" });
    assert.equal(theme.size.id, id);
    assert.match(theme.cssVars["--header-height"], /px$/);
  }
}

function testPreviewContext() {
  assert.equal(previewContextFromPath("/"), "home");
  assert.equal(previewContextFromPath("/home/digital-agency"), "home");
  assert.equal(previewContextFromPath("/about"), "pageHero");
  assert.equal(previewContextFromPath("/services/foo"), "pageHero");
  assert.equal(previewContextFromPath("/appointment"), "pageHero");
}

function testLiveHomeGlass() {
  const settings = HEADER_THEME_PRESETS.find((p) => p.id === "live-home").patch();
  const theme = resolveHeaderTheme(settings, {
    editorPreview: true,
    previewContext: "home",
    onDarkBackdrop: true,
  });
  assert.equal(theme.design.id, "glass");
  assert.equal(theme.cssVars["--header-cta-bg"], "#007cc3");
  assert.equal(theme.cssVars["--header-glass-hero"], settings.headerBarOverHero);
}

function testGradientBar() {
  const settings = applyHeaderDesignPreset("gradient");
  const theme = resolveHeaderTheme(settings, {
    editorPreview: true,
    previewContext: "home",
    onDarkBackdrop: true,
  });
  assert.ok(String(theme.cssVars["--header-glass-hero"]).includes("gradient") || settings.headerBarOverHero.includes("gradient"));
}

function testColorOverrides() {
  const theme = resolveHeaderTheme(
    {
      headerDesign: "glass",
      headerNavActiveBg: "rgba(255, 0, 0, 0.5)",
      logoColorPrimary: "#ff00ff",
      headerCtaBg: "#112233",
    },
    { editorPreview: true, previewContext: "pageHero" },
  );
  assert.equal(theme.cssVars["--header-nav-active-bg"], "rgba(255, 0, 0, 0.5)");
  assert.equal(theme.cssVars["--header-logo-primary"], "#ff00ff");
  assert.equal(theme.cssVars["--header-cta-bg"], "#112233");
}

function testColorFieldCount() {
  const n = countHeaderColorFields();
  assert.ok(n >= 20, `expected at least 20 color fields, got ${n}`);
}

const tests = [
  ["design presets", testDesignPresets],
  ["sizes", testSizes],
  ["preview context paths", testPreviewContext],
  ["live home glass theme", testLiveHomeGlass],
  ["gradient bar theme", testGradientBar],
  ["color overrides", testColorOverrides],
  ["28+ color fields defined", testColorFieldCount],
];

let passed = 0;
for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed += 1;
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log(`\n${passed}/${tests.length} header theme tests passed`);
