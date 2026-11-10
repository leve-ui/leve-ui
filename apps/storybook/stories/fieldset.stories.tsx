import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/fieldset/default';
import defaultSource from './demos/fieldset/default?raw';
import DisabledDemo from './demos/fieldset/disabled';
import disabledSource from './demos/fieldset/disabled?raw';

// 各ストーリーは demos/fieldset/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Fieldset',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};
