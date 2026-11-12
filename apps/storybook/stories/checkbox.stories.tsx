import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CheckedDemo from './demos/checkbox/checked';
import checkedSource from './demos/checkbox/checked?raw';
import DefaultDemo from './demos/checkbox/default';
import defaultSource from './demos/checkbox/default?raw';
import DisabledDemo from './demos/checkbox/disabled';
import disabledSource from './demos/checkbox/disabled?raw';
import IndeterminateDemo from './demos/checkbox/indeterminate';
import indeterminateSource from './demos/checkbox/indeterminate?raw';
import WithFieldDemo from './demos/checkbox/with-field';
import withFieldSource from './demos/checkbox/with-field?raw';
import WithFormDemo from './demos/checkbox/with-form';
import withFormSource from './demos/checkbox/with-form?raw';

const meta: Meta = {
  title: 'Components/Checkbox',
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

export const Indeterminate: Story = {
  render: () => <IndeterminateDemo />,
  parameters: { docs: { source: { code: indeterminateSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};

export const WithForm: Story = {
  render: () => <WithFormDemo />,
  parameters: { docs: { source: { code: withFormSource } } },
};

export const WithField: Story = {
  render: () => <WithFieldDemo />,
  parameters: { docs: { source: { code: withFieldSource } } },
};
