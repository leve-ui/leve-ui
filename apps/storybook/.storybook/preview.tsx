import type { Decorator, Preview } from 'storybook-framework-qwik';

/**
 * E2E でフォーカスの出入り（Tab で入る・抜ける、無効な要素を飛ばす）を確かめるため、
 * ストーリーの前後にボタンを置く。demo は docs サイトにも載るので demo には書かず、
 * URL に `&globals=focusGuards:!true` を付けたときだけ有効にする（apps/e2e/tests/story.ts）。
 */
const withFocusGuards: Decorator = (Story, { globals }) => {
  if (!globals.focusGuards) return Story();

  return (
    <>
      <button type="button">Before</button>
      {Story()}
      <button type="button">After</button>
    </>
  );
};

const preview: Preview = {
  // すべてのコンポーネントに Docs ページを自動生成する
  tags: ['autodocs'],
  decorators: [withFocusGuards],
  initialGlobals: { focusGuards: false },
  parameters: {
    layout: 'centered',
  },
};

export default preview;
