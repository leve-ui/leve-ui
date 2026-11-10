import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/breadcrumb/default';
import defaultSource from './demos/breadcrumb/default?raw';

// 各ストーリーは demos/breadcrumb/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Breadcrumb',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};
