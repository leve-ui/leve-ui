---
trigger: always_on
description: commitlint（Conventional Commits）に従ったコミットメッセージのルール
---

# Git コミット

コミットメッセージは commitlint（`@commitlint/config-conventional` ベース、設定は `commitlint.config.ts`）に従う。コミットはユーザーに頼まれたときだけ行う。

## 形式

```
<type>(<scope>): <subject>

<body（任意）>

<footer（任意）>
```

- subject は日本語でよい。末尾に句点を付けない。header 全体で 100 文字以内。
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
feat(avatar): Fallback に delayMs を追加
fix(utils): dataAttr が 0 を true と判定する問題を修正
test(avatar): 画像読み込み失敗時の E2E を追加
build(deps): vite を 7.3.8 に更新
docs(ai): コンポーネント設計ルールを追加
docs(adr): 0014 を追加し 0011 を Accepted に変更
```

## コミット時に自動で行われること（lefthook）

`pnpm install` 時に git フックが設置され、コミットのたびに以下が実行される（設定は `lefthook.yml`、`adr/0015`）。

- `pre-commit`: ステージしたファイルに `biome check --write` を実行し、自動修正したものを再ステージする。自動修正できないエラーがあればコミットは中止される。
- `commit-msg`: commitlint でメッセージを検証する。違反していればコミットは中止される。

フックで止められた場合は、原因を直してからコミットし直す。**`--no-verify` でフックを回避してはならない。**

## コミット前の確認

- フックでは型チェックとテストは行われないため、コミットの前に `pnpm typecheck` と `pnpm test` を通す。
- 公開パッケージ（`packages/**`）を変更した場合は、`pnpm changeset` で変更記録を作り、同じコミットに含める。
- メッセージだけを事前に確かめたい場合は `echo "<message>" | pnpm exec commitlint` を使う。
