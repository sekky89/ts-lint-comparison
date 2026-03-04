# ESLint NG Code Examples

`.eslintrc.cjs` で有効な全 **271 ルール** のうち **221 ルール (81.5%)** の NG コードを収録。

## ファイル構成

| File | Category | Rules |
|------|----------|-------|
| `01-typescript-eslint-ng.tsx` | @typescript-eslint/* | 16 |
| `02-core-js-variables-ng.tsx` | 変数・命名・宣言 | 15 |
| `03-core-js-best-practices-ng.tsx` | ベストプラクティス | 50+ |
| `04-core-js-style-ng.tsx` | スタイル・構文 | 25+ |
| `05-import-ng.tsx` | import/* | 8 |
| `06-react-ng.tsx` | react/* + hooks | 40+ |
| `07-jsx-a11y-ng.tsx` | jsx-a11y/* | 32 |
| `08-remaining-core-ng.tsx` | Core JS 追加分 | 25+ |
| `09-remaining-react-ng.tsx` | React 追加分 | 15+ |
| `10-remaining-import-ng.tsx` | Import 追加分 | 3 |
| `11-triple-slash-ng.tsx` | triple-slash-reference | 1 (未検出) |
| `dummy-util.ts` | ヘルパー | - |

## 検出不可の 50 ルール (理由別)

### TypeScript / Strict Mode が先に防止 (13)

| Rule | Reason |
|------|--------|
| `no-class-assign` | TS: class 宣言の再代入を禁止 |
| `no-delete-var` | TS: 変数に対する delete を禁止 |
| `no-global-assign` | TS: undefined/NaN 等への代入を禁止 |
| `no-invalid-regexp` | TS: コンパイル時に検出 |
| `no-nonoctal-decimal-escape` | Strict Mode: \8, \9 を禁止 |
| `no-octal` | Strict Mode: 0xxx リテラルを禁止 |
| `no-octal-escape` | Strict Mode: 8 進エスケープを禁止 |
| `no-shadow-restricted-names` | TS: undefined 等のシャドーイングを禁止 |
| `no-with` | Strict Mode: with 文を禁止 |
| `no-buffer-constructor` | Node.js 専用 (ブラウザ TS では不可) |
| `no-new-require` | TS: new require() を型エラーとして検出 |
| `no-path-concat` | ESM: __dirname が存在しない |
| `strict` | ESM: 'use strict' 不要 |

### ファイル/環境レベルの制約 (3)

| Rule | Reason |
|------|--------|
| `unicode-bom` | ファイル先頭に BOM が必要 |
| `no-irregular-whitespace` | 不可視文字の挿入が必要 |
| `lines-around-directive` | ESM にディレクティブなし |

### マルチファイル/モジュール構成が必要 (15)

| Rule | Reason |
|------|--------|
| `import/export` | 重複 default export |
| `import/named` | 存在しない named export の import |
| `import/no-absolute-path` | 絶対パス import (解決失敗も併発) |
| `import/no-amd` | AMD define/require 構文 |
| `import/no-cycle` | 循環参照 (2ファイル以上必要) |
| `import/no-extraneous-dependencies` | 未インストールパッケージの import |
| `import/no-import-module-exports` | import + module.exports 混在 |
| `import/no-named-as-default` | 特定モジュール構造が必要 |
| `import/no-named-as-default-member` | 同上 |
| `import/no-named-default` | 同上 |
| `import/no-relative-packages` | モノレポ構成が必要 |
| `import/no-self-import` | 自己 import |
| `import/no-unresolved` | 解決不能モジュール (TS も検出) |
| `import/no-webpack-loader-syntax` | webpack ! 構文 |
| `no-restricted-exports` | 制限対象が未設定 |

### PropTypes / createReactClass 固有 (10)

| Rule | Reason |
|------|--------|
| `react/prop-types` | TypeScript の型注釈で代替 |
| `react/no-unused-prop-types` | PropTypes 固有 |
| `react/default-props-match-prop-types` | PropTypes 固有 |
| `react/forbid-prop-types` | PropTypes 固有 |
| `react/forbid-foreign-prop-types` | PropTypes 固有 |
| `react/prefer-es6-class` | createReactClass 未使用 |
| `react/prefer-exact-props` | Flow/PropTypes 固有 |
| `react/static-property-placement` | PropTypes/defaultProps 固有 |
| `react/style-prop-object` | TS 型キャストで検出回避 |
| `react/no-this-in-sfc` | TS が `this` の型を制限 |

### パーサー/プラグインが検出しないケース (9)

| Rule | Reason |
|------|--------|
| `@typescript-eslint/triple-slash-reference` | `types` 参照が global 型のため許容 |
| `react/jsx-filename-extension` | .tsx ファイルでは JSX 許可 |
| `react/jsx-no-undef` | TS が未定義コンポーネントを検出 |
| `react/jsx-uses-vars` | ヘルパールール (NG パターンなし) |
| `react/jsx-pascal-case` | 小文字は DOM 要素扱い |
| `react/no-did-update-set-state` | プラグインの検出漏れの可能性 |
| `react/no-namespace` | JSX namespace 構文はパーサーエラー |
| `react/no-render-return-value` | ReactDOM.render 未使用 |
| `no-misleading-character-class` | 特殊 Unicode 組み合わせが必要 |
| `no-useless-backreference` | 非常に特殊な正規表現パターン |
