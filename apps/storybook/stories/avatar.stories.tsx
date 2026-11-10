import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/avatar/default';
import defaultSource from './demos/avatar/default?raw';
import FallbackDemo from './demos/avatar/fallback';
import fallbackSource from './demos/avatar/fallback?raw';

// 各ストーリーは demos/avatar/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Avatar',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Fallback: Story = {
  render: () => <FallbackDemo />,
  parameters: { docs: { source: { code: fallbackSource } } },
};
