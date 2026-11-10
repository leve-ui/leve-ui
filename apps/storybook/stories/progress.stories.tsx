import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/progress/controlled';
import controlledSource from './demos/progress/controlled?raw';
import DefaultDemo from './demos/progress/default';
import defaultSource from './demos/progress/default?raw';
import IndeterminateDemo from './demos/progress/indeterminate';
import indeterminateSource from './demos/progress/indeterminate?raw';
import WithValueTextDemo from './demos/progress/with-value-text';
import withValueTextSource from './demos/progress/with-value-text?raw';

// 各ストーリーは demos/progress/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Progress',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Indeterminate: Story = {
  render: () => <IndeterminateDemo />,
  parameters: { docs: { source: { code: indeterminateSource } } },
};

export const WithValueText: Story = {
  render: () => <WithValueTextDemo />,
  parameters: { docs: { source: { code: withValueTextSource } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: controlledSource } } },
};
