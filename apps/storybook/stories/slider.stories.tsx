import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/slider/controlled';
import controlledSource from './demos/slider/controlled?raw';
import controlledCss from './demos/slider/controlled.css?raw';
import DefaultDemo from './demos/slider/default';
import defaultSource from './demos/slider/default?raw';
import defaultCss from './demos/slider/default.css?raw';
import DisabledDemo from './demos/slider/disabled';
import disabledSource from './demos/slider/disabled?raw';
import disabledCss from './demos/slider/disabled.css?raw';
import RangeDemo from './demos/slider/range';
import rangeSource from './demos/slider/range?raw';
import rangeCss from './demos/slider/range.css?raw';
import ReadOnlyDemo from './demos/slider/read-only';
import readOnlySource from './demos/slider/read-only?raw';
import readOnlyCss from './demos/slider/read-only.css?raw';
import StepDemo from './demos/slider/step';
import stepSource from './demos/slider/step?raw';
import stepCss from './demos/slider/step.css?raw';
import VerticalDemo from './demos/slider/vertical';
import verticalSource from './demos/slider/vertical?raw';
import verticalCss from './demos/slider/vertical.css?raw';
import WithFieldDemo from './demos/slider/with-field';
import withFieldSource from './demos/slider/with-field?raw';
import withFieldCss from './demos/slider/with-field.css?raw';
import WithFormDemo from './demos/slider/with-form';
import withFormSource from './demos/slider/with-form?raw';
import withFormCss from './demos/slider/with-form.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Slider',
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

export const Range: Story = {
  render: () => <RangeDemo />,
  parameters: {
    docs: { source: { code: demoSource(rangeSource, rangeCss, 'range.css') } },
  },
};

export const Vertical: Story = {
  render: () => <VerticalDemo />,
  parameters: {
    docs: { source: { code: demoSource(verticalSource, verticalCss, 'vertical.css') } },
  },
};

export const Step: Story = {
  render: () => <StepDemo />,
  parameters: {
    docs: { source: { code: demoSource(stepSource, stepCss, 'step.css') } },
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
