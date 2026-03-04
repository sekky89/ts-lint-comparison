import { execSync } from "child_process";
import { readFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const configOutput = execSync(
  "cd /Users/sekky/workspace/private/ts-lint-comparison && bunx eslint --print-config src/ng-examples/01-typescript-eslint-ng.tsx 2>/dev/null",
  { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 }
);
const config = JSON.parse(configOutput);
const ruleIds = Object.keys(config.rules || {});

const fixable = new Set();
const Linter = require("eslint").Linter;
const linter = new Linter();
const coreRules = linter.getRules ? linter.getRules() : new Map();

for (const ruleId of ruleIds) {
  let meta = null;
  if (ruleId.startsWith("@typescript-eslint/")) {
    const name = ruleId.slice("@typescript-eslint/".length);
    const plugin = require("@typescript-eslint/eslint-plugin");
    const r = plugin.rules?.[name];
    meta = r?.meta;
  } else if (ruleId.startsWith("react/")) {
    const name = ruleId.slice("react/".length);
    const plugin = require("eslint-plugin-react");
    const r = plugin.rules?.[name];
    meta = r?.meta;
  } else if (ruleId.startsWith("react-hooks/")) {
    const name = ruleId.slice("react-hooks/".length);
    const plugin = require("eslint-plugin-react-hooks");
    const r = plugin.rules?.[name];
    meta = r?.meta;
  } else if (ruleId.startsWith("jsx-a11y/")) {
    const name = ruleId.slice("jsx-a11y/".length);
    const plugin = require("eslint-plugin-jsx-a11y");
    const r = plugin.rules?.[name];
    meta = r?.meta;
  } else if (ruleId.startsWith("import/")) {
    const name = ruleId.slice("import/".length);
    try {
      const plugin = require("eslint-plugin-import");
      const r = plugin.rules?.[name];
      meta = r?.meta;
    } catch (_) {}
  } else if (ruleId.startsWith("unused-imports/")) {
    const name = ruleId.slice("unused-imports/".length);
    try {
      const plugin = require("eslint-plugin-unused-imports");
      const r = plugin.rules?.[name];
      meta = r?.meta;
    } catch (_) {}
  } else {
    const r = coreRules.get(ruleId);
    meta = r?.meta;
  }
  if (meta?.fixable) fixable.add(ruleId);
}

console.log(JSON.stringify([...fixable]));
