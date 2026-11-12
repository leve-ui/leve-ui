---
trigger: always_on
description: Storybook のストーリーを、Docs の「Show code」がそのまま使えるコードになるように書くためのルール
---

# Storybook のストーリー

Storybook は全コンポーネントの Docs ページを自動生成する（`.storybook/preview.ts` の `tags: ['autodocs']`）。Docs の「Show code」は、利用者がそのままコピーして使うコードになる。demo は docs サイトのコンポーネントページでもそのまま描画され、TSX と CSS がタブで表示される（`adr/0031`）。**スタイルを含めて丸ごと見える**よう、ストーリーは必ず次の形で書く。

## 構成

```
apps/storybook/stories/
├── <name>.stories.tsx           # demo を描画し、そのソースを Show code に渡すだけ
├── source.ts                    # demoSource()：TSX と CSS のソースを Show code 用に連結する
└── demos/<name>/
    ├── <story>.tsx              # ストーリー 1 つにつき 1 ファイル（<story> は export 名の kebab-case）
    └── <story>.css              # その demo のスタイル
```

## demo ファイル

```tsx
// apps/storybook/stories/demos/progress/default.tsx
import { component$, useStyles$ } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Progress.Root value={40} class="progress-default">
      <Progress.Label>Uploading</Progress.Label>
      <Progress.Track class="progress-default-track">
        <Progress.Indicator class="progress-default-indicator" />
      </Progress.Track>
    </Progress.Root>
  );
});
```

```css
/* apps/storybook/stories/demos/progress/default.css */
.progress-default-track {
  height: 0.5rem;
  background: light-dark(#e2e8f0, #ffffff1f);
}

/* Percentage of the Root value, set by the library */
.progress-default-indicator {
  height: 100%;
  width: var(--leve-progress-percent);
  background: #009dfd;
}
```

- `export default component$(...)` で、**利用者が書くコードと同じ形**にする。import はパッケージ名（`@leve-ui/<name>`）から行う。
- **スタイルは同じ名前の `<story>.css` に書く。** demo では `import styles from './<story>.css?inline';` で読み込み、コンポーネントの中で `useStyles$(styles)` する。スタイルがない demo は CSS ファイルを作らなくてよい。
- 見た目は `class` で当てる。**クラス名は `<component>-<story>` で始める**（例: `.progress-default-track`。要素がコンポーネントそのものなら `.progress-default`）。`useStyles$` の CSS はページ全体に効き、Docs では複数の demo が同じページに並ぶため、demo 名まで含めないと衝突する。
- `@keyframes` や `[data-state="..."]` などの属性セレクタも CSS に書く。ライブラリが出す data 属性・CSS 変数の使い方の例にもなる。
- 状態を持つ例（`useSignal` など）も、demo の中でフックを使って書く（ストーリーの `render` はコンポーネントとして実行されず、フックを使えないため）。
- demo は利用者が読むので、**コメント（CSS のコメントを含む）は英語**で書く。
- 同じコンポーネントの demo 同士で CSS が重複してもよい。demo 1 つ（TSX と CSS）を単体でコピーして動くことを優先する。
- **demo で使ってよい外部パッケージは `@qwikest/icons` だけ。** アイコンは SVG を直書きせず `@qwikest/icons/lucide` の Lucide アイコンを使い（docs サイトと同じアイコンにするため）、装飾なので必ず `aria-hidden="true"` を付ける。大きさは CSS の `width` / `height` で決める。

## demo の見た目（`adr/0031`、#95）

demo は docs サイトのライト／ダークの両テーマに置かれ、利用者がそのままコピーする。見た目を揃えるため、次の値だけを使う（デザインは `apps/docs/design/leve-ui-docs.pen` の「Demo style guide」）。

| 用途 | 値 |
| --- | --- |
| アクセント（checked・選択中・押下中・フォーカス） | `#009dfd`（hover は `#006ce9`） |
| アクセントの文字（リンクなど） | `light-dark(#006ce9, #4cb8ff)` |
| 背景（コントロール・パネル） | `light-dark(#ffffff, #1b2045)` |
| 控えめな背景（hover・補助のパネル） | `light-dark(#f1f5f9, #ffffff14)` |
| トラック（Progress・Meter の地） | `light-dark(#e2e8f0, #ffffff1f)` |
| 枠線・オフのスイッチ | `light-dark(#cbd5e1, #ffffff3d)` |
| 文字 | `light-dark(#0f172a, #ffffff)` |
| 補足の文字 | `light-dark(#475569, #c9ddf0)` |
| エラー | `light-dark(#dc2626, #f87171)`（背景は `light-dark(#fef2f2, #f871711f)`） |
| 成功 | `light-dark(#16a34a, #4ade80)` |
| アクセントの上の文字・スイッチのつまみ | `#ffffff` |
| 角丸 | パネル・ボタンは `6px`、チェックボックスなどの小さいコントロールは `4px`、丸いものは `9999px` |
| フォーカス | `outline: 2px solid #009dfd; outline-offset: 2px;`（`:focus-visible`） |
| 無効 | `opacity: 0.5; cursor: not-allowed;` |
| 書体 | `font-family: inherit`（docs サイトの書体、または利用者の書体を使う） |

- 色はテーマに合わせて `light-dark()` で切り替える。`color-scheme` は docs サイト側で設定するので、demo では設定しない。
- 値は CSS 変数や共有ファイルにまとめず、demo ごとに書く（コピーして単体で動かすため）。
- 状態は `[data-state="..."]` や `[data-disabled]` などの data 属性で当てる。
- 例外: 分割ボタン（Toggle Group）の選択中は、アクセント色で塗らず、控えめな背景の上に背景色の面を浮かせる（`box-shadow: 0 1px 3px rgb(15 23 42 / 0.12)`）。
- 見本は `apps/docs/design/leve-ui-docs.pen` の「Demo gallery」。

## ストーリーファイル

```tsx
// apps/storybook/stories/progress.stories.tsx
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/progress/default';
import defaultSource from './demos/progress/default?raw';
import defaultCss from './demos/progress/default.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Progress',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};
```

- demo を描画し、**同じ TSX と CSS を `?raw` で読み込み、`demoSource()` で連結して `parameters.docs.source.code` に渡す。** Show code は 1 つの文字列しか受け取れないため、TSX の後に CSS を続けて表示する。表示されるコードと実際の動作がずれないようにするため。CSS ファイルがない demo は `?raw` の TSX をそのまま渡す。
- `title` は `Components/<Name>`。テストしたい状態ごとにストーリーを用意する（E2E はストーリー単位でしか開けないため。story ID の決め方は `write-tests` スキル）。
- 新しいコンポーネントの雛形（`create-component` スキルのスクリプト）は、この形の demo とストーリーを生成する。

## 禁止事項

- demo に E2E 専用の要素（Tab の移動を確かめるための `Before` / `After` ボタンなど）を書くこと。E2E では `gotoStory(page, id, { focusGuards: true })` を使う（`write-tests` スキル）。
- `render` に JSX を直接書くこと（Show code に `{ render: () => ... }` がそのまま表示されてしまう）。
- 補助コンポーネント（`<Example />` など）やファイル外の定数（`style={trackStyle}` など）に、パーツ・props・スタイルを隠すこと。
- demo 自身の `<story>.css` 以外（共有の CSS ファイル、CSS 変数のまとめなど）にスタイルを置くこと。Show code と docs から見えなくなるため。
- `?raw` のソースを渡さず、Show code にストーリーオブジェクトが表示される状態にすること。
