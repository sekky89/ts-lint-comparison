# Biome GritQL プラグイン（ESLint に近づける拡張）

Biome v2 の GritQL プラグインで、ESLint のルールに近いパターン検出を追加している。

- **prefer-object-spread.grit**: `Object.assign()` の使用を検出（ESLint の `prefer-object-spread` に相当）。object spread を推奨。
- **no-console-warn.grit**: `console.log` を warn で検出（ESLint の `no-console` に相当）。Biome のビルトイン `noConsole` と重複する場合は、`biome.json` の `plugins` から削除してよい。

`.grit` を追加したら `biome.json` の `plugins` 配列にパスを追加する。
