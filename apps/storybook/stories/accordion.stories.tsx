import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CollapsibleDemo from './demos/accordion/collapsible';
import collapsibleSource from './demos/accordion/collapsible?raw';
import ControlledDemo from './demos/accordion/controlled';
import controlledSource from './demos/accordion/controlled?raw';
import DefaultDemo from './demos/accordion/default';
import defaultSource from './demos/accordion/default?raw';
import DisabledDemo from './demos/accordion/disabled';
import disabledSource from './demos/accordion/disabled?raw';
import MultipleDemo from './demos/accordion/multiple';
import multipleSource from './demos/accordion/multiple?raw';

const meta: Meta = {
  title: 'Components/Accordion',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Collapsible: Story = {
  render: () => <CollapsibleDemo />,
  parameters: { docs: { source: { code: collapsibleSource } } },
};

export const Multiple: Story = {
  render: () => <MultipleDemo />,
  parameters: { docs: { source: { code: multipleSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: controlledSource } } },
};
