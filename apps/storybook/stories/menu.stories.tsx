import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/menu/default';
import defaultSource from './demos/menu/default?raw';
import defaultCss from './demos/menu/default.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/menu/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Menu',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};
