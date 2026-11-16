import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/toolbar/default';
import defaultSource from './demos/toolbar/default?raw';
import defaultCss from './demos/toolbar/default.css?raw';
import VerticalDemo from './demos/toolbar/vertical';
import verticalSource from './demos/toolbar/vertical?raw';
import verticalCss from './demos/toolbar/vertical.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/toolbar/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Toolbar',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Vertical: Story = {
  render: () => <VerticalDemo />,
  parameters: {
    docs: { source: { code: demoSource(verticalSource, verticalCss, 'vertical.css') } },
  },
};
