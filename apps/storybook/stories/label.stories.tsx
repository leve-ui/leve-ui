import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/label/default';
import defaultSource from './demos/label/default?raw';
import WrappingDemo from './demos/label/wrapping';
import wrappingSource from './demos/label/wrapping?raw';

// 各ストーリーは demos/label/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Label',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Wrapping: Story = {
  render: () => <WrappingDemo />,
  parameters: { docs: { source: { code: wrappingSource } } },
};
