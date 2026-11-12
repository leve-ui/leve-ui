import type { Preview } from 'storybook-framework-qwik';

const preview: Preview = {
  // すべてのコンポーネントに Docs ページを自動生成する
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default preview;
