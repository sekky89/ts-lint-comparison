# Lint & Format ツール比較レポート

## 対象ツール

| Tool | Version | Language | Role |
|------|---------|----------|------|
| ESLint | 8.57.1 | JavaScript | Linter |
| Prettier | 3.8.1 | JavaScript | Formatter |
| Biome | 2.4.5 | Rust | Linter + Formatter |
| OxLint | 1.51.0 | Rust (Oxc) | Linter |
| OxFmt | 0.36.0 | Rust (Oxc) | Formatter |

## 検証環境

- **OS**: macOS (darwin 25.2.0 / Apple Silicon)
- **Runtime**: Bun 1.3.10
- **対象ファイル**: `src/ng-examples/` 配下 12 TSX ファイル（約1,700行）
- **ESLint 設定**: airbnb + @typescript-eslint/recommended + react/recommended + jsx-a11y
- **Biome 設定**: recommended + 全カテゴリ有効
- **OxLint 設定**: 全プラグイン有効（react, typescript, import, jsx-a11y, react-hooks）

---

## 1. Lint 比較

### 1.1 検出結果サマリー

| Metric | ESLint | Biome | OxLint |
|--------|--------|-------|--------|
| **検出ユニークルール数** | 221 | 175 | 176 |
| **Errors** | 338 | 374 | 101 |
| **Warnings** | 26 | 199 | 645 |
| **Total problems** | 364 | 573 | 746 |
| **ESLint ルール対応数** | 221/271 (81.5%) | N/A (独自体系) | 142/271 (52.4%) |

### 1.2 実行速度（wall clock, 3回計測の最速値）

| Tool | Wall Time | Self-Reported | ESLint比 |
|------|-----------|---------------|----------|
| **ESLint** | **1,490ms** | - | 1.0x |
| **Biome** | **164ms** | 101ms | **9.1x 高速** |
| **OxLint** | **65ms** | 16ms | **22.9x 高速** |

### 1.3 ルール分析

#### ESLint (221 rules)

現行の `.eslintrc.cjs` で有効な 271 ルールのうち 221 を検出。TypeScript strict mode が先に防ぐルールや、PropTypes 固有ルール等の 50 ルールは NG コードとして再現不可。

**強み:**
- airbnb プリセットによる包括的なルールセット
- TypeScript 型情報を活用したルール（`@typescript-eslint` with project reference）
- import/order の細かい設定（グループ分け、アルファベット順）
- エコシステム最大（プラグイン 3,000+）

**弱み:**
- JavaScript 製のため速度が遅い
- 設定の複雑さ（extends/plugins/overrides の組み合わせ）
- ESLint 8 → 9 のフラット設定移行問題

#### Biome (175 rules)

独自のルール命名体系（`lint/category/ruleName`）。ESLint と名前は異なるが、多くの対応ルールが存在。

**強み:**
- Lint + Format が一体（設定ファイル 1 つ）
- recommended 設定だけで高品質なルールセット
- 設定が JSON で宣言的（学習コスト低）
- Prettier 97% 互換のフォーマッター内蔵

**弱み:**
- airbnb プリセット相当がない（個別ルール設定が必要）
- import/order の柔軟性が ESLint より劣る
- プラグインエコシステムが限定的

#### OxLint (176 rules, うち ESLint 対応 142)

ESLint 互換のルール命名を採用。`eslint(no-var)`, `eslint-plugin-react(...)` のように元のプラグイン名を維持。

**強み:**
- **圧倒的速度**（ESLint の 22.9 倍）
- ESLint 互換のルール名で移行しやすい
- 271 built-in ルール（プラグイン不要）
- 8 スレッド並列処理

**弱み:**
- `import/order` や `sort-imports` 等の一部ルール未対応
- `@typescript-eslint` の型情報活用ルールが限定的
- `consistent-type-imports` 等の TS 固有ルールが不足

### 1.4 各 Linter の自動 fix（--fix / --write）比較

| Linter | コマンド | fix 対応 | 備考 |
|--------|----------|----------|------|
| **ESLint** | `eslint --fix` | ✅ | ルールごとに fix 可能かが異なる。`--fix-type suggestion,layout` で提案・レイアウト系のみ適用も可。unused-imports 削除・quotes 統一・import 順など多数のルールが fix 可能。 |
| **Biome** | `biome lint --write` | ✅ | 安全な fix を一括適用。`--unsafe` で追加の fix も適用可能。organizeImports（assist）と組み合わせると import 整理も可能。 |
| **OxLint** | `oxlint --fix` | ✅ | 安全な fix のみ適用。`--fix-suggestions` / `--fix-dangerously` で段階的に追加可能。fix を提供するルールは ESLint より少なめ。 |

**検証結果（本プロジェクトの src に対して実行）:**

- **ESLint --fix**: 多数のルールで fix が用意されている（unused-imports 削除、import/order 並び替え、quotes、一部 @typescript-eslint など）。型エラーやパースエラーがあるファイルでは fix が止まる場合あり。
- **Biome lint --write**: 適用可能な診断に対して fix を書き込み。「Fixed N file(s)」と表示。Qwik 等のフレームワーク固有ルールは fix なしの警告になる場合あり。
- **OxLint --fix**: コマンドは存在し、fix 可能なルールに限り書き換え。fix 対象ルール数は ESLint より少ない。

**まとめ**: 自動 fix の**豊富さ**は ESLint が最も高い。Biome は安全 fix をまとめて適用できて扱いやすい。OxLint は fix 対応ルールが限定的だが、`--fix` で一部は自動修正される。

**ルール単位の fix 可否**: 各 Lint ツールごとに「そのルールが実際に fix されるか」は **5.2 の全 271 ルール表**の「ESLint fix」「Biome fix」「OxLint fix」列に記載。ESLint は `meta.fixable`、OxLint は `oxlint --rules` の Fixable? 列、Biome は NG 例で FIXABLE 表示の出たルールと ESLint ルール名の対応から算出。

---

## 2. Formatter 比較

### 2.1 実行速度（check mode, wall clock, 最速値）

| Tool | Wall Time | Prettier比 |
|------|-----------|-----------|
| **Prettier** | **267ms** | 1.0x |
| **Biome format** | **62ms** | **4.3x 高速** |
| **OxFmt** | **279ms** | 1.0x（同等） |

> **注:** OxFmt の self-reported 時間は 159ms だが、bunx のプロセス起動オーバーヘッドが大きい。
> 大規模プロジェクトではファイル数に対する相対的な起動コストが下がるため、OxFmt の速度優位性が出やすい。

### 2.2 Prettier 互換性

| Feature | Prettier | Biome | OxFmt |
|---------|----------|-------|-------|
| singleQuote | ✅ | ✅ | ✅ |
| trailingComma | ✅ | ✅ | ✅ |
| printWidth | ✅ | ✅ (lineWidth) | ✅ |
| tabWidth | ✅ | ✅ (indentWidth) | ✅ |
| .prettierrc 互換 | - | `biome migrate prettier` | ネイティブ対応 |
| 対応言語数 | 多い | 中程度 | 多い (HTML/CSS/YAML等) |
| Import ソート | ❌ (別ツール) | ✅ 内蔵 | ✅ 内蔵 |

### 2.3 各 Formatter の振る舞いの差

同一の不正フォーマット（余分なスペース・ダブルクォート等）のファイルを Prettier / Biome format / OxFmt でフォーマットした結果を比較した。

| 観点 | Prettier | Biome | OxFmt |
|------|----------|-------|-------|
| **設定の読み方** | .prettierrc.yml を参照 | biome.json の formatter / javascript.formatter | 未設定時はデフォルト（Prettier と異なる場合あり） |
| **クォート統一** | singleQuote: true で `"x"` → `'x'` に変換 | quoteStyle: "single" で同様に変換 | **設定なしだとダブルクォートを維持**（.prettierrc をそのまま読まない） |
| **余分スペース削除** | 関数引数前後のスペースを正規化 | 同様に正規化 | 同様に正規化 |
| **trailingComma** | trailingComma: es5 で付与 | trailingCommas: "es5" で付与 | 設定で Prettier 互換に可能 |

**結論**: Prettier と Biome は本プロジェクトの .prettierrc / biome.json に合わせて同じような出力になる。**OxFmt は設定ファイル（.oxfmtrc.json）を用意しない場合、クォートスタイル等が Prettier と一致しない**。`oxfmt --migrate=prettier` で .prettierrc から設定を移行するか、手動で .oxfmtrc.json を揃える必要がある。

---

## 3. 総合比較

### 3.1 機能マトリクス

| Feature | ESLint + Prettier | Biome | OxLint + OxFmt |
|---------|-------------------|-------|----------------|
| **Linter** | ✅ ESLint | ✅ 内蔵 | ✅ OxLint |
| **Formatter** | ✅ Prettier | ✅ 内蔵 | ✅ OxFmt |
| **Type-aware lint** | ✅ (tsconfig 参照) | ❌ | ❌ |
| **Import sort** | ✅ (eslint-plugin-import) | ✅ 内蔵 | ✅ OxFmt 内蔵 |
| **設定ファイル数** | 3+ (.eslintrc, .prettierrc, etc.) | 1 (biome.json) | 2 (.oxlintrc.json, .oxfmt設定) |
| **プラグイン拡張** | ✅ 豊富 | ⚠️ 限定的 | ❌ なし |
| **airbnb preset** | ✅ | ❌ | ❌ |
| **CI 速度** | 遅い | 速い | **最速** |
| **エディタ統合** | ✅ 成熟 | ✅ 良好 | ⚠️ 発展途上 |

### 3.2 速度サマリー（lint + format 合算）

| Toolchain | Lint | Format | **Total** | ESLint+Prettier比 |
|-----------|------|--------|-----------|-------------------|
| ESLint + Prettier | 1,490ms | 267ms | **1,757ms** | 1.0x |
| Biome (check) | 164ms | 62ms | **226ms** | **7.8x 高速** |
| OxLint + OxFmt | 65ms | 279ms | **344ms** | **5.1x 高速** |

---

## 4. 推奨シナリオ

### ESLint + Prettier を選ぶべきケース

- airbnb / Google 等の厳格なスタイルガイドに準拠したい
- TypeScript 型情報を活用した高精度な lint が必要
- 豊富なプラグインエコシステムを活用したい（eslint-plugin-testing-library 等）
- 既存の大規模プロジェクトで安定運用したい

### Biome を選ぶべきケース

- **設定の簡潔さ**を重視（1ファイルで lint + format）
- 新規プロジェクトで素早くセットアップしたい
- CI の高速化が重要
- Prettier 互換フォーマットを維持しつつ速度を改善したい

### OxLint + OxFmt を選ぶべきケース

- **CI の速度が最優先**（ESLint の 22.9 倍高速）
- ESLint からの段階的移行（`eslint-plugin-oxlint` で併用可能）
- 基本的な lint + format で十分（高度なカスタムルールは不要）
- ESLint の補完として使用（OxLint で高速チェック → ESLint で型情報ルール）

---

## 5. ルール単位の検出・未検出

### 5.1 サマリー

| 項目 | ESLint | OxLint |
|------|--------|--------|
| **有効ルール数** | 271 | 271 と同等設定 |
| **検出（NG 例で発火）** | 221 (81.5%) | 142 (52.4%) |
| **未検出** | 50 (18.5%) | 129 (47.6%) |

- **ESLint 未検出 50**: NG コードを用意しても発火しないルール（TS/Strict が先に防ぐ、マルチファイル必要、PropTypes 固有など）。
- **OxLint 検出 142**: 271 のうち、OxLint に同名相当があり、かつ本 NG 例で発火したルール。残り 129 は OxLint にルールがないか、本検証で発火しなかったもの。

### 5.1.1 フォーマッターで吸収されているルール

本プロジェクトでは `.eslintrc.cjs` の `extends` に **`prettier`**（eslint-config-prettier）を含めており、**フォーマット系の ESLint ルールはすべて無効化**されている。そのため「271 ルール」には含まれず、**5.2 のルール表の末尾**に「フォーマッター吸収＝○」として同じ表形式で記載した（indent, quotes, semi, comma-dangle, react/jsx-indent 等）。これらは Linter ではなく Formatter が一括で整形するため、ESLint 側で同じ指摘を持つ必要はない。

### 5.2 全 271 ルールの検出状況（ESLint / OxLint）

○＝検出、×＝未検出。備考は ESLint 未検出時の主な理由。**TS重複で無効可**: ○＝tsc/tsgo で検出されるため無効化可、△＝部分的に重複。**フォーマッター吸収**: 本設定では無効（extends prettier）で Formatter が担当するルールは下表の「フォーマッター吸収」列に○で記載（271 件はすべて空欄）。**ESLint fix / Biome fix / OxLint fix**: 各 Lint ツールで `--fix` または `--write` 実行時にそのルールが実際に修正されるか。○＝当該ツールで自動 fix 可能、－＝fix 非対応（ルールなし・fix 未実装・別名のため未対応含む）。

| ESLint ルール | ESLint | OxLint | TS重複で無効可 | フォーマッター吸収 | ESLint fix | Biome fix | OxLint fix | 備考（未検出時） |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| @typescript-eslint/ban-ts-comment | ○ | ○ |  |  | － | － | ○ |  |
| @typescript-eslint/ban-types | ○ | ○ |  |  | ○ | － | － |  |
| @typescript-eslint/consistent-type-imports | ○ | ○ | △ |  | ○ | － | ○ |  |
| @typescript-eslint/no-array-constructor | ○ | × |  |  | ○ | － | － |  |
| @typescript-eslint/no-duplicate-enum-values | ○ | ○ |  |  | － | － | － |  |
| @typescript-eslint/no-explicit-any | ○ | × |  |  | ○ | － | ○ |  |
| @typescript-eslint/no-extra-non-null-assertion | ○ | ○ |  |  | ○ | － | ○ |  |
| @typescript-eslint/no-loss-of-precision | ○ | × | △ |  | － | － | － |  |
| @typescript-eslint/no-misused-new | ○ | ○ | △ |  | － | － | － |  |
| @typescript-eslint/no-namespace | ○ | × |  |  | － | － | － |  |
| @typescript-eslint/no-non-null-asserted-optional-chain | ○ | ○ |  |  | － | － | ○ |  |
| @typescript-eslint/no-this-alias | ○ | ○ |  |  | － | － | － |  |
| @typescript-eslint/no-unnecessary-type-constraint | ○ | ○ | △ |  | － | － | ○ |  |
| @typescript-eslint/no-unsafe-declaration-merging | ○ | ○ |  |  | － | － | － |  |
| @typescript-eslint/no-use-before-define | ○ | × |  |  | － | － | － |  |
| @typescript-eslint/no-var-requires | ○ | × |  |  | － | － | － |  |
| @typescript-eslint/prefer-as-const | ○ | ○ |  |  | ○ | － | ○ |  |
| @typescript-eslint/triple-slash-reference | × | × |  | 許容 | － | － | － | 許容 |
| array-callback-return | ○ | ○ |  |  | － | － | ○ |  |
| arrow-body-style | ○ | ○ |  |  | ○ | － | ○ |  |
| block-scoped-var | ○ | × |  |  | － | － | － |  |
| camelcase | ○ | × |  |  | － | － | － |  |
| class-methods-use-this | ○ | × |  |  | － | － | － |  |
| consistent-return | ○ | × |  |  | － | － | － |  |
| default-case | ○ | × |  |  | － | － | － |  |
| default-case-last | ○ | ○ |  |  | － | － | － |  |
| default-param-last | ○ | ○ |  |  | － | ○ | － |  |
| dot-notation | ○ | × |  |  | ○ | － | － |  |
| eqeqeq | ○ | ○ |  |  | ○ | ○ | ○ |  |
| for-direction | ○ | ○ |  |  | － | － | ○ |  |
| func-names | ○ | ○ |  |  | － | － | ○ |  |
| global-require | ○ | × |  |  | － | － | － |  |
| grouped-accessor-pairs | ○ | ○ |  |  | － | － | ○ |  |
| guard-for-in | ○ | ○ |  |  | － | － | － |  |
| import/export | × | × |  | マルチファイル | － | － | － | マルチファイル |
| import/extensions | ○ | × |  |  | － | － | － |  |
| import/first | ○ | ○ |  |  | ○ | － | － |  |
| import/named | × | × |  | マルチファイル | － | － | － | マルチファイル |
| import/newline-after-import | ○ | × |  |  | ○ | － | － |  |
| import/no-absolute-path | × | × |  | マルチファイル | ○ | － | － | マルチファイル |
| import/no-amd | × | × |  | AMD | － | － | － | AMD |
| import/no-cycle | × | × |  | 循環参照 | － | － | － | 循環参照 |
| import/no-duplicates | ○ | ○ |  |  | ○ | － | － |  |
| import/no-dynamic-require | ○ | × |  |  | － | － | － |  |
| import/no-extraneous-dependencies | × | × |  | マルチファイル | － | － | － | マルチファイル |
| import/no-import-module-exports | × | × |  | 混在 | ○ | － | － | 混在 |
| import/no-mutable-exports | ○ | ○ |  |  | － | － | － |  |
| import/no-named-as-default | × | × |  | モジュール構造 | － | － | － | モジュール構造 |
| import/no-named-as-default-member | × | × |  | 同上 | － | － | － | 同上 |
| import/no-named-default | × | × |  | 同上 | － | － | － | 同上 |
| import/no-relative-packages | × | × |  | モノレポ | ○ | － | － | モノレポ |
| import/no-self-import | × | × |  | 自己import | － | － | － | 自己import |
| import/no-unresolved | × | × |  | 解決不能 | － | － | － | 解決不能 |
| import/no-useless-path-segments | ○ | × |  |  | ○ | － | － |  |
| import/no-webpack-loader-syntax | × | × |  | webpack | － | － | － | webpack |
| import/order | ○ | × |  |  | ○ | － | － |  |
| jsx-a11y/alt-text | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/anchor-has-content | ○ | ○ |  |  | － | － | ○ |  |
| jsx-a11y/anchor-is-valid | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/aria-activedescendant-has-tabindex | ○ | ○ |  |  | － | ○ | － |  |
| jsx-a11y/aria-props | ○ | ○ |  |  | － | ○ | ○ |  |
| jsx-a11y/aria-proptypes | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/aria-role | ○ | ○ |  |  | － | ○ | － |  |
| jsx-a11y/aria-unsupported-elements | ○ | ○ |  |  | － | － | ○ |  |
| jsx-a11y/click-events-have-key-events | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/control-has-associated-label | ○ | × |  |  | － | － | － |  |
| jsx-a11y/heading-has-content | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/html-has-lang | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/iframe-has-title | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/img-redundant-alt | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/interactive-supports-focus | ○ | × |  |  | － | － | － |  |
| jsx-a11y/label-has-associated-control | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/lang | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/media-has-caption | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/mouse-events-have-key-events | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/no-access-key | ○ | ○ |  |  | － | ○ | ○ |  |
| jsx-a11y/no-autofocus | ○ | ○ |  |  | － | ○ | ○ |  |
| jsx-a11y/no-distracting-elements | ○ | ○ |  |  | － | ○ | － |  |
| jsx-a11y/no-interactive-element-to-noninteractive-role | ○ | × |  |  | － | ○ | － |  |
| jsx-a11y/no-noninteractive-element-interactions | ○ | × |  |  | － | － | － |  |
| jsx-a11y/no-noninteractive-element-to-interactive-role | ○ | × |  |  | － | ○ | － |  |
| jsx-a11y/no-noninteractive-tabindex | ○ | × |  |  | － | ○ | － |  |
| jsx-a11y/no-redundant-roles | ○ | ○ |  |  | － | － | ○ |  |
| jsx-a11y/no-static-element-interactions | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/role-has-required-aria-props | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/role-supports-aria-props | ○ | ○ |  |  | － | － | － |  |
| jsx-a11y/scope | ○ | ○ |  |  | － | － | ○ |  |
| jsx-a11y/tabindex-no-positive | ○ | ○ |  |  | － | － | ○ |  |
| lines-around-directive | × | × |  | ESM | ○ | － | － | ESM |
| lines-between-class-members | ○ | × |  |  | ○ | － | － |  |
| max-classes-per-file | ○ | ○ |  |  | － | － | － |  |
| new-cap | ○ | ○ |  |  | － | － | ○ |  |
| no-alert | ○ | × |  |  | － | － | － |  |
| no-async-promise-executor | ○ | ○ |  |  | － | － | － |  |
| no-await-in-loop | ○ | × |  |  | － | － | － |  |
| no-bitwise | ○ | × |  |  | － | － | － |  |
| no-buffer-constructor | × | × | ○ | Node専用 | － | － | － | Node専用 |
| no-caller | ○ | ○ |  |  | － | － | － |  |
| no-case-declarations | ○ | ○ |  |  | － | － | ○ |  |
| no-class-assign | × | × | ○ | TSが先に防止 | － | － | － | TSが先に防止 |
| no-compare-neg-zero | ○ | ○ |  |  | － | － | ○ |  |
| no-cond-assign | ○ | × |  |  | － | － | － |  |
| no-console | ○ | × |  |  | － | ○ | ○ |  |
| no-constant-condition | ○ | ○ |  |  | － | － | － |  |
| no-constructor-return | ○ | ○ |  |  | － | － | － |  |
| no-continue | ○ | ○ |  |  | － | － | － |  |
| no-control-regex | ○ | ○ |  |  | － | － | － |  |
| no-debugger | ○ | ○ |  |  | － | － | ○ |  |
| no-delete-var | × | × | ○ | TSが先に防止 | － | － | － | TSが先に防止 |
| no-dupe-else-if | ○ | ○ |  |  | － | － | － |  |
| no-duplicate-case | ○ | ○ |  |  | － | － | － |  |
| no-else-return | ○ | ○ |  |  | ○ | － | ○ |  |
| no-empty | ○ | × |  |  | － | － | ○ |  |
| no-empty-character-class | ○ | ○ |  |  | － | － | － |  |
| no-empty-function | ○ | × |  |  | － | － | ○ |  |
| no-empty-pattern | ○ | ○ |  |  | － | － | － |  |
| no-eval | ○ | ○ |  |  | － | － | － |  |
| no-ex-assign | ○ | ○ |  |  | － | － | － |  |
| no-extend-native | ○ | ○ |  |  | － | － | － |  |
| no-extra-bind | ○ | ○ |  |  | ○ | － | ○ |  |
| no-extra-boolean-cast | ○ | ○ |  |  | ○ | － | ○ |  |
| no-extra-label | ○ | ○ |  |  | ○ | － | ○ |  |
| no-fallthrough | ○ | ○ | ○ |  | － | － | ○ |  |
| no-global-assign | × | × | ○ | TSが先に防止 | － | － | － | TSが先に防止 |
| no-implied-eval | ○ | × |  |  | － | － | － |  |
| no-inner-declarations | ○ | ○ |  |  | － | － | － |  |
| no-invalid-regexp | × | × | ○ | TSが先に防止 | － | － | － | TSが先に防止 |
| no-irregular-whitespace | × | × |  | 不可視文字 | － | － | － | 不可視文字 |
| no-iterator | ○ | ○ |  |  | － | － | ○ |  |
| no-label-var | ○ | × |  |  | － | － | － |  |
| no-labels | ○ | ○ |  |  | － | － | － |  |
| no-lone-blocks | ○ | ○ |  |  | － | － | － |  |
| no-lonely-if | ○ | ○ |  |  | ○ | － | ○ |  |
| no-loop-func | ○ | ○ |  |  | － | － | － |  |
| no-misleading-character-class | × | × |  | 特殊Unicode | － | － | ○ | 特殊Unicode |
| no-multi-assign | ○ | × |  |  | － | － | － |  |
| no-multi-str | ○ | ○ |  |  | － | － | － |  |
| no-nested-ternary | ○ | ○ |  |  | － | － | － |  |
| no-new | ○ | ○ |  |  | － | － | － |  |
| no-new-func | ○ | ○ |  |  | － | － | － |  |
| no-new-object | ○ | × |  |  | － | － | － |  |
| no-new-require | × | × | ○ | TSが先に防止 | － | － | － | TSが先に防止 |
| no-new-wrappers | ○ | ○ |  |  | － | － | ○ |  |
| no-nonoctal-decimal-escape | × | × | ○ | Strict Mode | － | － | ○ | Strict Mode |
| no-octal | × | × | ○ | Strict Mode | － | － | － | Strict Mode |
| no-octal-escape | × | × | ○ | Strict Mode | － | － | － | Strict Mode |
| no-param-reassign | ○ | × |  |  | － | － | － |  |
| no-path-concat | × | × | ○ | ESM | － | － | － | ESM |
| no-plusplus | ○ | × |  |  | － | － | ○ |  |
| no-promise-executor-return | ○ | ○ |  |  | － | － | ○ |  |
| no-proto | ○ | × |  |  | － | － | ○ |  |
| no-prototype-builtins | ○ | ○ |  |  | － | － | ○ |  |
| no-regex-spaces | ○ | × |  |  | ○ | － | ○ |  |
| no-restricted-exports | × | × |  | 未設定 | － | － | － | 未設定 |
| no-restricted-globals | ○ | × |  |  | － | － | － |  |
| no-restricted-properties | ○ | × |  |  | － | － | － |  |
| no-restricted-syntax | ○ | × |  |  | － | － | － |  |
| no-return-assign | ○ | × |  |  | － | － | － |  |
| no-return-await | ○ | × |  |  | － | － | － |  |
| no-script-url | ○ | ○ |  |  | － | － | － |  |
| no-self-assign | ○ | ○ |  |  | － | － | － |  |
| no-self-compare | ○ | ○ |  |  | － | － | － |  |
| no-sequences | ○ | × |  |  | － | － | － |  |
| no-shadow | ○ | × |  |  | － | － | － |  |
| no-shadow-restricted-names | × | × | ○ | TSが先に防止 | － | － | － | TSが先に防止 |
| no-sparse-arrays | ○ | ○ |  |  | － | ○ | － |  |
| no-template-curly-in-string | ○ | ○ |  |  | － | － | － |  |
| no-throw-literal | ○ | ○ |  |  | － | － | ○ |  |
| no-undef-init | ○ | × |  |  | ○ | － | － |  |
| no-underscore-dangle | ○ | × |  |  | － | － | － |  |
| no-unneeded-ternary | ○ | ○ |  |  | ○ | － | ○ |  |
| no-unreachable-loop | ○ | × |  |  | － | － | － |  |
| no-unsafe-finally | ○ | ○ |  |  | － | － | － |  |
| no-unsafe-optional-chaining | ○ | × |  |  | － | － | － |  |
| no-unused-expressions | ○ | ○ |  |  | － | － | － |  |
| no-unused-labels | ○ | ○ |  |  | ○ | － | ○ |  |
| no-useless-backreference | × | × |  | 特殊正規表現 | － | － | － | 特殊正規表現 |
| no-useless-catch | ○ | ○ |  |  | － | ○ | － |  |
| no-useless-computed-key | ○ | ○ |  |  | ○ | － | ○ |  |
| no-useless-concat | ○ | ○ |  |  | － | － | ○ |  |
| no-useless-constructor | ○ | ○ |  |  | － | － | ○ |  |
| no-useless-escape | ○ | ○ |  |  | － | － | ○ |  |
| no-useless-rename | ○ | ○ |  |  | ○ | － | ○ |  |
| no-useless-return | ○ | ○ |  |  | ○ | － | ○ |  |
| no-var | ○ | × |  |  | ○ | ○ | ○ |  |
| no-void | ○ | × |  |  | － | － | ○ |  |
| no-with | × | × | ○ | Strict Mode | － | － | － | Strict Mode |
| object-shorthand | ○ | × |  |  | ○ | － | － |  |
| one-var | ○ | × |  |  | ○ | － | － |  |
| operator-assignment | ○ | ○ |  |  | ○ | － | ○ |  |
| prefer-arrow-callback | ○ | × |  |  | ○ | － | － |  |
| prefer-const | ○ | ○ |  |  | ○ | － | ○ |  |
| prefer-destructuring | ○ | ○ |  |  | ○ | － | ○ |  |
| prefer-exponentiation-operator | ○ | ○ |  |  | ○ | － | ○ |  |
| prefer-numeric-literals | ○ | ○ |  |  | ○ | － | ○ |  |
| prefer-object-spread | ○ | ○ |  |  | ○ | － | ○ |  |
| prefer-promise-reject-errors | ○ | ○ |  |  | － | － | － |  |
| prefer-regex-literals | ○ | × |  |  | － | － | － |  |
| prefer-rest-params | ○ | ○ |  |  | － | － | － |  |
| prefer-spread | ○ | ○ |  |  | － | － | － |  |
| prefer-template | ○ | ○ |  |  | ○ | － | ○ |  |
| radix | ○ | ○ |  |  | － | ○ | ○ |  |
| react-hooks/exhaustive-deps | ○ | ○ |  |  | ○ | ○ | ○ |  |
| react-hooks/rules-of-hooks | ○ | ○ |  |  | － | － | － |  |
| react/button-has-type | ○ | × |  |  | － | － | － |  |
| react/default-props-match-prop-types | × | × |  | PropTypes | － | － | － | PropTypes |
| react/destructuring-assignment | ○ | × |  |  | ○ | － | － |  |
| react/forbid-foreign-prop-types | × | × |  | PropTypes | － | － | － | PropTypes |
| react/forbid-prop-types | × | × |  | PropTypes | － | － | － | PropTypes |
| react/function-component-definition | ○ | × |  |  | ○ | － | － |  |
| react/jsx-boolean-value | ○ | ○ |  |  | ○ | － | ○ |  |
| react/jsx-curly-brace-presence | ○ | ○ |  |  | ○ | － | ○ |  |
| react/jsx-filename-extension | × | × |  | .tsx | － | － | ○ | .tsx |
| react/jsx-fragments | ○ | ○ |  |  | ○ | － | ○ |  |
| react/jsx-no-bind | ○ | × |  |  | － | － | － |  |
| react/jsx-no-comment-textnodes | ○ | ○ |  |  | － | ○ | － |  |
| react/jsx-no-constructed-context-values | ○ | × |  |  | － | － | － |  |
| react/jsx-no-duplicate-props | ○ | ○ |  |  | － | － | － |  |
| react/jsx-no-script-url | ○ | ○ |  |  | － | － | ○ |  |
| react/jsx-no-target-blank | ○ | ○ |  |  | ○ | － | ○ |  |
| react/jsx-no-undef | × | × | ○ | TSが検出 | － | － | － | TSが検出 |
| react/jsx-no-useless-fragment | ○ | ○ |  |  | ○ | － | ○ |  |
| react/jsx-pascal-case | ○ | ○ |  |  | － | － | － |  |
| react/jsx-props-no-spreading | ○ | ○ |  |  | － | － | － |  |
| react/jsx-uses-vars | × | × |  | ヘルパー | － | － | － | ヘルパー |
| react/no-access-state-in-setstate | ○ | × |  |  | － | － | － |  |
| react/no-array-index-key | ○ | × |  |  | － | － | － |  |
| react/no-arrow-function-lifecycle | ○ | × |  |  | ○ | － | － |  |
| react/no-children-prop | ○ | ○ |  |  | － | － | － |  |
| react/no-danger | ○ | × |  |  | － | － | － |  |
| react/no-danger-with-children | ○ | ○ |  |  | － | － | － |  |
| react/no-deprecated | ○ | × |  |  | － | － | － |  |
| react/no-did-update-set-state | × | × |  | 検出漏れ | － | － | － | 検出漏れ |
| react/no-find-dom-node | ○ | ○ |  |  | － | － | － |  |
| react/no-invalid-html-attribute | ○ | × |  |  | － | － | － |  |
| react/no-is-mounted | ○ | ○ |  |  | － | － | － |  |
| react/no-namespace | × | × |  | パーサー | － | － | － | パーサー |
| react/no-redundant-should-component-update | ○ | ○ |  |  | － | － | － |  |
| react/no-render-return-value | × | × |  | 未使用 | － | － | － | 未使用 |
| react/no-string-refs | ○ | ○ |  |  | － | － | － |  |
| react/no-this-in-sfc | × | × | ○ | TS | － | － | － | TS |
| react/no-typos | ○ | × |  |  | － | － | － |  |
| react/no-unescaped-entities | ○ | ○ |  |  | － | － | ○ |  |
| react/no-unknown-property | ○ | × |  |  | ○ | － | ○ |  |
| react/no-unstable-nested-components | ○ | × |  |  | － | － | － |  |
| react/no-unused-class-component-methods | ○ | × |  |  | － | － | － |  |
| react/no-unused-prop-types | × | × |  | PropTypes | － | － | － | PropTypes |
| react/no-unused-state | ○ | × |  |  | － | － | － |  |
| react/no-will-update-set-state | ○ | ○ |  |  | － | － | － |  |
| react/prefer-es6-class | × | × |  | createReactClass | － | － | － | createReactClass |
| react/prefer-exact-props | × | × |  | Flow/PropTypes | － | － | － | Flow/PropTypes |
| react/prefer-stateless-function | ○ | × |  |  | － | － | － |  |
| react/prop-types | × | × |  | TSで代替 | － | － | － | TSで代替 |
| react/require-render-return | ○ | × |  |  | － | － | － |  |
| react/self-closing-comp | ○ | ○ |  |  | ○ | － | ○ |  |
| react/sort-comp | ○ | × |  |  | － | － | － |  |
| react/state-in-constructor | ○ | ○ |  |  | － | － | － |  |
| react/static-property-placement | × | × |  | PropTypes | － | － | － | PropTypes |
| react/style-prop-object | × | × |  | TSで回避 | － | － | － | TSで回避 |
| react/void-dom-elements-no-children | ○ | ○ |  |  | － | ○ | － |  |
| require-yield | ○ | ○ |  |  | － | － | － |  |
| sort-imports | ○ | ○ |  |  | ○ | － | ○ |  |
| spaced-comment | ○ | × |  |  | ○ | － | － |  |
| strict | × | × | ○ | ESM | ○ | － | － | ESM |
| symbol-description | ○ | × |  |  | － | － | － |  |
| unicode-bom | × | × |  | BOM必要 | ○ | － | ○ | BOM必要 |
| unused-imports/no-unused-imports | ○ | × | ○ |  | ○ | － | － |  |
| use-isnan | ○ | ○ |  |  | － | ○ | ○ |  |
| valid-typeof | ○ | ○ |  |  | － | － | ○ |  |
| vars-on-top | ○ | ○ |  |  | － | － | － |  |
| yoda | ○ | ○ |  |  | ○ | － | ○ |  |

**注:** 以下は本設定では無効（extends prettier によりフォーマッターで吸収）されているルール例。上記 271 には含まれない。

| ESLint ルール | ESLint | OxLint | TS重複で無効可 | フォーマッター吸収 | ESLint fix | Biome fix | OxLint fix | 備考（未検出時） |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| indent | - | - | ○ | ○ | － | － | － | 本設定では無効（Formatter が担当） |
| quotes | - | - | ○ | ○ | － | － | － | 同上 |
| semi | - | - | ○ | ○ | － | － | － | 同上 |
| comma-dangle | - | - | ○ | ○ | － | － | － | 同上 |
| max-len | - | - | ○ | - | － | － | － | 同上（specialRule） |
| no-extra-semi | - | - | ○ | ○ | － | － | － | 同上 |
| jsx-quotes | - | - | ○ | ○ | － | － | － | 同上 |
| react/jsx-indent | - | - | ○ | ○ | － | － | － | 同上 |
| react/jsx-indent-props | - | - | ○ | ○ | － | － | － | 同上 |
| array-bracket-spacing | - | - | ○ | ○ | － | － | － | 同上 |
| object-curly-spacing | - | - | ○ | ○ | － | － | － | 同上 |
| keyword-spacing | - | - | ○ | ○ | － | － | － | 同上 |
| no-mixed-spaces-and-tabs | - | - | ○ | ○ | － | － | － | 同上 |
| no-trailing-spaces | - | - | ○ | ○ | － | － | － | 同上 |
| brace-style | - | - | ○ | ○ | － | － | － | 同上 |
| arrow-parens | - | - | ○ | ○ | － | － | － | 同上 |
| eol-last | - | - | ○ | ○ | － | － | － | 同上 |
| comma-spacing | - | - | ○ | ○ | － | － | － | 同上 |
| space-infix-ops | - | - | ○ | ○ | － | － | － | 同上 |
### 5.3 ESLint 未検出 50 ルール（理由別）

NG 例を用意しても ESLint が発火しなかった 50 ルールと主な理由。

| ルール | 理由 |
|--------|------|
| `@typescript-eslint/triple-slash-reference` | 許容 |
| `import/export` | マルチファイル |
| `import/named` | マルチファイル |
| `import/no-absolute-path` | マルチファイル |
| `import/no-amd` | AMD |
| `import/no-cycle` | 循環参照 |
| `import/no-extraneous-dependencies` | マルチファイル |
| `import/no-import-module-exports` | 混在 |
| `import/no-named-as-default` | モジュール構造 |
| `import/no-named-as-default-member` | 同上 |
| `import/no-named-default` | 同上 |
| `import/no-relative-packages` | モノレポ |
| `import/no-self-import` | 自己import |
| `import/no-unresolved` | 解決不能 |
| `import/no-webpack-loader-syntax` | webpack |
| `lines-around-directive` | ESM |
| `no-buffer-constructor` | Node専用 |
| `no-class-assign` | TSが先に防止 |
| `no-delete-var` | TSが先に防止 |
| `no-global-assign` | TSが先に防止 |
| `no-invalid-regexp` | TSが先に防止 |
| `no-irregular-whitespace` | 不可視文字 |
| `no-misleading-character-class` | 特殊Unicode |
| `no-new-require` | TSが先に防止 |
| `no-nonoctal-decimal-escape` | Strict Mode |
| `no-octal` | Strict Mode |
| `no-octal-escape` | Strict Mode |
| `no-path-concat` | ESM |
| `no-restricted-exports` | 未設定 |
| `no-shadow-restricted-names` | TSが先に防止 |
| `no-useless-backreference` | 特殊正規表現 |
| `no-with` | Strict Mode |
| `react/default-props-match-prop-types` | PropTypes |
| `react/forbid-foreign-prop-types` | PropTypes |
| `react/forbid-prop-types` | PropTypes |
| `react/jsx-filename-extension` | .tsx |
| `react/jsx-no-undef` | TSが検出 |
| `react/jsx-uses-vars` | ヘルパー |
| `react/no-did-update-set-state` | 検出漏れ |
| `react/no-namespace` | パーサー |
| `react/no-render-return-value` | 未使用 |
| `react/no-this-in-sfc` | TS |
| `react/no-unused-prop-types` | PropTypes |
| `react/prefer-es6-class` | createReactClass |
| `react/prefer-exact-props` | Flow/PropTypes |
| `react/prop-types` | TSで代替 |
| `react/static-property-placement` | PropTypes |
| `react/style-prop-object` | TSで回避 |
| `strict` | ESM |
| `unicode-bom` | BOM必要 |

### 5.4 Biome 検出ルール一覧（参考・独自命名 175 件）

Biome は `lint/category/ruleName` 形式の独自ルール名。本 NG 例で発火した 175 ルールを列挙（ESLint との 1:1 対応表は未作成）。

```
lint/a11y/noAccessKey, lint/a11y/noAriaHiddenOnFocusable, lint/a11y/noAriaUnsupportedElements,
lint/a11y/noAutofocus, lint/a11y/noDistractingElements, lint/a11y/noHeaderScope,
lint/a11y/noInteractiveElementToNoninteractiveRole, lint/a11y/noLabelWithoutControl,
lint/a11y/noNoninteractiveElementInteractions, lint/a11y/noNoninteractiveElementToInteractiveRole,
lint/a11y/noNoninteractiveTabindex, lint/a11y/noPositiveTabindex, lint/a11y/noRedundantAlt,
lint/a11y/noRedundantRoles, lint/a11y/noStaticElementInteractions, lint/a11y/useAltText,
lint/a11y/useAnchorContent, lint/a11y/useAriaActivedescendantWithTabindex, lint/a11y/useAriaPropsForRole,
lint/a11y/useAriaPropsSupportedByRole, lint/a11y/useButtonType, lint/a11y/useFocusableInteractive,
lint/a11y/useHeadingContent, lint/a11y/useHtmlLang, lint/a11y/useIframeTitle,
lint/a11y/useKeyWithClickEvents, lint/a11y/useKeyWithMouseEvents, lint/a11y/useMediaCaption,
lint/a11y/useSemanticElements, lint/a11y/useValidAnchor, lint/a11y/useValidAriaProps,
lint/a11y/useValidAriaRole, lint/a11y/useValidAriaValues, lint/a11y/useValidLang,
lint/complexity/noAdjacentSpacesInRegex, lint/complexity/noArguments, lint/complexity/noBannedTypes,
lint/complexity/noCommaOperator, lint/complexity/noExtraBooleanCast, lint/complexity/noImplicitCoercions,
lint/complexity/noUselessCatch, lint/complexity/noUselessCatchBinding, lint/complexity/noUselessConstructor,
lint/complexity/noUselessLabel, lint/complexity/noUselessRename, lint/complexity/noUselessStringConcat,
lint/complexity/noUselessTernary, lint/complexity/noUselessThisAlias, lint/complexity/noUselessTypeConstraint,
lint/complexity/noUselessUndefined, lint/complexity/noVoid, lint/complexity/useArrowFunction,
lint/complexity/useLiteralKeys, lint/complexity/useNumericLiterals, lint/complexity/useRegexLiterals,
lint/correctness/noChildrenProp, lint/correctness/noConstantCondition, lint/correctness/noConstructorReturn,
lint/correctness/noEmptyCharacterClassInRegex, lint/correctness/noEmptyPattern, lint/correctness/noInnerDeclarations,
lint/correctness/noInvalidUseBeforeDeclaration, lint/correctness/noNestedComponentDefinitions,
lint/correctness/noNodejsModules, lint/correctness/noPrecisionLoss, lint/correctness/noSelfAssign,
lint/correctness/noSolidDestructuredProps, lint/correctness/noSwitchDeclarations, lint/correctness/noUndeclaredVariables,
lint/correctness/noUnreachable, lint/correctness/noUnresolvedImports, lint/correctness/noUnsafeFinally,
lint/correctness/noUnusedImports, lint/correctness/noUnusedLabels, lint/correctness/noUnusedVariables,
lint/correctness/noVoidElementsWithChildren, lint/correctness/useExhaustiveDependencies, lint/correctness/useHookAtTopLevel,
lint/correctness/useImageSize, lint/correctness/useImportExtensions, lint/correctness/useIsNan,
lint/correctness/useParseIntRadix, lint/correctness/useQwikValidLexicalScope, lint/correctness/useUniqueElementIds,
lint/correctness/useValidForDirection, lint/correctness/useValidTypeof, lint/correctness/useYield,
lint/performance/noAwaitInLoops, lint/performance/noImgElement, lint/performance/useSolidForComponent,
lint/security/noBlankTarget, lint/security/noDangerouslySetInnerHtml, lint/security/noDangerouslySetInnerHtmlWithChildren,
lint/security/noGlobalEval, lint/style/noCommonJs, lint/style/noEnum, lint/style/noExportedImports,
lint/style/noImplicitBoolean, lint/style/noInferrableTypes, lint/style/noJsxLiterals, lint/style/noMagicNumbers,
lint/style/noNamespace, lint/style/noNestedTernary, lint/style/noNonNullAssertion, lint/style/noUselessElse,
lint/style/noYodaExpression, lint/style/useArrayLiterals, lint/style/useAsConstAssertion, lint/style/useBlockStatements,
lint/style/useCollapsedElseIf, lint/style/useComponentExportOnlyModules, lint/style/useConsistentArrowReturn,
lint/style/useConsistentBuiltinInstantiation, lint/style/useConsistentCurlyBraces, lint/style/useConsistentObjectDefinitions,
lint/style/useConst, lint/style/useDefaultParameterLast, lint/style/useDefaultSwitchClause,
lint/style/useExponentiationOperator, lint/style/useExportsLast, lint/style/useForOf, lint/style/useFragmentSyntax,
lint/style/useGroupedAccessorPairs, lint/style/useImportType, lint/style/useNamingConvention,
lint/style/useNodejsImportProtocol, lint/style/useNumberNamespace, lint/style/useNumericSeparators,
lint/style/useObjectSpread, lint/style/useReactFunctionComponents, lint/style/useSelfClosingElements,
lint/style/useShorthandAssign, lint/style/useSingleVarDeclarator, lint/style/useSymbolDescription,
lint/style/useTemplate, lint/style/useThrowOnlyError, lint/suspicious/noAlert, lint/suspicious/noArrayIndexKey,
lint/suspicious/noAssignInExpressions, lint/suspicious/noAsyncPromiseExecutor, lint/suspicious/noBitwiseOperators,
lint/suspicious/noCatchAssign, lint/suspicious/noCommentText, lint/suspicious/noCompareNegZero,
lint/suspicious/noConfusingLabels, lint/suspicious/noConsole, lint/suspicious/noDebugger,
lint/suspicious/noDoubleEquals, lint/suspicious/noDuplicateCase, lint/suspicious/noDuplicateElseIf,
lint/suspicious/noDuplicateJsxProps, lint/suspicious/noEmptyBlockStatements, lint/suspicious/noEvolvingTypes,
lint/suspicious/noExplicitAny, lint/suspicious/noExtraNonNullAssertion, lint/suspicious/noFallthroughSwitchClause,
lint/suspicious/noGlobalIsNan, lint/suspicious/noImplicitAnyLet, lint/suspicious/noLabelVar,
lint/suspicious/noMisleadingInstantiator, lint/suspicious/noNonNullAssertedOptionalChain,
lint/suspicious/noPrototypeBuiltins, lint/suspicious/noSelfCompare, lint/suspicious/noShadowRestrictedNames,
lint/suspicious/noSparseArray, lint/suspicious/noTemplateCurlyInString, lint/suspicious/noTsIgnore,
lint/suspicious/noUnsafeDeclarationMerging, lint/suspicious/noUnusedExpressions, lint/suspicious/noUselessEscapeInString,
lint/suspicious/noVar, lint/suspicious/useDefaultSwitchClauseLast, lint/suspicious/useGetterReturn,
lint/suspicious/useGuardForIn, lint/suspicious/useIterableCallbackReturn
```

---

## 6. 現代 TypeScript において tsc / tsgo で検出されるため不要なルール

本プロジェクトの `tsconfig.app.json` では次のコンパイラオプションが有効。

| オプション | 役割 |
|------------|------|
| `strict: true` | noImplicitAny, strictNullChecks, strictFunctionTypes 等を一括有効 |
| `noUnusedLocals: true` | 未使用のローカル変数をエラーに |
| `noUnusedParameters: true` | 未使用の引数をエラーに |
| `noFallthroughCasesInSwitch: true` | switch の fallthrough をエラーに |
| `verbatimModuleSyntax: true` | 型のみの import は `import type` を強制 |
| `erasableSyntaxOnly: true` | ランタイムに残る構文の制限（enum 等の扱いに影響） |
| `noUncheckedSideEffectImports: true` | 副作用のみの import をチェック |

この前提では、次の ESLint ルールは **tsc -b / tsgo と役割が重なり、現代の TypeScript では省略可能**とみなせる。

### 6.1 完全に重複（ESLint をオフにしてよい）

TS のコンパイラが同じ問題を検出するため、ESLint で同じ指摘を持たなくてよいルール。

| ESLint ルール | tsc/tsgo での対応 |
|---------------|-------------------|
| `no-fallthrough` | `noFallthroughCasesInSwitch: true` と同一 |
| `no-unused-vars` | `noUnusedLocals` + `noUnusedParameters` で検出（TS の方が型を考慮） |
| `unused-imports/no-unused-imports` | `noUnusedLocals` で未使用 import も検出 |
| `no-class-assign` | TS: class の再代入はコンパイルエラー |
| `no-delete-var` | TS: 変数への delete はコンパイルエラー |
| `no-global-assign` | TS: undefined/NaN 等への代入はコンパイルエラー |
| `no-invalid-regexp` | TS: 不正な正規表現リテラルはコンパイルエラー |
| `no-nonoctal-decimal-escape` | Strict Mode で禁止（TS は strict ベース） |
| `no-octal` | Strict Mode で禁止 |
| `no-octal-escape` | Strict Mode で禁止 |
| `no-shadow-restricted-names` | TS: undefined 等のシャドーイングはコンパイルエラー |
| `no-with` | TS: with 文は未対応でコンパイルエラー |
| `no-new-require` | TS: new require() は型エラー |
| `strict` | ESM では `'use strict'` 不要（TS は ESM を解釈） |
| `react/jsx-no-undef` | TS: 未定義の JSX コンポーネントは型エラー |
| `react/no-this-in-sfc` | TS: 関数コンポーネント内の `this` は型で排除可能 |

※ `no-buffer-constructor`, `no-path-concat` は Node/ESM 環境に依存するため、ブラウザ TS のみのプロジェクトではそもそも該当コードが書けない＝実質不要。

### 6.2 部分的に重複（TS を主軸にすれば ESLint は弱めてもよい）

TS でほぼ同じ指摘ができるが、ルールによっては ESLint の方が細かい場合があるもの。

| ESLint ルール | 備考 |
|---------------|------|
| `@typescript-eslint/consistent-type-imports` | `verbatimModuleSyntax: true` が type-only import を強制するため、TS だけで同じ目的を達成可能。スタイルの統一だけなら TS に任せてよい。 |
| `@typescript-eslint/no-loss-of-precision` | TS は 2^53 を超える整数リテラルの精度喪失を検出する。多くのケースで TS と重複。 |
| `@typescript-eslint/no-misused-new` | interface に `new` を使うパターンは TS が型エラーにできる。TS を主軸にするなら重複気味。 |
| `@typescript-eslint/no-unnecessary-type-constraint` | 型の制約が冗長な場合は TS の型チェックで気づきやすい。必須ではないが重複に近い。 |

### 6.3 まとめ（不要とみなせるルール数）

- **完全に不要**: 上記 6.1 の **16 ルール**（no-unused-vars, unused-imports 含む）。  
  - これらは `tsc -b` / `tsgo` を回していれば重複するため、ESLint 側で off にしてよい。
- **部分的に不要**: 6.2 の **4 ルール**。  
  - TypeScript を信頼する方針なら、これらも弱めるか off にしてよい。

**注意**: 「不要」は「tsconfig で strict + noUnusedLocals + noUnusedParameters + noFallthroughCasesInSwitch + verbatimModuleSyntax 等を有効にしている .ts/.tsx プロジェクト」を前提にしている。.js のみのファイルや、TS を緩くしているプロジェクトでは、これらの ESLint ルールは引き続き有用。

---

## 7. 再評価（Linter / Formatter の比較・網羅度）

本レポートで実施した検証（271 ルールの検出・fix 可否のツール別整理、フォーマッター吸収ルールの表の整備、Markdown の修正）を踏まえ、Linter と Formatter を**検出網羅度・fix 網羅度・速度・運用性**の観点で再評価する。

### 7.1 Linter の再評価

| 観点 | ESLint | Biome | OxLint |
|------|--------|-------|--------|
| **検出網羅度** | 221/271 (81.5%) で最高。NG 例で発火したルール数。 | 175 ユニーク（独自体系）。ESLint 271 との 1:1 対応はなし。 | 142/271 (52.4%)。ESLint 同名相当で発火した数。 |
| **fix 網羅度（本表 271 中）** | 59 ルールで fix ○（表 5.2 の実数）。`meta.fixable` を持つルールは設定上 169 あり、表は一部に限定。 | 20 ルールで fix ○。ESLint ルール名との対応付けが可能な範囲で集計。 | 78 ルールで fix ○。`oxlint --rules` の Fixable? に基づく。 |
| **速度** | 1,490ms（基準）。 | 164ms（約 9.1 倍高速）。 | 65ms（約 22.9 倍高速）。 |
| **型情報 (type-aware)** | ✅ tsconfig 参照で型活用。 | ❌ | ❌ |
| **設定・エコシステム** | 複数ファイル・プラグイン豊富。airbnb プリセット対応。 | 1 ファイル (biome.json)。プリセットは recommended 中心。 | .oxlintrc で ESLint 互換名。プラグインなし。 |

**Linter まとめ**

- **網羅度・カスタム性**: ESLint が最も高く、271 ルールの 8 割超を検出し、fix 可能ルールも多い。TypeScript 型情報を活かしたルールも使える。
- **速度と fix のバランス**: OxLint は 271 中 142 ルールで検出・78 で fix ○と、検出より fix の割合が高く、高速で「直す」用途に向く。
- **Biome**: 検出数 175・fix ○ 20 と、本比較では ESLint 基準の「271 中○個」とは直接比較しづらいが、Lint+Format 一体・設定 1 ファイル・速度で有利。

### 7.2 Formatter の再評価

| 観点 | Prettier | Biome format | OxFmt |
|------|----------|----------------|-------|
| **速度** | 267ms（基準）。 | 62ms（約 4.3 倍高速）。 | 279ms（同等）。 |
| **設定互換** | .prettierrc が事実上の標準。 | `biome migrate prettier` で .prettierrc から移行可。lineWidth / indentWidth 等で同等化可能。 | 未設定時は Prettier と異なる挙動（クォート等）。`oxfmt --migrate=prettier` または .oxfmtrc で合わせる必要あり。 |
| **同一出力の再現性** | 本プロジェクトの .prettierrc と一致。 | biome.json を揃えれば Prettier とほぼ同一。 | 設定を揃えないとクォート等で差異。 |
| **Import ソート** | ❌ 別ツール必要。 | ✅ 内蔵。 | ✅ 内蔵。 |

**Formatter まとめ**

- **速度**: Biome format が最速。OxFmt は Prettier と同程度。
- **網羅度（スタイルの一貫性）**: 三つとも indent / quotes / trailingComma 等を扱えるが、**既存の .prettierrc をそのまま反映する**のは Prettier と Biome。OxFmt は設定移行または .oxfmtrc の明示が必要。
- **運用**: Prettier 互換を維持しつつ速くしたい場合は Biome。OxFmt 単体で使う場合は、Prettier 互換を期待するなら設定の明示が前提。

### 7.3 網羅度の整理

- **検出網羅度（ESLint 271 ルールベース）**: ESLint 221 → Biome 175（別体系）→ OxLint 142。ESLint が「同じルールセットで比べたとき」最も高い。
- **fix 網羅度（5.2 表の 271 行ベース）**: 本表の実数では ESLint fix ○ 59、Biome fix ○ 20、OxLint fix ○ 78。OxLint は対応ルールのうち fix 可能な割合が高い。
- **フォーマッター吸収**: indent / quotes / semi / comma-dangle 等は 5.2 表末尾の「フォーマッター吸収」表にまとめた。これらは Linter ではなく Formatter が担当するため、Linter の「検出・fix」の網羅度からは除外して評価している。
- **TS 重複**: 5.2 表の「TS重複で無効可」○／△ は、tsc/tsgo で既に検出されるため ESLint で無効化してよいルール。これらを除いた実質の「Linter に期待する網羅度」は 271 より少なくてよい。

---

## 8. 結論

| 観点 | Winner |
|------|--------|
| **ルールの網羅性** | 🏆 ESLint（271 ルール・検出 221、プラグインで拡張可能） |
| **Lint 速度** | 🏆 OxLint（65ms / ESLint の 22.9x） |
| **Format 速度** | 🏆 Biome（62ms / Prettier の 4.3x） |
| **総合速度 (lint+format)** | 🏆 Biome（226ms / ESLint+Prettier の 7.8x） |
| **設定の簡潔さ** | 🏆 Biome（biome.json 1 ファイル） |
| **fix の多様さ（表 5.2 ベース）** | 🏆 OxLint（271 中 78 ルールで fix ○）。ESLint は fix 可能ルールの絶対数は多いが、本表上は 59。 |
| **エコシステム成熟度** | 🏆 ESLint + Prettier |
| **移行しやすさ** | 🏆 OxLint（ESLint 互換ルール名） |
| **Prettier 互換（設定そのまま）** | 🏆 Prettier / Biome（OxFmt は設定要） |

**再評価を踏まえた見解**

- **新規プロジェクト**: **Biome** が Lint+Format 一体・速度・設定の簡潔さでバランスが良い。検出ルール数は ESLint より少ないが、recommended で十分な場合に適する。
- **既存の ESLint 資産あり**: **OxLint で補完**しつつ段階移行が現実的。検出は 271 中 142 だが、fix 可能なルールが多く、CI の高速化と自動修正の両立に向く。
- **厳格な網羅性・型活用**: **ESLint** が依然として最有力。221/271 の検出と TypeScript 型情報の利用が可能。
- **Formatter のみ見る場合**: 既存の .prettierrc を変えずに使うなら **Prettier** または **Biome**（設定を揃えた場合）。**OxFmt** は速度より Prettier 互換を優先するなら、.oxfmtrc または `--migrate=prettier` での設定整備が前提。

---

## 9. TS・フォーマッターで吸収されず、Biome / OxLint のいずれか片方のみ、またはどちらにも含まれないルール

### 9.1 対象の定義

本節では、**TS で吸収されず**（「TS重複で無効可」が ○/△ でない）、かつ**フォーマッターで吸収されない**（「フォーマッター吸収」が ○ でない）ルールを、**Biome / OxLint の対応状況**で次の 3 グループに分けて扱う。

| グループ | 条件（5.2 表） | 件数 | 意味 |
|----------|----------------|------|------|
| **A. Biome のみ対応** | OxLint＝× かつ Biome fix＝○ | **5 件** | OxLint には含まれないが、Biome には同機能（fix 可能）がある。Biome に寄せる場合は Biome でカバー可能。 |
| **B. OxLint のみ対応** | OxLint＝○ かつ Biome fix＝－ | **123 件** | Biome には同機能がない（または fix なし）が、OxLint には含まれる。OxLint に寄せる場合は OxLint でカバー可能。 |
| **C. どちらにも含まれない** | OxLint＝× かつ Biome fix＝－ | **107 件** | Biome にも OxLint にも含まれない。ESLint を外すと TS/Formatter 以外ではカバーされない。 |

合計 **235 件**（271 の約 87%）が、TS・フォーマッター以外の「Linter でどうカバーするか」を考える対象となる。該当一覧は 5.2 表の「TS重複で無効可」「フォーマッター吸収」が空の行のうち、OxLint 列・Biome fix 列で上記のとおり区分できる。

### 9.2 Biome のみ対応（5 件）

OxLint には含まれず、Biome では fix 可能なルール。**ESLint をやめて Biome に寄せる場合、これらは Biome 側でカバーできる。**

| ルール | 要否 | 理由 |
|--------|------|------|
| `no-var` | **推奨** | const/let 推奨。Biome の `noVar` で代替可。 |
| `no-console` | 任意 | 本番での console 禁止。Biome で代替可。環境方針次第。 |
| `jsx-a11y/no-interactive-element-to-noninteractive-role` | **推奨** | アクセシビリティ。Biome の a11y で代替可。 |
| `jsx-a11y/no-noninteractive-element-to-interactive-role` | **推奨** | 同上。 |
| `jsx-a11y/no-noninteractive-tabindex` | **推奨** | 同上。 |

**評価**: いずれも **Biome に移行するなら ESLint で持たなくてよい**。OxLint のみに寄せる場合は、これら 5 件は OxLint でカバーされないため、別途ルール追加・レビューで補う必要がある。

### 9.3 OxLint のみ対応（123 件）

Biome には同機能がない（本表で Biome fix＝－）が、OxLint には含まれるルール。**ESLint をやめて OxLint に寄せる場合、これらは OxLint 側でカバーできる。**

代表例（カテゴリ別）:

- **@typescript-eslint**: `ban-ts-comment`, `ban-types`, `no-duplicate-enum-values`, `no-extra-non-null-assertion`, `no-non-null-asserted-optional-chain`, `no-this-alias`, `no-unsafe-declaration-merging`, `prefer-as-const`
- **import**: `import/first`, `import/no-duplicates`, `import/no-mutable-exports`
- **jsx-a11y**: `alt-text`, `anchor-has-content`, `aria-proptypes`, `role-has-required-aria-props` 等
- **react**: `jsx-boolean-value`, `jsx-curly-brace-presence`, `jsx-fragments`, `jsx-no-duplicate-props`, `jsx-no-target-blank`, `jsx-no-useless-fragment`, `jsx-pascal-case`, `no-children-prop`, `no-find-dom-node`, `self-closing-comp`, `state-in-constructor` 等
- **core**: `array-callback-return`, `arrow-body-style`, `default-case-last`, `for-direction`, `prefer-const`, `prefer-template`, `no-debugger`, `no-eval`, `no-unused-expressions`, `valid-typeof`, `yoda` 等

**評価**: **OxLint に移行するなら ESLint で持たなくてよい**。Biome のみに寄せる場合は、これら 123 件の多くは Biome に同機能がないため、Biome の推奨ルール・カスタム設定や手動レビューで補う必要がある。一覧は 5.2 表のうち OxLint＝○ かつ Biome fix＝－ の行で確認できる。

### 9.4 どちらにも含まれない（107 件）— カテゴリ別一覧と要否の評価

Biome にも OxLint にも含まれない 107 件のうち、代表的なルールをカテゴリ別に挙げ、要否を評価する。

#### @typescript-eslint（6 件）

| ルール | 要否 | 理由 |
|--------|------|------|
| `no-array-constructor` | **推奨** | `new Array()` より `[]` を推奨。TS は検出しない。 |
| `no-explicit-any` | **推奨** | `any` 禁止は TS の strict では強制されない。チーム方針で有用。 |
| `no-namespace` | 任意 | namespace 禁止。TS プロジェクトでは module が主で、なくてもよい。 |
| `no-use-before-define` | 任意 | 宣言順。TS は巻き上げを検出しない。好みで on/off。 |
| `no-var-requires` | **推奨** | CommonJS の `require()` を制限。ESM 主体なら出にくいが、残す価値あり。 |
| `triple-slash-reference` | 不要に近い | トリプルスラッシュ参照。現代 TS ではほぼ使わず、許容でよい。 |

#### import（14 件）

| ルール | 要否 | 理由 |
|--------|------|------|
| `import/export` | 任意 | モジュール境界。マルチファイル検証が必要で、単体 NG 例では発火しにくい。 |
| `import/extensions` | 任意 | 拡張子の要不要。プロジェクト方針次第。 |
| `import/named` | 任意 | 名前付き import の存在確認。TS が型で検出する部分と重複しうる。 |
| `import/newline-after-import` | 任意 | import 後の空行。スタイル寄り。Formatter で吸収していないなら有用。 |
| `import/no-absolute-path` 等（パス・モジュール系） | 任意〜推奨 | バンドラ・Node 環境に依存。`no-unresolved` は TS で代替可。 |
| `import/order` | **推奨** | import 順の統一。Biome/OxLint にない場合、ESLint で残す価値大。 |

#### jsx-a11y（6 件）

| ルール | 要否 | 理由 |
|--------|------|------|
| `control-has-associated-label` 等 | **推奨** | アクセシビリティ。Biome/OxLint の a11y は別名・別セット。ESLint で維持すると安心。 |

#### react（24 件）

| ルール | 要否 | 理由 |
|--------|------|------|
| `react/button-has-type` | **推奨** | ボタンの type 指定。React 固有で TS は検出しない。 |
| `react/destructuring-assignment` 等 | 任意 | 書き方の統一。チーム規約として有用。 |
| `react/prop-types` | 不要に近い | TypeScript 利用時は型で代替。PropTypes は不要。 |
| `react/default-props-match-prop-types` 等 | 不要に近い | PropTypes 依存。TS プロジェクトでは off でよい。 |
| `react/jsx-filename-extension` | 不要に近い | .tsx 必須等。ツール設定で済む場合が多い。 |
| `react/no-unused-prop-types` 等 | 不要に近い | TS の未使用チェックで代替可能。 |
| その他 lifecycle / 非推奨 API | 任意〜推奨 | 非推奨メソッドの禁止など、React のベストプラクティスとして残すとよい。 |

#### core（32 件）

| ルール例 | 要否 | 理由 |
|----------|------|------|
| `block-scoped-var` | 任意 | var のスコープ。本グループ（どちらにも含まれない）の core の一例。 |
| `no-param-reassign` | 任意 | 引数書き換え禁止。airbnb 系でよく使う。 |
| `camelcase` | 任意 | 命名規則。TS は検出しない。 |
| `consistent-return` | **推奨** | return の一貫性。バグ防止に有用。 |
| `no-restricted-syntax` / `no-restricted-globals` | 任意 | 禁止構文・グローバル。プロジェクトで絞り込むと有用。 |
| `no-label-var` 等 | 任意 | スコープ・ラベル。レアだが残してもよい。 |
| `no-empty-function` / `no-implied-eval` 等 | 任意 | 空関数・eval 系。セキュリティ・品質のため推奨できる。 |

### 9.5 要否のまとめ

| 評価 | 目安 | 対応 |
|------|------|------|
| **推奨（残す価値が高い）** | TS/Formatter で代替できず、かつ「どちらにも含まれない」グループのルール。 | ESLint を継続するなら **on 推奨**。Biome のみ or OxLint のみに移行する場合は、他方でカバーされないため別ルールや手動レビューで補う必要あり。 |
| **任意** | チームのスタイル・方針で決めるもの。 | 必要に応じて on/off。ESLint 依存を下げたいなら off も可。 |
| **不要に近い** | TS や PropTypes 廃止で役割が薄れたもの。 | **off にしてよい**。 |

**結論（本節の 3 グループについて）**

- **A. Biome のみ対応（5 件）**: ESLint をやめて **Biome に寄せる場合は Biome でカバー可能**。OxLint に寄せる場合はカバーされない。
- **B. OxLint のみ対応（123 件）**: ESLint をやめて **OxLint に寄せる場合は OxLint でカバー可能**。Biome に寄せる場合は同機能が無いものが多く、別途補う必要あり。
- **C. どちらにも含まれない（107 件）**: **TS でも Formatter でも Biome でも OxLint でもカバーされない**ため、厳格なポリシーや React/import のルールを維持したい場合は **ESLint がほぼ唯一の選択肢**。ESLint をやめる場合は、上記「推奨」に挙げたルール（`no-explicit-any`、`import/order`、`react/button-has-type`、`consistent-return` 等）をコードレビューや別ツールで補う必要がある。
- **不要に近い**（PropTypes 系、`triple-slash-reference`、`jsx-filename-extension` 等）は、ESLint を続ける場合でも **off にしてよい**。
