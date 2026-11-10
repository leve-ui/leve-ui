---
name: write-tests
description: leve-ui のコンポーネントのテスト（Vitest + createDOM のユニットテスト、Storybook のストーリー、Playwright の E2E）の書き方。テストの追加・修正、キーボード操作やフォーカスの E2E、ARIA 属性の検証を書くときに使う。
---

# テストを書く

必須事項は `.agents/rules/testing.md`。ここでは具体的な書き方をまとめる。

## ユニットテスト（Vitest + createDOM）

場所: `packages/components/<name>/src/<name>.test.tsx`

```tsx
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Dialog } from './index';

describe('Dialog', () => {
  it('Trigger に aria-expanded と aria-controls が付く', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>Body</Dialog.Content>
      </Dialog.Root>,
    );

    const trigger = screen.querySelector('[data-leve-dialog-trigger]');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    await userEvent('[data-leve-dialog-trigger]', 'click');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });
});
```

- `createDOM()` は疑似 DOM 上でクライアント描画する。`useVisibleTask$` も実行される。SSR → resume の流れは再現されないため、SSR に関わる振る舞いは docs サイトで確認する。
- `userEvent(selector, eventName)` でクリックなどのイベントを発火でき、`await` すると再描画まで完了する。
- 要素は `[data-leve-<name>-<part>]` で取得すると、実装の要素変更（`div` → `button` など）に強い。
- 実際のフォーカス移動やキーボード操作は jsdom 相当の環境では正しく再現できないため、E2E で確認する。
- 実行: `pnpm --filter @leve-ui/<name> test`

## ストーリー（Storybook）

場所: `apps/storybook/stories/<name>.stories.tsx` と `apps/storybook/stories/demos/<name>/<story>.tsx`

- `title` は `Components/<Name>`。
- テストしたい状態ごとにストーリーを用意する（E2E はストーリー単位でしか開けないため）。
- autodocs が有効なので、Docs の「Show code」に表示するコードを、**スタイルを含めて利用者がそのままコピーして使える形にする**（`.agents/rules/storybook.md`）。

demo ファイル（ストーリー 1 つにつき 1 つ。コメントは英語）:

```tsx
// stories/demos/progress/default.tsx
import { component$, useStyles$ } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';

const styles = `
  .progress-track {
    height: 0.5rem;
    background: #e5e7eb;
  }

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

ストーリーファイル:

```tsx
// stories/progress.stories.tsx
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

- 状態を持つ例（`useSignal` など）も同じ形で書ける。`render` はコンポーネントとして実行されないので、フックは demo の中で使う。
- クラス名はコンポーネント名で始める（`useStyles$` の CSS はページ全体に効き、Docs では複数の demo が同じページに並ぶため）。
- `@keyframes` や `[data-state="..."]` のような属性セレクタも CSS に書く。ライブラリが出す data 属性・CSS 変数の使い方の例にもなる。

## E2E（Playwright）

場所: `apps/e2e/tests/<name>.spec.ts`

```ts
import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Dialog', () => {
  test('Escape で閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    await gotoStory(page, 'components-dialog--default');

    const trigger = page.getByRole('button', { name: 'Open' });
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
```

- story ID は `title` を小文字にして `/` を `-` に変え、`--` の後に export 名を kebab-case にしてつなげたもの。
  - `Components/Dialog` の `Default` → `components-dialog--default`
  - `Components/RadioGroup` の `WithDisabled` → `components-radiogroup--with-disabled`（単語の区切りは入らない）
- 要素は `getByRole` を優先する。ロールで取れないこと自体が、アクセシビリティの問題を示している場合が多い。
- フォーカスは `toBeFocused()`、キー入力は `page.keyboard.press('ArrowDown')` などで確認する。
- 外部リソースは `page.route` でモックする（例: `apps/e2e/tests/avatar.spec.ts`）。
- 実行: `pnpm e2e`（Storybook が 6106 番ポートで自動起動する。`adr/0008` を参照）
