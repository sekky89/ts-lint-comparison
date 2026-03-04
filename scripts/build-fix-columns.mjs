import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "..");
const oxlintRulesPath = "/tmp/oxlint-rules.txt";
const reportPath = join(ROOT, "REPORT.md");

const eslintFixableList = JSON.parse(
  execSync("node scripts/get-eslint-fixable.mjs", { cwd: ROOT, encoding: "utf8", maxBuffer: 1024 * 1024 })
);
const eslintFixable = new Set(eslintFixableList);

const oxlintRaw = readFileSync(oxlintRulesPath, "utf8");
const oxlintFixable = new Set();
for (const line of oxlintRaw.split("\n")) {
  if (!line.startsWith("| ") || line.startsWith("| ---") || line.startsWith("| Rule name")) continue;
  const parts = line.split("|").map((s) => s.trim());
  if (parts.length < 6) continue;
  const ruleName = parts[1];
  const source = parts[2];
  const fixableCol = (parts[5] || "").trim();
  const hasFix = fixableCol.length > 0 && fixableCol !== "✅";
  if (!ruleName || !source || !hasFix) continue;
  oxlintFixable.add(`${source}:${ruleName}`);
}

function toOxLintKey(eslintRuleName) {
  if (eslintRuleName.startsWith("@typescript-eslint/")) return ["typescript", eslintRuleName.slice("@typescript-eslint/".length)];
  if (eslintRuleName.startsWith("react-hooks/")) return ["react", eslintRuleName.slice("react-hooks/".length)];
  if (eslintRuleName.startsWith("react/")) return ["react", eslintRuleName.slice("react/".length)];
  if (eslintRuleName.startsWith("jsx-a11y/")) return ["jsx_a11y", eslintRuleName.slice("jsx-a11y/".length)];
  return ["eslint", eslintRuleName];
}

const biomeFixableFromRun = new Set([
  "lint/a11y/noAccessKey", "lint/a11y/noAutofocus", "lint/a11y/noDistractingElements",
  "lint/a11y/noInteractiveElementToNoninteractiveRole", "lint/a11y/noNoninteractiveElementToInteractiveRole",
  "lint/a11y/noNoninteractiveTabindex", "lint/a11y/noPositiveTabindex", "lint/a11y/useAriaActivedescendantWithTabindex",
  "lint/a11y/useValidAriaProps", "lint/a11y/useValidAriaRole",
  "lint/complexity/noUselessCatch", "lint/complexity/noUselessCatchBinding",
  "lint/correctness/noUnusedVariables", "lint/correctness/noVoidElementsWithChildren", "lint/correctness/useExhaustiveDependencies",
  "lint/correctness/useParseIntRadix", "lint/style/useDefaultParameterLast", "lint/style/useNodejsImportProtocol",
  "lint/suspicious/noCommentText", "lint/suspicious/noConsole", "lint/suspicious/noDoubleEquals",
  "lint/suspicious/noGlobalIsNan", "lint/suspicious/noSparseArray", "lint/suspicious/noVar",
]);

const eslintToBiomeRule = {
  "no-var": "lint/suspicious/noVar",
  "prefer-const": "lint/style/useConst",
  "no-unused-vars": "lint/correctness/noUnusedVariables",
  "@typescript-eslint/no-unused-vars": "lint/correctness/noUnusedVariables",
  "no-console": "lint/suspicious/noConsole",
  "default-param-last": "lint/style/useDefaultParameterLast",
  "radix": "lint/correctness/useParseIntRadix",
  "eqeqeq": "lint/suspicious/noDoubleEquals",
  "use-isnan": "lint/suspicious/noGlobalIsNan",
  "no-useless-catch": "lint/complexity/noUselessCatch",
  "no-useless-catch-binding": "lint/complexity/noUselessCatchBinding",
  "react/jsx-no-comment-textnodes": "lint/suspicious/noCommentText",
  "react/void-dom-elements-no-children": "lint/correctness/noVoidElementsWithChildren",
  "react-hooks/exhaustive-deps": "lint/correctness/useExhaustiveDependencies",
  "jsx-a11y/no-access-key": "lint/a11y/noAccessKey",
  "jsx-a11y/no-autofocus": "lint/a11y/noAutofocus",
  "jsx-a11y/no-distracting-elements": "lint/a11y/noDistractingElements",
  "jsx-a11y/no-interactive-element-to-noninteractive-role": "lint/a11y/noInteractiveElementToNoninteractiveRole",
  "jsx-a11y/no-noninteractive-element-to-interactive-role": "lint/a11y/noNoninteractiveElementToInteractiveRole",
  "jsx-a11y/no-noninteractive-tabindex": "lint/a11y/noNoninteractiveTabindex",
  "jsx-a11y/no-positive-tabindex": "lint/a11y/noPositiveTabindex",
  "jsx-a11y/aria-activedescendant-has-tabindex": "lint/a11y/useAriaActivedescendantWithTabindex",
  "jsx-a11y/aria-props": "lint/a11y/useValidAriaProps",
  "jsx-a11y/aria-role": "lint/a11y/useValidAriaRole",
  "no-sparse-arrays": "lint/suspicious/noSparseArray",
};

function biomeFix(eslintRuleName) {
  const biome = eslintToBiomeRule[eslintRuleName];
  return biome && biomeFixableFromRun.has(biome) ? "○" : "－";
}

function oxlintFix(eslintRuleName) {
  const [source, rule] = toOxLintKey(eslintRuleName);
  return oxlintFixable.has(`${source}:${rule}`) ? "○" : "－";
}

function eslintFix(eslintRuleName) {
  return eslintFixable.has(eslintRuleName) ? "○" : "－";
}

const report = readFileSync(reportPath, "utf8");
const tableStart = report.indexOf("| ESLint ルール | ESLint | OxLint |");
if (tableStart === -1) throw new Error("Table not found");

const headerLine = "| ESLint ルール | ESLint | OxLint | TS重複で無効可 | フォーマッター吸収 | ESLint fix | Biome fix | OxLint fix | 備考（未検出時） |";
const sepLine = "| --- | --- | --- | --- | --- | --- | --- | --- | --- |";

const tableEndMarker = "\n*以下は本設定では無効";
const tableEnd = report.indexOf(tableEndMarker, tableStart);
const formatterTableStart = report.indexOf("| indent |", tableEnd);
const afterMain = report.slice(tableEnd);
const beforeTable = report.slice(0, tableStart);

let dataRows = [];
const mainTable = report.slice(tableStart, tableEnd);
const rows = mainTable.split("\n").filter((line) => line.startsWith("|") && line.includes("|"));
dataRows = rows.slice(2);

if (dataRows.length === 0) {
  const gitReport = execSync("git show HEAD:REPORT.md", { cwd: ROOT, encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
  const gitTableStart = gitReport.indexOf("| ESLint ルール | ESLint | OxLint |");
  const gitTableEnd = gitReport.indexOf("\n*以下は", gitTableStart);
  const gitTable = gitReport.slice(gitTableStart, gitTableEnd);
  const gitRows = gitTable.split("\n").filter((l) => l.startsWith("|") && l.includes("|"));
  dataRows = gitRows.slice(2);
}

const newRows = [headerLine, sepLine];
for (const row of dataRows) {
  const parts = row.split("|").map((s) => s.trim());
  const cells = parts.slice(1, parts.length - 1);
  if (cells.length < 4) continue;
  const ruleName = cells[0];
  const es = cells[1];
  const ox = cells[2];
  const tsDup = cells[3] ?? "";
  const fmtAbs = cells[4] ?? "";
  const note = (cells.length >= 5 ? cells[cells.length - 1] : cells[5]) ?? "";
  const actualEslintFix = eslintFix(ruleName);
  const biomeFixCol = biomeFix(ruleName);
  const oxlintFixCol = oxlintFix(ruleName);
  newRows.push(`| ${ruleName} | ${es} | ${ox} | ${tsDup} | ${fmtAbs} | ${actualEslintFix} | ${biomeFixCol} | ${oxlintFixCol} | ${note} |`);
}

const formatterSection = report.slice(formatterTableStart);
const formatterLines = formatterSection.split("\n");
const formatterRows = [];
for (const line of formatterLines) {
  if (!line.startsWith("|")) break;
  const parts = line.split("|").map((s) => s.trim());
  const cells = parts.slice(1, parts.length - 1);
  if (cells.length < 6) {
    formatterRows.push(line);
    continue;
  }
  const ruleName = cells[0] ?? "";
  const es = cells[1] ?? "";
  const ox = cells[2] ?? "";
  const tsDup = cells[3] ?? "";
  const fmtAbs = cells[4] ?? "";
  const note = cells[5] ?? "";
  const eslintFixCol = cells[6] ?? "－";
  const biomeFixCol = cells[7] ?? "－";
  const oxlintFixCol = ruleName ? oxlintFix(ruleName) : "－";
  formatterRows.push(`| ${ruleName} | ${es} | ${ox} | ${tsDup} | ${fmtAbs} | ${eslintFixCol} | ${biomeFixCol} | ${oxlintFixCol} | ${note} |`);
}

const newTable = newRows.join("\n");
const newReport = beforeTable + newTable + afterMain;

const formatterTableStartInNew = newReport.indexOf("| indent |");
const formatterTableEnd = newReport.indexOf("\n### 5.3", formatterTableStartInNew);
if (formatterTableStartInNew !== -1 && formatterTableEnd !== -1) {
  const beforeFmt = newReport.slice(0, formatterTableStartInNew);
  const afterFmt = newReport.slice(formatterTableEnd);
  const fmtTable = formatterRows.join("\n");
  writeFileSync(reportPath, beforeFmt + fmtTable + afterFmt);
} else {
  writeFileSync(reportPath, newReport);
}

console.log("ESLint fixable:", eslintFixable.size, "OxLint fixable:", oxlintFixable.size, "Table rows:", newRows.length - 2);
