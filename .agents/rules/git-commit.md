---
trigger: always_on
description: 英語・Conventional Commits のコミットメッセージ、ブランチと PR の運用ルール
---

# Git コミット・ブランチ・PR

コミットメッセージは **英語** で書き、commitlint（`@commitlint/config-conventional` ベース、設定は `commitlint.config.ts`）に従う（`adr/0017`）。コミットはユーザーに頼まれたときだけ行う。

## 形式

```
<type>(<scope>): <subject>

<body（任意）>

<footer（任意）>
```

- **header・body ともに英語で書く。** 日本語などの非 ASCII 文字を含むと commitlint で拒否される。
- subject は命令形で、小文字で始める（`add ...`、`fix ...`。`Added` や `Add` は不可）。末尾にピリオドを付けない。header 全体で 100 文字以内。
- body には「何を」より「なぜ」を書く。
- 1 コミット 1 目的。複数のパッケージにまたがる無関係な変更は分ける。
- 破壊的変更は type の後に `!` を付け（例: `feat(avatar)!:`）、footer に `BREAKING CHANGE: <内容>` を書く。

## type

| type       | 用途                                   |
| ---------- | -------------------------------------- |
| `feat`     | 機能追加                               |
| `fix`      | バグ修正                               |
| `docs`     | ドキュメントのみの変更                 |
| `style`    | 動作に影響しない書式の変更             |
| `refactor` | 機能追加・バグ修正を伴わないコード変更 |
| `perf`     | パフォーマンス改善                     |
| `test`     | テストの追加・修正                     |
| `build`    | ビルド設定・依存関係の変更             |
| `ci`       | CI 設定の変更                          |
| `chore`    | その他の雑務                           |
| `revert`   | コミットの取り消し                     |

## scope

scope は必須ではないが、付ける場合は以下のいずれかにする（`commitlint.config.ts` がディレクトリから自動生成する）。

- コンポーネント: `packages/components/` 配下のディレクトリ名（例: `avatar`）
- パッケージ: `levis-ui`、`utils`
- アプリ: `docs`、`storybook`、`e2e`
- tooling: `tsconfig`、`vite-config`
- その他: `repo`（ルート設定）、`deps`（依存関係）、`release`（リリース）、`ai`（AGENTS.md・`.agents/`・`.claude/`）、`adr`（`adr/`）

## 例

```
feat(avatar): add delayMs to Fallback
fix(utils): treat 0 as falsy in dataAttr
test(avatar): add E2E for image load failure
build(deps): bump vite to 7.3.8
docs(ai): add component architecture rules
docs(adr): add 0018 and accept 0011
```

## ブランチと PR

`main` はブランチ保護されており、直接 push できない（`adr/0018`）。

- 作業は `main` から切ったブランチで行う。ブランチ名は `<type>/<short-description>`（例: `feat/dialog`、`fix/avatar-ssr-state`）。
- PR を作り、CI（Commit messages / Lint / Typecheck / Unit test / Build / E2E）がすべて通ってからマージする。
- マージは squash merge のみ。**PR のタイトルがそのまま `main` のコミットメッセージになる**ため、PR タイトルも commitlint の形式（英語）で書く。CI で検証される。
- PR の説明文は日本語でもよい。

## コミット時に自動で行われること（lefthook）

`pnpm install` 時に git フックが設置され、コミットのたびに以下が実行される（設定は `lefthook.yml`、`adr/0015`）。

- `pre-commit`: ステージしたファイルに `biome check --write` を実行し、自動修正したものを再ステージする。自動修正できないエラーがあればコミットは中止される。
- `commit-msg`: commitlint でメッセージを検証する。違反していればコミットは中止される。

フックで止められた場合は、原因を直してからコミットし直す。**`--no-verify` でフックを回避してはならない。**

## コミット前の確認

- フックでは型チェックとテストは行われないため、コミットの前に `pnpm typecheck` と `pnpm test` を通す。
- 公開パッケージ（`packages/**`）を変更した場合は、`pnpm changeset` で変更記録を作り、同じコミットに含める。
- メッセージだけを事前に確かめたい場合は `echo "<message>" | pnpm exec commitlint` を使う。
