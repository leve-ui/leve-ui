---
trigger: always_on
description: Storybook のストーリーを、Docs の「Show code」がそのまま使えるコードになるように書くためのルール
---

# Storybook のストーリー

Storybook は全コンポーネントの Docs ページを自動生成する（`.storybook/preview.ts` の `tags: ['autodocs']`）。Docs の「Show code」は、利用者がそのままコピーして使うコードになる。**スタイルを含めて丸ごと見える**よう、ストーリーは必ず次の形で書く。

## 構成

```
apps/storybook/stories/
├── <name>.stories.tsx           # demo を描画し、そのソースを Show code に渡すだけ
└── demos/<name>/<story>.tsx     # ストーリー 1 つにつき 1 ファイル（<story> は export 名の kebab-case）
```

## demo ファイル

```tsx
// apps/storybook/stories/demos/progress/default.tsx
import { component$, useStyles$ } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';

const styles = `
  .progress-track {
    height: 0.5rem;
    background: #e5e7eb;
  }

  /* Percentage of the Root value, set by the library */
  .progress-indicator {
    height: 100%;
    width: var(--leve-progress-percent);
    background: #2563eb;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Progress.Root value={40} class="progress">
      <Progress.Label>Uploading</Progress.Label>
      <Progress.Track class="progress-track">
        <Progress.Indicator class="progress-indicator" />
      </Progress.Track>
    </Progress.Root>
  );
});
```

- `export default component$(...)` で、**利用者が書くコードと同じ形**にする。import はパッケージ名（`@leve-ui/<name>`）から行う。
- **スタイルは demo ファイルの中に書く。** ファイル先頭の `const styles = \`...\`` に CSS を書き、コンポーネントの中で `useStyles$(styles)` する。
- 見た目は `class` で当てる。クラス名はコンポーネント名で始める（例: `.progress-track`）。`useStyles$` の CSS はページ全体に効き、Docs では複数の demo が同じページに並ぶため。
- `@keyframes` や `[data-state="..."]` などの属性セレクタも CSS に書く。ライブラリが出す data 属性・CSS 変数の使い方の例にもなる。
- 状態を持つ例（`useSignal` など）も、demo の中でフックを使って書く（ストーリーの `render` はコンポーネントとして実行されず、フックを使えないため）。
- demo は利用者が読むので、**コメント（CSS のコメントを含む）は英語**で書く。
- 同じコンポーネントの demo 同士で CSS が重複してもよい。demo 1 つを単体でコピーして動くことを優先する。

## demo の見た目（`adr/0031`、#95）

demo は docs サイトのライト／ダークの両テーマに置かれ、利用者がそのままコピーする。見た目を揃えるため、次の値だけを使う（デザインは `apps/docs/design/leve-ui-docs.pen` の「Demo style guide」）。

| 用途 | 値 |
| --- | --- |
| アクセント（checked・選択中・フォーカス） | `#009dfd` |
| 背景（コントロール・パネル） | `light-dark(#ffffff, #1b2045)` |
| 枠線 | `light-dark(#cbd5e1, #ffffff3d)` |
| 文字 | `light-dark(#0f172a, #ffffff)` |
| 補足の文字 | `light-dark(#475569, #c9ddf0)` |
| 角丸 | パネル・ボタンは `6px`、チェックボックスなどの小さいコントロールは `4px` |
| フォーカス | `outline: 2px solid #009dfd; outline-offset: 2px;`（`:focus-visible`） |
| 無効 | `opacity: 0.5; cursor: not-allowed;` |
| 書体 | `font: inherit`（docs サイトの書体、または利用者の書体を使う） |

- 色はテーマに合わせて `light-dark()` で切り替える。`color-scheme` は docs サイト側で設定するので、demo では設定しない。
- 値は CSS 変数や共有ファイルにまとめず、demo ごとに書く（コピーして単体で動かすため）。
- 状態は `[data-state="..."]` や `[data-disabled]` などの data 属性で当てる。

## ストーリーファイル

```tsx
// apps/storybook/stories/progress.stories.tsx
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/progress/default';
import defaultSource from './demos/progress/default?raw';

const meta: Meta = {
  title: 'Components/Progress',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};
```

- demo を描画し、**同じファイルを `?raw` で読み込んで `parameters.docs.source.code` に渡す。** 表示されるコードと実際の動作がずれないようにするため。
- `title` は `Components/<Name>`。テストしたい状態ごとにストーリーを用意する（E2E はストーリー単位でしか開けないため。story ID の決め方は `write-tests` スキル）。
- 新しいコンポーネントの雛形（`create-component` スキルのスクリプト）は、この形の demo とストーリーを生成する。

## 禁止事項

- `render` に JSX を直接書くこと（Show code に `{ render: () => ... }` がそのまま表示されてしまう）。
- 補助コンポーネント（`<Example />` など）やファイル外の定数（`style={trackStyle}` など）に、パーツ・props・スタイルを隠すこと。
- demo の外（共有の CSS ファイルなど）にスタイルを置くこと。Show code から見えなくなるため。
- `?raw` のソースを渡さず、Show code にストーリーオブジェクトが表示される状態にすること。
