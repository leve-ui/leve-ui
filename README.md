# levis-ui

Headless, WAI-ARIA compliant UI components for Qwik. Bring your own styles.

Qwik 向けの Headless UI ライブラリ（pnpm workspace + Turborepo のモノレポ）。

## 構成

| パス                    | パッケージ名            | 公開 | 内容                                             |
| ----------------------- | ----------------------- | ---- | ------------------------------------------------ |
| `packages/levis-ui`     | `levis-ui`              | ✅   | 全部入り。`@levis-ui/*` を再エクスポートするだけ |
| `packages/components/*` | `@levis-ui/<name>`      | ✅   | 個別コンポーネント（例: `@levis-ui/avatar`）     |
| `packages/utils`        | `@levis-ui/utils`       | ✅   | コンポーネント間で共有する内部ユーティリティ     |
| `apps/docs`             | `@levis-ui/docs`        | -    | ドキュメントサイト（Qwik City）                  |
| `apps/storybook`        | `@levis-ui/storybook`   | -    | Storybook                                        |
| `apps/e2e`              | `@levis-ui/e2e`         | -    | Playwright（Storybook に対して実行）             |
| `tooling/tsconfig`      | `@levis-ui/tsconfig`    | -    | 共通 tsconfig                                    |
| `tooling/vite-config`   | `@levis-ui/vite-config` | -    | ライブラリ用 Vite 設定・ソース解決設定           |

## コマンド

```sh
pnpm install
pnpm build        # 全パッケージをビルド（turbo）
pnpm test         # ユニットテスト（vitest）
pnpm typecheck    # 型チェック
pnpm e2e          # E2E（初回は pnpm --filter @levis-ui/e2e exec playwright install chromium）
pnpm storybook    # Storybook (http://localhost:6006)
pnpm docs         # ドキュメントサイト
pnpm check:fix    # Biome（lint + format + import 整理）
pnpm changeset    # リリース用の変更記録
pnpm component:new <name> <part,...>  # コンポーネントの雛形を生成
pnpm adr:new "<English title>"        # ADR の雛形を生成
```

## Git フック

`pnpm install` 時に [lefthook](https://lefthook.dev) が git フックを設置します。コミット時に、ステージしたファイルへの Biome（自動修正）と、commitlint によるメッセージ検証が実行されます。

## CI とブランチ運用

- PR と `main` への push で GitHub Actions の CI が実行されます（コミットメッセージ・PR タイトル・Lint・型チェック・ユニットテスト・ビルド・E2E）。
- `main` はブランチ保護されています。ブランチを切って PR を作り、CI が通ったら squash merge してください。
- コミットメッセージと PR タイトルは英語で、Conventional Commits の形式で書きます。

## 開発時のソース解決

各ライブラリの `exports` には `@levis-ui/source` 条件で `src/index.ts` を指定しています。
docs / storybook はこの条件で解決するため、ライブラリをビルドしなくても変更が即座に反映されます。
npm 利用者側ではこの条件は使われず、`lib/` のビルド成果物が読み込まれます。

## 新しいコンポーネントの追加

手順は `.agents/rules/project-structure.md` を参照してください。設計・テスト・コミットのルールも `.agents/rules/` にまとめています（AI エージェント向けの入口は `AGENTS.md`）。

## 設計判断

ライブラリ全体に関わる設計判断は [`adr/`](adr/README.md) に ADR として記録しています。
