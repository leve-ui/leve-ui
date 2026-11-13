---
name: create-component
description: leve-ui に新しい headless UI コンポーネント（@leve-ui/<name> パッケージ）を追加する手順。Dialog・Tabs・Accordion などの新規コンポーネントを作るとき、またはパッケージの雛形を作るときに使う。雛形生成スクリプト・@leve-ui/core への登録・APG に沿った実装・テスト 3 点の作成までを扱う。
---

# 新しいコンポーネントを作成する

## 1. 仕様を決める（コードを書く前に）

1. [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) から対応するパターンを特定し、以下を書き出す。
   - パーツの一覧（DOM 要素 1 つ = パーツ 1 つ）と、それぞれの要素・`role`・`aria-*`
   - キーボード操作の一覧
   - フォーカス管理（初期フォーカス、復帰、トラップ、ロービングタブインデックス）
   - 状態（`data-state` の値）と、制御/非制御に対応する props（`adr/0011` を参照）
2. 書き出した仕様をユーザーに提示し、パーツ構成に合意してから次に進む。

## 2. 雛形を生成する

```sh
node .agents/skills/create-component/scripts/scaffold.mjs <name> <part,part,...>
# 例: node .agents/skills/create-component/scripts/scaffold.mjs dialog trigger,overlay,content,title,description,close
pnpm install
```

- `<name>` と `part` は kebab-case。`root` は自動で生成されるので指定しない。
- スクリプトは次のことを行う。
  - `packages/components/<name>/` にパッケージ一式を生成する（設定ファイル、Context、パーツ、`index.ts`、ユニットテスト）
  - `package.json` に `license: "MIT"`・`repository`・`homepage`・`bugs` を設定し、ルートの `LICENSE` をコピーする
  - `apps/storybook/stories/<name>.stories.tsx` と demo（`apps/storybook/stories/demos/<name>/default.tsx` と `default.css`）、`apps/e2e/tests/<name>.spec.ts` を生成する
  - `packages/core`（`@leve-ui/core`）の `dependencies` と `src/index.ts`、`apps/storybook` の `devDependencies` に登録する
  - `README.md` の Packages 表に行を追加する（説明文は `TODO` になっているので、英語の 1 行説明に書き換える）

## 3. 実装する

`.agents/rules/accessibility.md` と `.agents/rules/component-architecture.md` に従う。見本は `packages/components/avatar`。

- 雛形の `TODO`（README の Packages 表、demo のスタイルを含む）をすべて解消する。要素は仮で `div` になっているので、APG に合わせて変える（`button`、`h2` など）。
- `<name>-context.ts` に共有する状態を定義し、Root で `useContextProvider` する。
- 必須の `role` / `aria-*` / `data-state` は `{...props}` の後に書く。イベントは `[internal$, props.onXxx$]` で合成する。
- パーツ間の ID 関連付けは `useId()`。2 つ以上のコンポーネントで使うロジックは `packages/utils` に置く。

## 4. テストを書く

`write-tests` スキルに従い、雛形のテストを仕様に合わせて拡充する。

- ユニットテスト: `packages/components/<name>/src/<name>.test.tsx`
- ストーリー: 状態ごとに追加する（Default / Disabled / Open など）
- E2E: APG のキーボード操作を 1 つずつテストする

## 5. docs のページを書く

`adr/0032` のテンプレートで、`apps/docs/src/routes/(docs)/components/<name>/index.mdx` を作る。見本は `components/avatar/index.mdx` と `components/checkbox/index.mdx`。

- タイトルと 1 行の説明、APG パターンへのリンク（ない場合は採用したネイティブ要素の方針）
- `<Demo id="<name>/default" />`、Installation（`@leve-ui/core` と `@leve-ui/<name>`）、Anatomy（パーツの一覧と描画する要素）
- Examples: Storybook の demo（default 以外）ごとに `###` と `<Demo id="<name>/<story>" collapsed />`
- API Reference: パーツごとに `<PropsTable component="<name>" part="<Part>" />` と、手書きの data 属性・CSS 変数の表（props の説明は JSDoc から生成されるので、公開 props には英語の JSDoc と `@default` を書く）
- Accessibility: 準拠するパターン、出力する `role` / `aria-*`、実装したキー操作の表
- `apps/docs/src/docs-nav.ts` と `components/index.mdx` の一覧に追加する
- 書く内容はソースと一致させる（存在しない props やキー操作を書かない）

## 6. 仕上げ

```sh
pnpm check:fix
pnpm typecheck
pnpm test
pnpm e2e
pnpm changeset   # minor で @leve-ui/<name> と @leve-ui/core を選び、要約は英語で書く（1.0 までは major を使わない）
```

ライブラリ全体に関わる判断をした場合（新しい共通ユーティリティの方針など）は、`write-adr` スキルで ADR を書く。

## 7. 初回公開（ユーザーが行う）

npm の Trusted Publishing は npm 上に存在するパッケージにしか設定できないため、新しいパッケージは最初の 1 回だけ手元から公開する（`adr/0020`）。**AI エージェントは実行せず、PR のマージ後にユーザーへ以下を伝える。**

```sh
git switch main && git pull
npm login
pnpm package:bootstrap @leve-ui/<name>   # --dry-run で実行内容を確認できる
```

- ビルド → `0.0.0` の公開 → Trusted Publisher（`release.yml`）の登録 → 2FA 必須化、までをまとめて行う。
- **リリース PR をマージする前に** 実行する必要がある。未実行の場合、リリース PR の「Publish readiness」チェックが失敗して知らせる。
- 以降のバージョンは、リリース PR のマージで自動的に公開される。
