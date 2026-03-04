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

### 5.2 全 271 ルールの検出状況（ESLint / OxLint）

○＝検出、×＝未検出。備考は ESLint 未検出時の主な理由。**TS重複で無効可**: ○＝tsc/tsgo で検出されるため無効化可、△＝部分的に重複。

| ESLint ルール | ESLint | OxLint | TS重複で無効可 | 備考（未検出時） |
| --- | --- | --- | --- | --- |
| @typescript-eslint/ban-ts-comment | ○ | ○ |  |  |
| @typescript-eslint/ban-types | ○ | ○ |  |  |
| @typescript-eslint/consistent-type-imports | ○ | ○ | △ |  |
| @typescript-eslint/no-array-constructor | ○ | × |  |  |
| @typescript-eslint/no-duplicate-enum-values | ○ | ○ |  |  |
| @typescript-eslint/no-explicit-any | ○ | × |  |  |
| @typescript-eslint/no-extra-non-null-assertion | ○ | ○ |  |  |
| @typescript-eslint/no-loss-of-precision | ○ | × | △ |  |
| @typescript-eslint/no-misused-new | ○ | ○ | △ |  |
| @typescript-eslint/no-namespace | ○ | × |  |  |
| @typescript-eslint/no-non-null-asserted-optional-chain | ○ | ○ |  |  |
| @typescript-eslint/no-this-alias | ○ | ○ |  |  |
| @typescript-eslint/no-unnecessary-type-constraint | ○ | ○ | △ |  |
| @typescript-eslint/no-unsafe-declaration-merging | ○ | ○ |  |  |
| @typescript-eslint/no-use-before-define | ○ | × |  |  |
| @typescript-eslint/no-var-requires | ○ | × |  |  |
| @typescript-eslint/prefer-as-const | ○ | ○ |  |  |
| @typescript-eslint/triple-slash-reference | × | × |  | 許容 |
| array-callback-return | ○ | ○ |  |  |
| arrow-body-style | ○ | ○ |  |  |
| block-scoped-var | ○ | × |  |  |
| camelcase | ○ | × |  |  |
| class-methods-use-this | ○ | × |  |  |
| consistent-return | ○ | × |  |  |
| default-case | ○ | × |  |  |
| default-case-last | ○ | ○ |  |  |
| default-param-last | ○ | ○ |  |  |
| dot-notation | ○ | × |  |  |
| eqeqeq | ○ | ○ |  |  |
| for-direction | ○ | ○ |  |  |
| func-names | ○ | ○ |  |  |
| global-require | ○ | × |  |  |
| grouped-accessor-pairs | ○ | ○ |  |  |
| guard-for-in | ○ | ○ |  |  |
| import/export | × | × |  | マルチファイル |
| import/extensions | ○ | × |  |  |
| import/first | ○ | ○ |  |  |
| import/named | × | × |  | マルチファイル |
| import/newline-after-import | ○ | × |  |  | |
| import/no-absolute-path | × | × |  | マルチファイル |
| import/no-amd | × | × |  | AMD |
| import/no-cycle | × | × |  | 循環参照 |
| import/no-duplicates | ○ | ○ |  |  | |
| import/no-dynamic-require | ○ | × |  |  | |
| import/no-extraneous-dependencies | × | × |  | マルチファイル |
| import/no-import-module-exports | × | × |  | 混在 |
| import/no-mutable-exports | ○ | ○ |  |  | |
| import/no-named-as-default | × | × |  | モジュール構造 |
| import/no-named-as-default-member | × | × |  | 同上 |
| import/no-named-default | × | × |  | 同上 |
| import/no-relative-packages | × | × |  | モノレポ |
| import/no-self-import | × | × |  | 自己import |
| import/no-unresolved | × | × |  | 解決不能 |
| import/no-useless-path-segments | ○ | × |  |  |
| import/no-webpack-loader-syntax | × | × |  | webpack |
| import/order | ○ | × |  |  |
| jsx-a11y/alt-text | ○ | ○ |  |  | |
| jsx-a11y/anchor-has-content | ○ | ○ |  |  | |
| jsx-a11y/anchor-is-valid | ○ | ○ |  |  | |
| jsx-a11y/aria-activedescendant-has-tabindex | ○ | ○ |  |  | |
| jsx-a11y/aria-props | ○ | ○ |  |  | |
| jsx-a11y/aria-proptypes | ○ | ○ |  |  | |
| jsx-a11y/aria-role | ○ | ○ |  |  | |
| jsx-a11y/aria-unsupported-elements | ○ | ○ |  |  | |
| jsx-a11y/click-events-have-key-events | ○ | ○ |  |  | |
| jsx-a11y/control-has-associated-label | ○ | × |  |  | |
| jsx-a11y/heading-has-content | ○ | ○ |  |  | |
| jsx-a11y/html-has-lang | ○ | ○ |  |  | |
| jsx-a11y/iframe-has-title | ○ | ○ |  |  | |
| jsx-a11y/img-redundant-alt | ○ | ○ |  |  | |
| jsx-a11y/interactive-supports-focus | ○ | × |  |  | |
| jsx-a11y/label-has-associated-control | ○ | ○ |  |  | |
| jsx-a11y/lang | ○ | ○ |  |  | |
| jsx-a11y/media-has-caption | ○ | ○ |  |  | |
| jsx-a11y/mouse-events-have-key-events | ○ | ○ |  |  | |
| jsx-a11y/no-access-key | ○ | ○ |  |  | |
| jsx-a11y/no-autofocus | ○ | ○ |  |  | |
| jsx-a11y/no-distracting-elements | ○ | ○ |  |  | |
| jsx-a11y/no-interactive-element-to-noninteractive-role | ○ | × |  |  | |
| jsx-a11y/no-noninteractive-element-interactions | ○ | × |  |  | |
| jsx-a11y/no-noninteractive-element-to-interactive-role | ○ | × |  |  | |
| jsx-a11y/no-noninteractive-tabindex | ○ | × |  |  | |
| jsx-a11y/no-redundant-roles | ○ | ○ |  |  | |
| jsx-a11y/no-static-element-interactions | ○ | ○ |  |  | |
| jsx-a11y/role-has-required-aria-props | ○ | ○ |  |  | |
| jsx-a11y/role-supports-aria-props | ○ | ○ |  |  | |
| jsx-a11y/scope | ○ | ○ |  |  | |
| jsx-a11y/tabindex-no-positive | ○ | ○ |  |  | |
| lines-around-directive | × | × |  | ESM |
| lines-between-class-members | ○ | × |  |  | |
| max-classes-per-file | ○ | ○ |  |  | |
| new-cap | ○ | ○ |  |  | |
| no-alert | ○ | × |  |  | |
| no-async-promise-executor | ○ | ○ |  |  | |
| no-await-in-loop | ○ | × |  |  | |
| no-bitwise | ○ | × |  |  | |
| no-buffer-constructor | × | × | ○ | Node専用 |
| no-caller | ○ | ○ |  |  | |
| no-case-declarations | ○ | ○ |  |  | |
| no-class-assign | × | × | ○ | TSが先に防止 |
| no-compare-neg-zero | ○ | ○ |  |  | |
| no-cond-assign | ○ | × |  |  | |
| no-console | ○ | × |  |  | |
| no-constant-condition | ○ | ○ |  |  | |
| no-constructor-return | ○ | ○ |  |  | |
| no-continue | ○ | ○ |  |  | |
| no-control-regex | ○ | ○ |  |  | |
| no-debugger | ○ | ○ |  |  | |
| no-delete-var | × | × | ○ | TSが先に防止 |
| no-dupe-else-if | ○ | ○ |  |  | |
| no-duplicate-case | ○ | ○ |  |  | |
| no-else-return | ○ | ○ |  |  | |
| no-empty | ○ | × |  |  | |
| no-empty-character-class | ○ | ○ |  |  | |
| no-empty-function | ○ | × |  |  | |
| no-empty-pattern | ○ | ○ |  |  | |
| no-eval | ○ | ○ |  |  | |
| no-ex-assign | ○ | ○ |  |  | |
| no-extend-native | ○ | ○ |  |  | |
| no-extra-bind | ○ | ○ |  |  | |
| no-extra-boolean-cast | ○ | ○ |  |  | |
| no-extra-label | ○ | ○ |  |  | |
| no-fallthrough | ○ | ○ | ○ |  |
| no-global-assign | × | × | ○ | TSが先に防止 |
| no-implied-eval | ○ | × |  |  | |
| no-inner-declarations | ○ | ○ |  |  | |
| no-invalid-regexp | × | × | ○ | TSが先に防止 |
| no-irregular-whitespace | × | × |  | 不可視文字 |
| no-iterator | ○ | ○ |  |  | |
| no-label-var | ○ | × |  |  | |
| no-labels | ○ | ○ |  |  | |
| no-lone-blocks | ○ | ○ |  |  | |
| no-lonely-if | ○ | ○ |  |  | |
| no-loop-func | ○ | ○ |  |  | |
| no-misleading-character-class | × | × |  | 特殊Unicode |
| no-multi-assign | ○ | × |  |  | |
| no-multi-str | ○ | ○ |  |  | |
| no-nested-ternary | ○ | ○ |  |  | |
| no-new | ○ | ○ |  |  | |
| no-new-func | ○ | ○ |  |  | |
| no-new-object | ○ | × |  |  | |
| no-new-require | × | × | ○ | TSが先に防止 |
| no-new-wrappers | ○ | ○ |  |  | |
| no-nonoctal-decimal-escape | × | × | ○ | Strict Mode |
| no-octal | × | × | ○ | Strict Mode |
| no-octal-escape | × | × | ○ | Strict Mode |
| no-param-reassign | ○ | × |  |  | |
| no-path-concat | × | × | ○ | ESM |
| no-plusplus | ○ | × |  |  | |
| no-promise-executor-return | ○ | ○ |  |  | |
| no-proto | ○ | × |  |  | |
| no-prototype-builtins | ○ | ○ |  |  | |
| no-regex-spaces | ○ | × |  |  | |
| no-restricted-exports | × | × |  | 未設定 |
| no-restricted-globals | ○ | × |  |  | |
| no-restricted-properties | ○ | × |  |  | |
| no-restricted-syntax | ○ | × |  |  | |
| no-return-assign | ○ | × |  |  | |
| no-return-await | ○ | × |  |  | |
| no-script-url | ○ | ○ |  |  | |
| no-self-assign | ○ | ○ |  |  | |
| no-self-compare | ○ | ○ |  |  | |
| no-sequences | ○ | × |  |  | |
| no-shadow | ○ | × |  |  | |
| no-shadow-restricted-names | × | × | ○ | TSが先に防止 |
| no-sparse-arrays | ○ | ○ |  |  | |
| no-template-curly-in-string | ○ | ○ |  |  | |
| no-throw-literal | ○ | ○ |  |  | |
| no-undef-init | ○ | × |  |  | |
| no-underscore-dangle | ○ | × |  |  | |
| no-unneeded-ternary | ○ | ○ |  |  | |
| no-unreachable-loop | ○ | × |  |  | |
| no-unsafe-finally | ○ | ○ |  |  | |
| no-unsafe-optional-chaining | ○ | × |  |  | |
| no-unused-expressions | ○ | ○ |  |  | |
| no-unused-labels | ○ | ○ |  |  | |
| no-useless-backreference | × | × |  | 特殊正規表現 |
| no-useless-catch | ○ | ○ |  |  | |
| no-useless-computed-key | ○ | ○ |  |  | |
| no-useless-concat | ○ | ○ |  |  | |
| no-useless-constructor | ○ | ○ |  |  | |
| no-useless-escape | ○ | ○ |  |  | |
| no-useless-rename | ○ | ○ |  |  | |
| no-useless-return | ○ | ○ |  |  | |
| no-var | ○ | × |  |  | |
| no-void | ○ | × |  |  | |
| no-with | × | × | ○ | Strict Mode |
| object-shorthand | ○ | × |  |  | |
| one-var | ○ | × |  |  | |
| operator-assignment | ○ | ○ |  |  | |
| prefer-arrow-callback | ○ | × |  |  | |
| prefer-const | ○ | ○ |  |  | |
| prefer-destructuring | ○ | ○ |  |  | |
| prefer-exponentiation-operator | ○ | ○ |  |  | |
| prefer-numeric-literals | ○ | ○ |  |  | |
| prefer-object-spread | ○ | ○ |  |  | |
| prefer-promise-reject-errors | ○ | ○ |  |  | |
| prefer-regex-literals | ○ | × |  |  | |
| prefer-rest-params | ○ | ○ |  |  | |
| prefer-spread | ○ | ○ |  |  | |
| prefer-template | ○ | ○ |  |  | |
| radix | ○ | ○ |  |  | |
| react-hooks/exhaustive-deps | ○ | ○ |  |  | |
| react-hooks/rules-of-hooks | ○ | ○ |  |  | |
| react/button-has-type | ○ | × |  |  | |
| react/default-props-match-prop-types | × | × |  | PropTypes |
| react/destructuring-assignment | ○ | × |  |  | |
| react/forbid-foreign-prop-types | × | × |  | PropTypes |
| react/forbid-prop-types | × | × |  | PropTypes |
| react/function-component-definition | ○ | × |  |  | |
| react/jsx-boolean-value | ○ | ○ |  |  | |
| react/jsx-curly-brace-presence | ○ | ○ |  |  | |
| react/jsx-filename-extension | × | × |  | .tsx |
| react/jsx-fragments | ○ | ○ |  |  | |
| react/jsx-no-bind | ○ | × |  |  | |
| react/jsx-no-comment-textnodes | ○ | ○ |  |  | |
| react/jsx-no-constructed-context-values | ○ | × |  |  | |
| react/jsx-no-duplicate-props | ○ | ○ |  |  | |
| react/jsx-no-script-url | ○ | ○ |  |  | |
| react/jsx-no-target-blank | ○ | ○ |  |  | |
| react/jsx-no-undef | × | × | ○ | TSが検出 |
| react/jsx-no-useless-fragment | ○ | ○ |  |  | |
| react/jsx-pascal-case | ○ | ○ |  |  | |
| react/jsx-props-no-spreading | ○ | ○ |  |  | |
| react/jsx-uses-vars | × | × |  | ヘルパー |
| react/no-access-state-in-setstate | ○ | × |  |  | |
| react/no-array-index-key | ○ | × |  |  | |
| react/no-arrow-function-lifecycle | ○ | × |  |  | |
| react/no-children-prop | ○ | ○ |  |  | |
| react/no-danger | ○ | × |  |  | |
| react/no-danger-with-children | ○ | ○ |  |  | |
| react/no-deprecated | ○ | × |  |  | |
| react/no-did-update-set-state | × | × |  | 検出漏れ |
| react/no-find-dom-node | ○ | ○ |  |  | |
| react/no-invalid-html-attribute | ○ | × |  |  | |
| react/no-is-mounted | ○ | ○ |  |  | |
| react/no-namespace | × | × |  | パーサー |
| react/no-redundant-should-component-update | ○ | ○ |  |  | |
| react/no-render-return-value | × | × |  | 未使用 |
| react/no-string-refs | ○ | ○ |  |  | |
| react/no-this-in-sfc | × | × | ○ | TS |
| react/no-typos | ○ | × |  |  | |
| react/no-unescaped-entities | ○ | ○ |  |  | |
| react/no-unknown-property | ○ | × |  |  | |
| react/no-unstable-nested-components | ○ | × |  |  | |
| react/no-unused-class-component-methods | ○ | × |  |  | |
| react/no-unused-prop-types | × | × |  | PropTypes |
| react/no-unused-state | ○ | × |  |  | |
| react/no-will-update-set-state | ○ | ○ |  |  | |
| react/prefer-es6-class | × | × |  | createReactClass |
| react/prefer-exact-props | × | × |  | Flow/PropTypes |
| react/prefer-stateless-function | ○ | × |  |  | |
| react/prop-types | × | × |  | TSで代替 |
| react/require-render-return | ○ | × |  |  | |
| react/self-closing-comp | ○ | ○ |  |  | |
| react/sort-comp | ○ | × |  |  | |
| react/state-in-constructor | ○ | ○ |  |  | |
| react/static-property-placement | × | × |  | PropTypes |
| react/style-prop-object | × | × |  | TSで回避 |
| react/void-dom-elements-no-children | ○ | ○ |  |  | |
| require-yield | ○ | ○ |  |  | |
| sort-imports | ○ | ○ |  |  | |
| spaced-comment | ○ | × |  |  | |
| strict | × | × | ○ | ESM |
| symbol-description | ○ | × |  |  | |
| unicode-bom | × | × |  | BOM必要 |
| unused-imports/no-unused-imports | ○ | × | ○ |  |
| use-isnan | ○ | ○ |  |  | |
| valid-typeof | ○ | ○ |  |  | |
| vars-on-top | ○ | ○ |  |  | |
| yoda | ○ | ○ |  |  | |

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

## 7. 結論

| 観点 | Winner |
|------|--------|
| **ルールの網羅性** | 🏆 ESLint（271 ルール + プラグイン無限拡張） |
| **Lint 速度** | 🏆 OxLint（16ms / ESLint の 22.9x） |
| **Format 速度** | 🏆 Biome（62ms / Prettier の 4.3x） |
| **総合速度 (lint+format)** | 🏆 Biome（226ms / ESLint+Prettier の 7.8x） |
| **設定の簡潔さ** | 🏆 Biome（biome.json 1 ファイル） |
| **エコシステム成熟度** | 🏆 ESLint + Prettier |
| **移行しやすさ** | 🏆 OxLint（ESLint 互換ルール名） |

**個人的見解**: 新規プロジェクトなら **Biome** が総合的にバランス良し。既存の ESLint 資産があるなら **OxLint で補完**しつつ段階移行がベスト。フルカスタム lint が必要なら **ESLint** は依然として唯一の選択肢。
