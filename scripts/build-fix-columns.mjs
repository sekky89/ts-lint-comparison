import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "..");
const oxlintRulesPath = "/tmp/oxlint-rules.txt";
const reportPath = join(ROOT, "REPORT.md");

const detectionRaw = execSync("node scripts/measure-detection.mjs", { cwd: ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
const detection = JSON.parse(detectionRaw);
const eslintFired = new Set(detection.eslint || []);
const oxlintFired = new Set(detection.oxlint || []);
const biomeFired = new Set(detection.biome || []);

const eslintFixableList = JSON.parse(
  execSync("node scripts/get-eslint-fixable.mjs", { cwd: ROOT, encoding: "utf8", maxBuffer: 1024 * 1024 })
);
const eslintFixable = new Set(eslintFixableList);

let oxlintRaw = "";
try {
  oxlintRaw = readFileSync(oxlintRulesPath, "utf8");
} catch (_) {}
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

function oxlintDetected(eslintRuleName) {
  const [source, rule] = toOxLintKey(eslintRuleName);
  if (oxlintFired.has(`${source}:${rule}`)) return "○";
  if (eslintRuleName === "import/order" && oxlintFired.has("import-js:order")) return "○";
  if (eslintRuleName === "unused-imports/no-unused-imports" && oxlintFired.has("unused-imports-js:no-unused-imports")) return "○";
  return "×";
}

function biomeDetected(eslintRuleName) {
  const biome = eslintToBiomeRule[eslintRuleName];
  return biome && biomeFired.has(biome) ? "○" : "×";
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
const tableStart = report.indexOf("| ESLint ルール");
if (tableStart === -1) throw new Error("Table not found");

const headerLine = "| ESLint ルール | ESLint | OxLint | Biome | TS重複で無効可 | フォーマッター吸収 | ESLint fix | Biome fix | OxLint fix | 備考（未検出時） |";
const sepLine = "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |";

let tableEnd = report.indexOf("\n**注:**", tableStart);
if (tableEnd === -1) tableEnd = report.indexOf("\n" + "以下は本設定では無効", tableStart);
if (tableEnd === -1) tableEnd = report.length;
const formatterTableStart = report.indexOf("| indent |", tableEnd);
const afterMain = report.slice(tableEnd);
const beforeTable = report.slice(0, tableStart);

let dataRows = [];
const mainTable = report.slice(tableStart, tableEnd);
const rows = mainTable.split("\n").filter((line) => line.startsWith("|") && line.includes("|"));
dataRows = rows.slice(2);

let gitTsFmtNote = null;
try {
  const gitReport = execSync("git show HEAD:REPORT.md", { cwd: ROOT, encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
  const gitTableStart = gitReport.indexOf("| ESLint ルール");
  const gitTableEnd = gitReport.indexOf("以下は本設定では無効", gitTableStart) >= 0 ? gitReport.indexOf("以下は本設定では無効", gitTableStart) : gitReport.indexOf("\n**注:**", gitTableStart);
  const gitTable = gitReport.slice(gitTableStart, gitTableEnd >= 0 ? gitTableEnd : gitReport.length);
  const gitRows = gitTable.split("\n").filter((l) => l.startsWith("|") && l.includes("|"));
  gitTsFmtNote = {};
  for (const line of gitRows.slice(2)) {
    const p = line.split("|").map((s) => s.trim());
    const c = p.slice(1, p.length - 1);
    if (c.length >= 9 && c[0]) gitTsFmtNote[c[0]] = { ts: c[3] ?? "", fmt: c[4] ?? "", note: c[8] ?? "" };
  }
} catch (_) {}

if (dataRows.length === 0 && gitTsFmtNote && Object.keys(gitTsFmtNote).length > 0) {
  dataRows = Object.entries(gitTsFmtNote).map(([ruleName, v]) => `| ${ruleName} | | | | ${v.ts} | ${v.fmt} | | | | ${v.note} |`);
}

const newRows = [headerLine, sepLine];
for (const row of dataRows) {
  const parts = row.split("|").map((s) => s.trim());
  const cells = parts.slice(1, parts.length - 1);
  if (cells.length < 4) continue;
  const ruleName = cells[0];
  const es = eslintFired.has(ruleName) ? "○" : "×";
  const ox = oxlintDetected(ruleName);
  const biomeCol = biomeDetected(ruleName);
  const hasBiomeCol = cells.length >= 10;
  const fromGit = gitTsFmtNote && gitTsFmtNote[ruleName];
  const tsDup = fromGit ? fromGit.ts : ((hasBiomeCol ? cells[4] : cells[3]) ?? "");
  const fmtAbs = fromGit ? fromGit.fmt : ((hasBiomeCol ? cells[5] : cells[4]) ?? "");
  const note = fromGit ? fromGit.note : (cells[cells.length - 1] ?? "");
  const actualEslintFix = eslintFix(ruleName);
  const biomeFixCol = biomeFix(ruleName);
  const oxlintFixCol = oxlintFix(ruleName);
  newRows.push(`| ${ruleName} | ${es} | ${ox} | ${biomeCol} | ${tsDup} | ${fmtAbs} | ${actualEslintFix} | ${biomeFixCol} | ${oxlintFixCol} | ${note} |`);
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
  const eslintFixCol = cells[5] ?? "－";
  const biomeFixCol = cells[6] ?? "－";
  const oxlintFixCol = cells[7] ?? (ruleName ? oxlintFix(ruleName) : "－");
  const note = cells[8] ?? "";
  formatterRows.push(`| ${ruleName} | ${es} | ${ox} | － | ${tsDup} | ${fmtAbs} | ${eslintFixCol} | ${biomeFixCol} | ${oxlintFixCol} | ${note} |`);
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
