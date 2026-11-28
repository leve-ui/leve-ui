import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/tree-view/controlled';
import controlledSource from './demos/tree-view/controlled?raw';
import controlledCss from './demos/tree-view/controlled.css?raw';
import DefaultDemo from './demos/tree-view/default';
import defaultSource from './demos/tree-view/default?raw';
import defaultCss from './demos/tree-view/default.css?raw';
import DisabledDemo from './demos/tree-view/disabled';
import disabledSource from './demos/tree-view/disabled?raw';
import disabledCss from './demos/tree-view/disabled.css?raw';
import MultipleDemo from './demos/tree-view/multiple';
import multipleSource from './demos/tree-view/multiple?raw';
import multipleCss from './demos/tree-view/multiple.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/TreeView',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Multiple: Story = {
  render: () => <MultipleDemo />,
  parameters: {
    docs: { source: { code: demoSource(multipleSource, multipleCss, 'multiple.css') } },
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};
