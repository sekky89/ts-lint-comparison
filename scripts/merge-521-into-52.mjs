/**
 * One-off: merge 5.2.1 "理由" into 5.2 table "備考（未検出時）", then remove 5.2.1 duplicate table.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const reportPath = join(import.meta.dirname, "..", "REPORT.md");
let report = readFileSync(reportPath, "utf8");

const reasonByRule = {};
const table521Match = report.match(/\|\s*ルール\s*\|\s*理由\s*\|\n\|[^\n]+\n((?:\|[^\n]+\n)+)/);
if (table521Match) {
  const rows = table521Match[1].trim().split("\n");
  for (const row of rows) {
    const m = row.match(/\|\s*([^|]+)\s*\|\s*([^|]*)\s*\|/);
    if (m) reasonByRule[m[1].trim()] = (m[2].trim() || "");
  }
}

const mainTableStart = report.indexOf("| ESLint ルール | ESLint | OxLint | Biome |");
if (mainTableStart === -1) throw new Error("5.2 table not found");
const mainTableEnd = report.indexOf("\n**注:**", mainTableStart);
const beforeTable = report.slice(0, mainTableStart);
const tableSection = report.slice(mainTableStart, mainTableEnd);
const afterTable = report.slice(mainTableEnd);

const lines = tableSection.split("\n");
const header = lines.slice(0, 2);
const dataRows = lines.slice(2);
const newDataRows = dataRows.map((line) => {
  const raw = line.split("|").map((s) => s.trim());
  const parts = raw.slice(1, raw.length - 1);
  if (parts.length < 10) return line;
  const ruleName = parts[0];
  const esCol = parts[1];
  const reason = reasonByRule[ruleName];
  if (esCol === "×" && reason !== undefined) {
    parts[9] = reason;
    return "| " + parts.join(" | ") + " |";
  }
  return line;
});

const newTable = header.join("\n") + "\n" + newDataRows.join("\n");
const newReport1 = beforeTable + newTable + afterTable;

const old521Block = /\n#### 5\.2\.1 ESLint 未検出 49 ルールの理由\n\n[^|]*(?:\|[^|]+\n)*[^|]*\n\n下表は \*\*5\.2 表で ESLint 列が × の 49 ルールのみ\*\*[^\n]*\n\n\| ルール \| 理由 \|\n\| --- \| --- \|\n(?:\|[^\n]+\n){49}\n\n/;
const new521Block = `#### 5.2.1 未検出時の理由について

ng-examples のみを対象に lint したときに**一度も発火しなかった** 49 ルールの理由は、**上記 5.2 表の「備考（未検出時）」列**に記載している（ESLint が × の行）。NG 例へ違反・設定を追加した結果、未検出は 112 → 61 → 54 → 51 → 49 に減少。**マルチファイル・循環・モジュール構造**用に cycle-a/b、mod-named/consumer-named、absolute-path-ng、export-not-last 等を追加済み（import/no-cycle・import/named 等は現状未発火）。

**「要追加」「再現不可」の意味**  
- **違反を追加すれば発火しうる（要追加）**: 違反コードを仕込めば発火しうるが、未追加またはパターン・ルール設定の都合で現状発火していないもの。  
- **ng-examples では再現不可**: 構成・環境の制約で違反コードが書けないもの（マルチファイル必須、Node/AMD 専用、TS が先に検出、PropTypes 未使用など）。

`;

let newReport2 = newReport1.replace(old521Block, new521Block);
if (newReport2 === newReport1) {
  const alt = /\n#### 5\.2\.1[^\n]*\n\n[^\n]*\n\n\*\*「該当パターンなし」[^]*?下表の理由では[^\n]*\n\n下表は \*\*5\.2 表で[^\n]*\n\n\| ルール \| 理由 \|\n\| --- \| --- \|\n([\s\S]*?)(?=\n\n\| ESLint ルール)/;
  newReport2 = newReport1.replace(alt, new521Block);
}
writeFileSync(reportPath, newReport2);
console.log("Merged 5.2.1 into 5.2 and removed duplicate table.");
