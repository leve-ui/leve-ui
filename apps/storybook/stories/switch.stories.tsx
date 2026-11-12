import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CheckedDemo from './demos/switch/checked';
import checkedSource from './demos/switch/checked?raw';
import checkedCss from './demos/switch/checked.css?raw';
import DefaultDemo from './demos/switch/default';
import defaultSource from './demos/switch/default?raw';
import defaultCss from './demos/switch/default.css?raw';
import DisabledDemo from './demos/switch/disabled';
import disabledSource from './demos/switch/disabled?raw';
import disabledCss from './demos/switch/disabled.css?raw';
import FormDemo from './demos/switch/form';
import formSource from './demos/switch/form?raw';
import formCss from './demos/switch/form.css?raw';
import WithFieldDemo from './demos/switch/with-field';
import withFieldSource from './demos/switch/with-field?raw';
import withFieldCss from './demos/switch/with-field.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Switch',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Checked: Story = {
  render: () => <CheckedDemo />,
  parameters: { docs: { source: { code: demoSource(checkedSource, checkedCss, 'checked.css') } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};

export const Form: Story = {
  render: () => <FormDemo />,
  parameters: { docs: { source: { code: demoSource(formSource, formCss, 'form.css') } } },
};

export const WithField: Story = {
  render: () => <WithFieldDemo />,
  parameters: {
    docs: { source: { code: demoSource(withFieldSource, withFieldCss, 'with-field.css') } },
  },
};
