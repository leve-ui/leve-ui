import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/tabs/controlled';
import controlledSource from './demos/tabs/controlled?raw';
import DefaultDemo from './demos/tabs/default';
import defaultSource from './demos/tabs/default?raw';
import DisabledTriggerDemo from './demos/tabs/disabled-trigger';
import disabledTriggerSource from './demos/tabs/disabled-trigger?raw';
import ManualDemo from './demos/tabs/manual';
import manualSource from './demos/tabs/manual?raw';
import VerticalDemo from './demos/tabs/vertical';
import verticalSource from './demos/tabs/vertical?raw';

const meta: Meta = {
  title: 'Components/Tabs',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Vertical: Story = {
  render: () => <VerticalDemo />,
  parameters: { docs: { source: { code: verticalSource } } },
};

export const Manual: Story = {
  render: () => <ManualDemo />,
  parameters: { docs: { source: { code: manualSource } } },
};

export const DisabledTrigger: Story = {
  render: () => <DisabledTriggerDemo />,
  parameters: { docs: { source: { code: disabledTriggerSource } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: controlledSource } } },
};
