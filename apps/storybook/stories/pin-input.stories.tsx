import type { Meta, StoryObj } from 'storybook-framework-qwik';
import AlphanumericDemo from './demos/pin-input/alphanumeric';
import alphanumericSource from './demos/pin-input/alphanumeric?raw';
import alphanumericCss from './demos/pin-input/alphanumeric.css?raw';
import ControlledDemo from './demos/pin-input/controlled';
import controlledSource from './demos/pin-input/controlled?raw';
import controlledCss from './demos/pin-input/controlled.css?raw';
import DefaultDemo from './demos/pin-input/default';
import defaultSource from './demos/pin-input/default?raw';
import defaultCss from './demos/pin-input/default.css?raw';
import DisabledDemo from './demos/pin-input/disabled';
import disabledSource from './demos/pin-input/disabled?raw';
import disabledCss from './demos/pin-input/disabled.css?raw';
import MaskDemo from './demos/pin-input/mask';
import maskSource from './demos/pin-input/mask?raw';
import maskCss from './demos/pin-input/mask.css?raw';
import ReadOnlyDemo from './demos/pin-input/read-only';
import readOnlySource from './demos/pin-input/read-only?raw';
import readOnlyCss from './demos/pin-input/read-only.css?raw';
import WithFieldDemo from './demos/pin-input/with-field';
import withFieldSource from './demos/pin-input/with-field?raw';
import withFieldCss from './demos/pin-input/with-field.css?raw';
import WithFormDemo from './demos/pin-input/with-form';
import withFormSource from './demos/pin-input/with-form?raw';
import withFormCss from './demos/pin-input/with-form.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/PinInput',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};

export const Alphanumeric: Story = {
  render: () => <AlphanumericDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(alphanumericSource, alphanumericCss, 'alphanumeric.css') },
    },
  },
};

export const Mask: Story = {
  render: () => <MaskDemo />,
  parameters: { docs: { source: { code: demoSource(maskSource, maskCss, 'mask.css') } } },
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
