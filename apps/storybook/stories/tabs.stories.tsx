import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/tabs/controlled';
import controlledSource from './demos/tabs/controlled?raw';
import controlledCss from './demos/tabs/controlled.css?raw';
import DefaultDemo from './demos/tabs/default';
import defaultSource from './demos/tabs/default?raw';
import defaultCss from './demos/tabs/default.css?raw';
import DisabledTriggerDemo from './demos/tabs/disabled-trigger';
import disabledTriggerSource from './demos/tabs/disabled-trigger?raw';
import disabledTriggerCss from './demos/tabs/disabled-trigger.css?raw';
import ManualDemo from './demos/tabs/manual';
import manualSource from './demos/tabs/manual?raw';
import manualCss from './demos/tabs/manual.css?raw';
import VerticalDemo from './demos/tabs/vertical';
import verticalSource from './demos/tabs/vertical?raw';
import verticalCss from './demos/tabs/vertical.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Tabs',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Vertical: Story = {
  render: () => <VerticalDemo />,
  parameters: {
    docs: { source: { code: demoSource(verticalSource, verticalCss, 'vertical.css') } },
  },
};

export const Manual: Story = {
  render: () => <ManualDemo />,
  parameters: { docs: { source: { code: demoSource(manualSource, manualCss, 'manual.css') } } },
};

export const DisabledTrigger: Story = {
  render: () => <DisabledTriggerDemo />,
  parameters: {
    docs: {
      source: {
        code: demoSource(disabledTriggerSource, disabledTriggerCss, 'disabled-trigger.css'),
      },
    },
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};
