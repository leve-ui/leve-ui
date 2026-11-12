import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/collapsible/controlled';
import controlledSource from './demos/collapsible/controlled?raw';
import controlledCss from './demos/collapsible/controlled.css?raw';
import DefaultDemo from './demos/collapsible/default';
import defaultSource from './demos/collapsible/default?raw';
import defaultCss from './demos/collapsible/default.css?raw';
import DisabledDemo from './demos/collapsible/disabled';
import disabledSource from './demos/collapsible/disabled?raw';
import disabledCss from './demos/collapsible/disabled.css?raw';
import OpenDemo from './demos/collapsible/open';
import openSource from './demos/collapsible/open?raw';
import openCss from './demos/collapsible/open.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Collapsible',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Open: Story = {
  render: () => <OpenDemo />,
  parameters: { docs: { source: { code: demoSource(openSource, openCss, 'open.css') } } },
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
