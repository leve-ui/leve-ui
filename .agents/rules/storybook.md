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
