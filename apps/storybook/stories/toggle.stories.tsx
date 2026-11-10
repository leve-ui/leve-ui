import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/toggle/controlled';
import controlledSource from './demos/toggle/controlled?raw';
import DefaultDemo from './demos/toggle/default';
import defaultSource from './demos/toggle/default?raw';
import DisabledDemo from './demos/toggle/disabled';
import disabledSource from './demos/toggle/disabled?raw';
import PressedDemo from './demos/toggle/pressed';
import pressedSource from './demos/toggle/pressed?raw';

// Each story renders a component$ from demos/toggle/ and displays its source in Docs "Show code"
const meta: Meta = {
  title: 'Components/Toggle',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Pressed: Story = {
  render: () => <PressedDemo />,
  parameters: { docs: { source: { code: pressedSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: controlledSource } } },
};
