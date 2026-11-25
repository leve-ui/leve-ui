import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/number-input/controlled';
import controlledSource from './demos/number-input/controlled?raw';
import controlledCss from './demos/number-input/controlled.css?raw';
import DefaultDemo from './demos/number-input/default';
import defaultSource from './demos/number-input/default?raw';
import defaultCss from './demos/number-input/default.css?raw';
import DisabledDemo from './demos/number-input/disabled';
import disabledSource from './demos/number-input/disabled?raw';
import disabledCss from './demos/number-input/disabled.css?raw';
import FormattedDemo from './demos/number-input/formatted';
import formattedSource from './demos/number-input/formatted?raw';
import formattedCss from './demos/number-input/formatted.css?raw';
import MinMaxStepDemo from './demos/number-input/min-max-step';
import minMaxStepSource from './demos/number-input/min-max-step?raw';
import minMaxStepCss from './demos/number-input/min-max-step.css?raw';
import ReadOnlyDemo from './demos/number-input/read-only';
import readOnlySource from './demos/number-input/read-only?raw';
import readOnlyCss from './demos/number-input/read-only.css?raw';
import WithFieldDemo from './demos/number-input/with-field';
import withFieldSource from './demos/number-input/with-field?raw';
import withFieldCss from './demos/number-input/with-field.css?raw';
import WithFormDemo from './demos/number-input/with-form';
import withFormSource from './demos/number-input/with-form?raw';
import withFormCss from './demos/number-input/with-form.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/NumberInput',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: {
    docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } },
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};

export const MinMaxStep: Story = {
  render: () => <MinMaxStepDemo />,
  parameters: {
    docs: { source: { code: demoSource(minMaxStepSource, minMaxStepCss, 'min-max-step.css') } },
  },
};

export const Formatted: Story = {
  render: () => <FormattedDemo />,
  parameters: {
    docs: { source: { code: demoSource(formattedSource, formattedCss, 'formatted.css') } },
  },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};

export const ReadOnly: Story = {
  render: () => <ReadOnlyDemo />,
  parameters: {
    docs: { source: { code: demoSource(readOnlySource, readOnlyCss, 'read-only.css') } },
  },
};

export const WithField: Story = {
  render: () => <WithFieldDemo />,
  parameters: {
    docs: { source: { code: demoSource(withFieldSource, withFieldCss, 'with-field.css') } },
  },
};

export const WithForm: Story = {
  render: () => <WithFormDemo />,
  parameters: {
    docs: { source: { code: demoSource(withFormSource, withFormCss, 'with-form.css') } },
  },
};
