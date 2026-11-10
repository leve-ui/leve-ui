---
trigger: always_on
description: 英語・Conventional Commits のコミットメッセージ、ブランチ・PR・リリースの運用ルール
---

# Git コミット・ブランチ・PR・リリース

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
- パッケージ: `leve-ui`、`utils`
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
- PR を作り、CI（Commit messages / Lint / Typecheck / Unit test / Build / E2E / Publish readiness）がすべて通ってからマージする。PR の本文は `.github/pull_request_template.md` に沿って書く。
- マージは squash merge のみ。**PR のタイトルがそのまま `main` のコミットメッセージになる**ため、PR タイトルも commitlint の形式（英語）で書く。CI で検証される。
- PR の説明文は日本語でもよい。

## リリース（Changesets）

npm への公開は GitHub Actions が行う（`.github/workflows/release.yml`、`adr/0019`）。**手元から `npm publish` / `pnpm publish` / `changeset publish` を実行してはならない**（新しいパッケージの初回公開を除く。下記参照）。

1. 公開パッケージ（`packages/**`）を変更する PR には、`pnpm changeset` で作った changeset を含める。changeset の要約は **英語** で書く（CHANGELOG にそのまま載るため）。
2. PR が `main` にマージされると、Release ワークフローが `chore(release): version packages` という PR（リリース PR）を作成・更新する。リリース PR には、未リリースの changeset がすべて溜まっていく。
3. リリース PR をマージすると、Release ワークフローが npm に公開し、git タグと GitHub Release を作る。**リリース PR をマージするかどうか（＝いつリリースするか）はユーザーが決める。** AI エージェントはリリース PR をマージしない。
4. `changeset version` の結果（バージョン番号や CHANGELOG）を手で書き換えない。
5. 開発は `main` だけで行い、リリース用のブランチ（`beta`・`v1` など）は作らない（`adr/0022`）。

### changeset のバージョンの上げ方（1.0 まで）

**1.0 までは `major` を使ってはならない。** Changesets では、0.x のパッケージに `major` を付けると `1.0.0` に上がってしまう（`adr/0022`）。

| 変更の種類 | 1.0 まで（0.x） | 1.0 以降 |
|---|---|---|
| 破壊的変更 | `minor` | `major` |
| 機能追加 | `minor` または `patch` | `minor` |
| バグ修正 | `patch` | `patch` |

- 1.0 のリリースはユーザーが決める。その前に Changesets のプレリリースモード（`changeset pre enter beta`）で `1.0.0-beta.x` を出す。
- `.changeset/` に `major` の changeset を見つけた場合（Contributor の PR のレビュー時など）は、`minor` に直すよう指摘する。

### 新しいパッケージの初回公開

npm の Trusted Publishing は、npm 上に存在するパッケージにしか設定できない（`adr/0020`）。新しいパッケージは、`main` にマージした後、**リリース PR をマージする前に**、**ユーザーが** `pnpm package:bootstrap @leve-ui/<name>` を実行する。AI エージェントはこのコマンドや公開を代行せず、ユーザーに依頼する。

リリース PR では「Publish readiness」チェックが、npm に存在しない公開パッケージがないかを確認する。失敗している場合はユーザーに bootstrap を依頼する。

npm に存在しない公開パッケージがある間は、Release ワークフローは公開をスキップして成功扱いで終わり、警告を表示する（`adr/0023`）。これは異常ではない。

## コミット時に自動で行われること（lefthook）

`pnpm install` 時に git フックが設置され、コミットのたびに以下が実行される（設定は `lefthook.yml`、`adr/0015`）。

- `pre-commit`: ステージしたファイルに `biome check --write` を実行し、自動修正したものを再ステージする。自動修正できないエラーがあればコミットは中止される。
- `commit-msg`: commitlint でメッセージを検証する。違反していればコミットは中止される。

フックで止められた場合は、原因を直してからコミットし直す。**`--no-verify` でフックを回避してはならない。**

## コミット前の確認

- フックでは型チェックとテストは行われないため、コミットの前に `pnpm typecheck` と `pnpm test` を通す。
- 公開パッケージ（`packages/**`）を変更した場合は、`pnpm changeset` で変更記録を作り、同じコミットに含める。
- メッセージだけを事前に確かめたい場合は `echo "<message>" | pnpm exec commitlint` を使う。
