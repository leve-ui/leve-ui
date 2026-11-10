import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/meter/controlled';
import controlledSource from './demos/meter/controlled?raw';
import DefaultDemo from './demos/meter/default';
import defaultSource from './demos/meter/default?raw';
import WithValueTextDemo from './demos/meter/with-value-text';
import withValueTextSource from './demos/meter/with-value-text?raw';

// 各ストーリーは demos/meter/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Meter',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const WithValueText: Story = {
  render: () => <WithValueTextDemo />,
  parameters: { docs: { source: { code: withValueTextSource } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: controlledSource } } },
};
