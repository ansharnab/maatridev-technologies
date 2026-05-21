/**
 * Run: node scripts/test-mobile-header-css.mjs
 * Guards mobile header layout + tap-to-expand submenu rules.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "src/components/layout/Header.css"), "utf8");
const jsx = readFileSync(join(root, "src/components/layout/Header.jsx"), "utf8");

const requiredCss = [
  '"logo toggle"',
  "position: fixed",
  "max-height: 0",
  ".site-header__nav.is-open .site-header__dropdown.is-open .site-header__menu",
  "@media (min-width: 1101px) and (hover: hover)",
  ".site-header--editor-preview.site-header--editor-mobile .site-header__nav.is-open .site-header__dropdown.is-open .site-header__menu--editor",
];

assert.ok(jsx.includes("HOME_NAV_CHILDREN"), "Header.jsx should list agency homepages");
assert.ok(jsx.includes("SERVICE_NAV_CHILDREN"), "Header.jsx should list all service pages");

for (const needle of requiredCss) {
  assert.ok(css.includes(needle), `Header.css missing: ${needle.slice(0, 60)}…`);
}

assert.ok(jsx.includes("toggleDropdown"), "Header.jsx should toggle dropdowns on tap");
assert.ok(jsx.includes("const menuOpen = openDropdown === item.label"), "menuOpen must follow openDropdown state");
assert.ok(jsx.includes("closeMobileNav"), "Header.jsx should reset menu + dropdown together");

console.log("✓ mobile header CSS/JS rules present");
