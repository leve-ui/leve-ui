import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/toggle-group/controlled';
import controlledSource from './demos/toggle-group/controlled?raw';
import controlledCss from './demos/toggle-group/controlled.css?raw';
import DefaultDemo from './demos/toggle-group/default';
import defaultSource from './demos/toggle-group/default?raw';
import defaultCss from './demos/toggle-group/default.css?raw';
import DisabledDemo from './demos/toggle-group/disabled';
import disabledSource from './demos/toggle-group/disabled?raw';
import disabledCss from './demos/toggle-group/disabled.css?raw';
import MultipleDemo from './demos/toggle-group/multiple';
import multipleSource from './demos/toggle-group/multiple?raw';
import multipleCss from './demos/toggle-group/multiple.css?raw';
import VerticalDemo from './demos/toggle-group/vertical';
import verticalSource from './demos/toggle-group/vertical?raw';
import verticalCss from './demos/toggle-group/vertical.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/ToggleGroup',
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

export const Vertical: Story = {
  render: () => <VerticalDemo />,
  parameters: {
    docs: { source: { code: demoSource(verticalSource, verticalCss, 'vertical.css') } },
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
