/**
 * Runs ESLint, OxLint, Biome on src/ and outputs JSON with sets of fired rule IDs.
 * Used by build-fix-columns.mjs to fill 検出 columns (ESLint / OxLint / Biome).
 */
import { execSync } from "child_process";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const TARGET = "src/ng-examples/";

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024, ...opts });
  } catch (e) {
    return e.stdout || "";
  }
}

const eslintOut = run(`npx eslint "${TARGET}" --format json 2>/dev/null`);
const eslintFired = new Set();
try {
  const arr = JSON.parse(eslintOut);
  for (const f of Array.isArray(arr) ? arr : []) {
    for (const m of f.messages || []) {
      if (m.ruleId) eslintFired.add(m.ruleId);
    }
  }
} catch (_) {}

const oxlintOut = run(`npx oxlint "${TARGET}" 2>&1`).replace(/\x1b\[[0-9;]*m/g, "");
const oxlintFired = new Set();
const oxRe = /([a-zA-Z0-9_-]+)\(([a-zA-Z0-9_-]+)\)/g;
let m;
while ((m = oxRe.exec(oxlintOut)) !== null) {
  let [, source, rule] = m;
  if (!source || !rule) continue;
  source = source.replace(/^\d+m?/, "") || source;
  oxlintFired.add(`${source}:${rule}`);
}

const biomeOut = run(`npx biome lint "${TARGET}" --reporter=json 2>/dev/null`);
const biomeFired = new Set();
try {
  const obj = JSON.parse(biomeOut);
  for (const d of obj.diagnostics || []) {
    if (d.category) biomeFired.add(d.category);
  }
} catch (_) {}

console.log(
  JSON.stringify({
    eslint: [...eslintFired].sort(),
    oxlint: [...oxlintFired].sort(),
    biome: [...biomeFired].sort(),
  })
);
