---
trigger: always_on
description: ドキュメントサイト（apps/docs）の UI を leve-ui 自身のコンポーネントで作り、足りないコンポーネントを報告するためのルール
---

# ドキュメントサイトの構築（leve-ui を使う）

ドキュメントサイト（`apps/docs`）は leve-ui の最初の利用者として作る。自分たちで使うことで、API の使いにくさや足りないコンポーネントを早く見つけるため（`adr/0032`）。

## leve-ui を使う

- サイトの UI は、**leve-ui のコンポーネントで作れるものは必ず leve-ui で作る。** 同じ役割の UI を自前で実装しない。
  - 例: Code / CSS のタブ → `Tabs`、サイドバーの開閉 → `Collapsible` / `Accordion`、テーマ切り替え → `Toggle` / `Switch`、パンくず → `Breadcrumb`、機械翻訳の注記 → `Alert`、区切り線 → `Separator`
- import は利用者と同じ公開 API（`@leve-ui/core` または `@leve-ui/<name>`）から行う。`@leve-ui/utils` やパッケージの `src` 内部を直接 import しない。
- 見た目は docs サイトのスタイル（Panda CSS）で当てる。`data-state` などの data 属性を使ってスタイルを当て、ライブラリの使い方の見本にもなるようにする。
- demo（`apps/storybook/stories/demos/`）は `storybook.md` に従い、Panda を使わない。

## ページの書き分け

- ページは英語だけで、`apps/docs/src/routes/en/` に書く。ほかの言語のページ（`src/routes/<locale>/`、git 管理外）はビルド時に生成されるので、作ったり編集したりしない（`adr/0033`）。
- 翻訳は `apps/docs/i18n/<locale>.json`（翻訳メモリ。英語の文の hash がキー）にある。訳を直すときはこの JSON の `translation` を直す。英語の文を変えると hash が変わり、その文は訳し直しになる。
- ほかのページへのリンクはロケールなしで書く（`/overview/forms/`）。MDX のリンク・サイドバー・ヘッダーが現在のロケールを付ける。TSX でリンクを書くときは `localizeHref(href, useLocale())`（`src/i18n/`）を使う。
- サイトのスタイルは論理プロパティ（`ms` / `me`、`ps` / `pe`、`borderInlineStart`、`textAlign: 'start'`）で書く。右から左に書く言語を後から足せるようにするため。

- FAQ（`overview/faq`）には、ライブラリ全体に関わる質問だけを載せる。個別のコンポーネントの仕様や理由（例: Avatar の Root に `data-state` がない理由）は、そのコンポーネントのページに書く。

## 足りないコンポーネントを報告する

ドキュメントサイトの構築中に、次のものに気づいたら、**作業の報告の中でユーザーに必ず伝える。** 黙って自前で実装して済ませない。

- leve-ui にまだないが、サイトに必要なコンポーネント（例: Dialog、Popover、Menu、Select、Tooltip、Toast など）
- 既存のコンポーネントの不具合や、足りない機能・props、使いにくい API

報告には以下を含める。

| 項目 | 内容 |
| --- | --- |
| コンポーネント | 名前と、対応する APG パターン（あれば） |
| 使いたい場所 | ドキュメントサイトのどこで、何のために必要か |
| 既存の issue | あれば番号。なければ「なし」 |
| 当面の対応 | 下記の暫定実装をしたか、その機能を後回しにしたか |

- issue の作成は、ユーザーの了承を得てから `issues.md` に従って行う。既存の issue がある場合は、ドキュメントサイトでの用途をコメントで追記してよいか確認する。

## 暫定実装

足りないコンポーネントのせいで作業が止まる場合だけ、暫定実装をしてよい。

- ネイティブ要素（`<details>`、`<dialog>`、`<select>` など）を優先し、最小限にとどめる。
- 置き換える箇所が分かるよう、コメントを付ける: `// TODO(leve-ui): replace with <Name> (#<issue>)`
- コンポーネントがリリースされたら、暫定実装を leve-ui に置き換える。
