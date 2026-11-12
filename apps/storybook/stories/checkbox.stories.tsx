import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CheckedDemo from './demos/checkbox/checked';
import checkedSource from './demos/checkbox/checked?raw';
import checkedCss from './demos/checkbox/checked.css?raw';
import DefaultDemo from './demos/checkbox/default';
import defaultSource from './demos/checkbox/default?raw';
import defaultCss from './demos/checkbox/default.css?raw';
import DisabledDemo from './demos/checkbox/disabled';
import disabledSource from './demos/checkbox/disabled?raw';
import disabledCss from './demos/checkbox/disabled.css?raw';
import IndeterminateDemo from './demos/checkbox/indeterminate';
import indeterminateSource from './demos/checkbox/indeterminate?raw';
import indeterminateCss from './demos/checkbox/indeterminate.css?raw';
import WithFieldDemo from './demos/checkbox/with-field';
import withFieldSource from './demos/checkbox/with-field?raw';
import withFieldCss from './demos/checkbox/with-field.css?raw';
import WithFormDemo from './demos/checkbox/with-form';
import withFormSource from './demos/checkbox/with-form?raw';
import withFormCss from './demos/checkbox/with-form.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Checkbox',
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

export const Indeterminate: Story = {
  render: () => <IndeterminateDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(indeterminateSource, indeterminateCss, 'indeterminate.css') },
    },
  },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};

export const WithForm: Story = {
  render: () => <WithFormDemo />,
  parameters: {
    docs: { source: { code: demoSource(withFormSource, withFormCss, 'with-form.css') } },
  },
};

export const WithField: Story = {
  render: () => <WithFieldDemo />,
  parameters: {
    docs: { source: { code: demoSource(withFieldSource, withFieldCss, 'with-field.css') } },
  },
};
