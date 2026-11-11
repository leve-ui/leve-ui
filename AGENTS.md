# leve-ui

Qwik 向けの Headless UI ライブラリ。pnpm workspace + Turborepo のモノレポ。

- フレームワーク: Qwik 1.x（`@builder.io/qwik`）/ Vite 7 / TypeScript 5.9
- Lint・Format: Biome（ESLint / Prettier は使わない）
- テスト: Vitest（`@builder.io/qwik/testing` の `createDOM`）/ Playwright（Storybook に対して実行）
- リリース: Changesets

## コマンド

```sh
pnpm build        # 全パッケージビルド
pnpm test         # ユニットテスト
pnpm typecheck    # 型チェック
pnpm e2e          # E2E（Storybook を 6106 番ポートで自動起動）
pnpm check:fix    # Biome（lint + format + import 整理）
pnpm storybook    # Storybook (6006)
pnpm docs         # ドキュメントサイト
pnpm changeset    # 変更記録
```

特定パッケージだけ実行する場合は `pnpm --filter @leve-ui/avatar test` のように指定する。

## ルール

以下は必ず守ること。作業を始める前に、関係するルールファイルを読むこと。

| #   | ルール                                                             | ファイル                                                                             |
| --- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| 1   | UI コンポーネントは WAI-ARIA に準拠する                            | [`.agents/rules/accessibility.md`](.agents/rules/accessibility.md)                   |
| 2   | スタイルを後から当てられるよう、パーツごとにコンポーネントを分ける | [`.agents/rules/component-architecture.md`](.agents/rules/component-architecture.md) |
| 3   | Git コミットは commitlint（Conventional Commits）に従う            | [`.agents/rules/git-commit.md`](.agents/rules/git-commit.md)                         |
| 4   | コンポーネントには必ずテストを書く                                 | [`.agents/rules/testing.md`](.agents/rules/testing.md)                               |
| 5   | プロジェクトのディレクトリ構成に従う                               | [`.agents/rules/project-structure.md`](.agents/rules/project-structure.md)           |
| 6   | issue にはラベルと Milestone を付ける                              | [`.agents/rules/issues.md`](.agents/rules/issues.md)                                 |
| 7   | Storybook は Docs の「Show code」がそのまま使える形で書く          | [`.agents/rules/storybook.md`](.agents/rules/storybook.md)                           |

### 要点

1. **WAI-ARIA**: 実装前に [APG](https://www.w3.org/WAI/ARIA/apg/patterns/) の該当パターンを確認する。ネイティブ要素を優先し、必須の `role` / `aria-*` はライブラリ側で `{...props}` の後に出力する。ID の関連付けは `useId()`。キーボード操作とフォーカス管理をすべて実装する。
2. **パーツ分割**: DOM 要素 1 つ = パーツ 1 つ = 1 ファイル（`<name>-<part>.tsx`）。`export * as Avatar from './avatar'` の namespace 形式で公開する。`class` / `style` は出力せず、全パーツに `data-leve-<name>-<part>` と `data-state` を付ける。props はすべて要素に渡し、イベントは配列で合成する。
3. **コミット**: **英語で** `<type>(<scope>): <subject>`（subject は命令形・小文字始まり）。scope は `commitlint.config.ts` がディレクトリ名から生成する。コミット時に lefthook が commitlint と Biome を自動実行する。`--no-verify` で回避しない。`main` は保護されているため、ブランチを切って PR を作り、CI を通して squash merge する（PR タイトルも英語の commitlint 形式）。公開パッケージを変えたら英語の changeset を含める（**1.0 までは `major` を使わない**。破壊的変更は `minor`）。リリース PR のマージ（＝リリースのタイミング）はユーザーが決める。npm への公開は Release ワークフローが行い、手元から publish しない。新しいパッケージの初回公開（`pnpm package:bootstrap`）はユーザーに依頼する。コミットはユーザーに頼まれたときだけ行う。
4. **テスト**: ユニットテスト（`src/<name>.test.tsx`）・ストーリー（`apps/storybook/stories/`）・E2E（`apps/e2e/tests/`）の 3 つを必ず揃える。テストを消したり弱めたりして通さない。
5. **構成**: 実装は `packages/components/<name>/` にだけ置き、`packages/core`（`@leve-ui/core`）は再エクスポートのみ。共通ロジックは `packages/utils`。新しいトップレベルのディレクトリは作る前にユーザーに確認する。
6. **Issue**: タイトルと本文は英語。`type:` ラベルを必ず 1 つ付け、`scope:` / `status:` / `size:` と Milestone（M0〜M5）を付ける。
7. **Storybook**: ストーリー 1 つにつき demo ファイル（`stories/demos/<name>/<story>.tsx`、`export default component$`）を作り、スタイルは demo の中の `useStyles$` で当てる。ストーリーは demo を描画し、同じファイルを `?raw` で `parameters.docs.source.code` に渡す。`render` に JSX を直接書かない。demo のコメントは英語。

## 人間向けの文書

- `README.md` はライブラリ利用者向け、`CONTRIBUTING.md` は Contributor 向け（どちらも英語）。開発コマンドや規約の英語版は `CONTRIBUTING.md` にある。
- 規約を変えたときは、`.agents/rules/` と `CONTRIBUTING.md` の両方を更新する（`adr/0021`）。

## スキル（作業手順）

手順の決まっている作業は、`.agents/skills/` のスキルに従う。

| スキル                                                         | 使う場面                                                 |
| -------------------------------------------------------------- | -------------------------------------------------------- |
| [`create-component`](.agents/skills/create-component/SKILL.md) | 新しいコンポーネントを追加する（雛形生成スクリプトあり） |
| [`write-tests`](.agents/skills/write-tests/SKILL.md)           | ユニットテスト・ストーリー・E2E を書く                   |
| [`write-adr`](.agents/skills/write-adr/SKILL.md)               | ADR を書く・覆す（採番スクリプトあり）                   |

スキルを自動で読み込まないエージェントは、該当する作業の前に `SKILL.md` を読むこと。

## 設計判断（ADR）

ライブラリ全体の設計判断は [`adr/`](adr/README.md) に記録している。**ADR は英語で書く。**

- 既存の方針（パッケージ構成、ビルド、公開 API の形、ツール選定など）を変える前に、`adr/README.md` の一覧から関係する ADR を読む。
- 一見不自然な実装（例: Avatar の Root に `data-state` がない、Storybook の CSR モード）は、ADR に理由が書かれていることが多い。ADR で決まっていることを、理由を確認せずに「改善」しない。
- ADR の決定を覆す場合や、新しくライブラリ全体に関わる判断をした場合は、`adr/template.md` から新しい ADR を `Proposed` で作り、ユーザーに確認する。Accepted の ADR の本文は書き換えない。

## 作業完了の条件

コードを変更したら、完了を報告する前に以下を通すこと。

1. `pnpm check:fix`
2. `pnpm typecheck`
3. `pnpm test`
4. コンポーネントの振る舞いを変えた場合は `pnpm e2e`

## このファイルについて

- `AGENTS.md` が正本。`CLAUDE.md` は `AGENTS.md` へのシンボリックリンク。
- 守るべき制約は `.agents/rules/`、作業手順は `.agents/skills/` に置く（`adr/0014`）。
  - Antigravity は `.agents/` を直接読む。Claude Code は `.claude/rules` と `.claude/skills`（それぞれ `.agents/` へのシンボリックリンク）を読む。
  - `.agents/rules/*.md` には `trigger` と `description` の frontmatter が必須（ないと Antigravity に無視される）。サブディレクトリは作らない。
  - `SKILL.md` には `name` と `description` の frontmatter を付ける。
- 編集するのは `AGENTS.md` と `.agents/` だけにする。シンボリックリンク側を実ファイルで置き換えない。
