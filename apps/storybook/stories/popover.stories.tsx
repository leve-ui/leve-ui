import type { Meta, StoryObj } from 'storybook-framework-qwik';
import AnchorDemo from './demos/popover/anchor';
import anchorSource from './demos/popover/anchor?raw';
import anchorCss from './demos/popover/anchor.css?raw';
import DefaultDemo from './demos/popover/default';
import defaultSource from './demos/popover/default?raw';
import defaultCss from './demos/popover/default.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/popover/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Popover',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Anchor: Story = {
  render: () => <AnchorDemo />,
  parameters: { docs: { source: { code: demoSource(anchorSource, anchorCss, 'anchor.css') } } },
};
