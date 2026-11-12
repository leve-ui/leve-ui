import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/toggle/controlled';
import controlledSource from './demos/toggle/controlled?raw';
import controlledCss from './demos/toggle/controlled.css?raw';
import DefaultDemo from './demos/toggle/default';
import defaultSource from './demos/toggle/default?raw';
import defaultCss from './demos/toggle/default.css?raw';
import DisabledDemo from './demos/toggle/disabled';
import disabledSource from './demos/toggle/disabled?raw';
import disabledCss from './demos/toggle/disabled.css?raw';
import PressedDemo from './demos/toggle/pressed';
import pressedSource from './demos/toggle/pressed?raw';
import pressedCss from './demos/toggle/pressed.css?raw';
import { demoSource } from './source';

// Each story renders a component$ from demos/toggle/ and displays its source in Docs "Show code"
const meta: Meta = {
  title: 'Components/Toggle',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Pressed: Story = {
  render: () => <PressedDemo />,
  parameters: { docs: { source: { code: demoSource(pressedSource, pressedCss, 'pressed.css') } } },
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
