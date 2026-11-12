import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/toggle-group/controlled';
import controlledSource from './demos/toggle-group/controlled?raw';
import DefaultDemo from './demos/toggle-group/default';
import defaultSource from './demos/toggle-group/default?raw';
import DisabledDemo from './demos/toggle-group/disabled';
import disabledSource from './demos/toggle-group/disabled?raw';
import MultipleDemo from './demos/toggle-group/multiple';
import multipleSource from './demos/toggle-group/multiple?raw';
import VerticalDemo from './demos/toggle-group/vertical';
import verticalSource from './demos/toggle-group/vertical?raw';

const meta: Meta = {
  title: 'Components/ToggleGroup',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Multiple: Story = {
  render: () => <MultipleDemo />,
  parameters: { docs: { source: { code: multipleSource } } },
};

export const Vertical: Story = {
  render: () => <VerticalDemo />,
  parameters: { docs: { source: { code: verticalSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: controlledSource } } },
};
