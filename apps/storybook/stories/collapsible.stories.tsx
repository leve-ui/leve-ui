import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/collapsible/controlled';
import controlledSource from './demos/collapsible/controlled?raw';
import DefaultDemo from './demos/collapsible/default';
import defaultSource from './demos/collapsible/default?raw';
import DisabledDemo from './demos/collapsible/disabled';
import disabledSource from './demos/collapsible/disabled?raw';
import OpenDemo from './demos/collapsible/open';
import openSource from './demos/collapsible/open?raw';

const meta: Meta = {
  title: 'Components/Collapsible',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Open: Story = {
  render: () => <OpenDemo />,
  parameters: { docs: { source: { code: openSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: controlledSource } } },
};
