import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DecorativeDemo from './demos/separator/decorative';
import decorativeSource from './demos/separator/decorative?raw';
import decorativeCss from './demos/separator/decorative.css?raw';
import DefaultDemo from './demos/separator/default';
import defaultSource from './demos/separator/default?raw';
import defaultCss from './demos/separator/default.css?raw';
import VerticalDemo from './demos/separator/vertical';
import verticalSource from './demos/separator/vertical?raw';
import verticalCss from './demos/separator/vertical.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/separator/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Separator',
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

export const Decorative: Story = {
  render: () => <DecorativeDemo />,
  parameters: {
    docs: { source: { code: demoSource(decorativeSource, decorativeCss, 'decorative.css') } },
  },
};
