import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CheckedDemo from './demos/switch/checked';
import checkedSource from './demos/switch/checked?raw';
import DefaultDemo from './demos/switch/default';
import defaultSource from './demos/switch/default?raw';
import DisabledDemo from './demos/switch/disabled';
import disabledSource from './demos/switch/disabled?raw';
import FormDemo from './demos/switch/form';
import formSource from './demos/switch/form?raw';
import WithFieldDemo from './demos/switch/with-field';
import withFieldSource from './demos/switch/with-field?raw';

const meta: Meta = {
  title: 'Components/Switch',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Checked: Story = {
  render: () => <CheckedDemo />,
  parameters: { docs: { source: { code: checkedSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};

export const Form: Story = {
  render: () => <FormDemo />,
  parameters: { docs: { source: { code: formSource } } },
};

export const WithField: Story = {
  render: () => <WithFieldDemo />,
  parameters: { docs: { source: { code: withFieldSource } } },
};
