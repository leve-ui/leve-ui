import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/label/default';
import defaultSource from './demos/label/default?raw';
import defaultCss from './demos/label/default.css?raw';
import WrappingDemo from './demos/label/wrapping';
import wrappingSource from './demos/label/wrapping?raw';
import wrappingCss from './demos/label/wrapping.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/label/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Label',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Wrapping: Story = {
  render: () => <WrappingDemo />,
  parameters: {
    docs: { source: { code: demoSource(wrappingSource, wrappingCss, 'wrapping.css') } },
  },
};
