/**
 * Run: node scripts/test-nav-structure.mjs
 * Verifies simplified header nav (Home dropdown, Services single link).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsx = readFileSync(join(root, "src/components/layout/Header.jsx"), "utf8");

assert.ok(jsx.includes("HOME_NAV_CHILDREN"), "Home agencies list required");
assert.ok(jsx.includes("Web Agency"), "Web Agency link required");
assert.ok(jsx.includes("Startup Agency"), "Startup Agency link required");
assert.ok(jsx.includes("Digital Agency"), "Digital Agency link required");
assert.ok(jsx.includes('{ to: "/services", label: "Services" }'), "Services must be plain link");
assert.ok(!jsx.includes("SERVICE_NAV_CHILDREN"), "No Services submenu");
assert.equal((jsx.match(/label: "Services"/g) || []).length, 1, "Single Services entry");

const homeBlock = jsx.slice(jsx.indexOf("HOME_NAV_CHILDREN"), jsx.indexOf("const nav"));
assert.equal((homeBlock.match(/to: "/g) || []).length, 4, "Home should have 4 agency links");

console.log("✓ Nav structure: Home dropdown (4 agencies), Services → /services only");
