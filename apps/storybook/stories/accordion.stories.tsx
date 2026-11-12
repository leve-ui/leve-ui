import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CollapsibleDemo from './demos/accordion/collapsible';
import collapsibleSource from './demos/accordion/collapsible?raw';
import collapsibleCss from './demos/accordion/collapsible.css?raw';
import ControlledDemo from './demos/accordion/controlled';
import controlledSource from './demos/accordion/controlled?raw';
import controlledCss from './demos/accordion/controlled.css?raw';
import DefaultDemo from './demos/accordion/default';
import defaultSource from './demos/accordion/default?raw';
import defaultCss from './demos/accordion/default.css?raw';
import DisabledDemo from './demos/accordion/disabled';
import disabledSource from './demos/accordion/disabled?raw';
import disabledCss from './demos/accordion/disabled.css?raw';
import MultipleDemo from './demos/accordion/multiple';
import multipleSource from './demos/accordion/multiple?raw';
import multipleCss from './demos/accordion/multiple.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Accordion',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Collapsible: Story = {
  render: () => <CollapsibleDemo />,
  parameters: {
    docs: { source: { code: demoSource(collapsibleSource, collapsibleCss, 'collapsible.css') } },
  },
};

export const Multiple: Story = {
  render: () => <MultipleDemo />,
  parameters: {
    docs: { source: { code: demoSource(multipleSource, multipleCss, 'multiple.css') } },
  },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};
