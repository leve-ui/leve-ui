import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/field/default';
import defaultSource from './demos/field/default?raw';
import defaultCss from './demos/field/default.css?raw';
import DisabledDemo from './demos/field/disabled';
import disabledSource from './demos/field/disabled?raw';
import disabledCss from './demos/field/disabled.css?raw';
import InvalidDemo from './demos/field/invalid';
import invalidSource from './demos/field/invalid?raw';
import invalidCss from './demos/field/invalid.css?raw';
import RequiredDemo from './demos/field/required';
import requiredSource from './demos/field/required?raw';
import requiredCss from './demos/field/required.css?raw';
import TextareaDemo from './demos/field/textarea';
import textareaSource from './demos/field/textarea?raw';
import textareaCss from './demos/field/textarea.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Field',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Invalid: Story = {
  render: () => <InvalidDemo />,
  parameters: { docs: { source: { code: demoSource(invalidSource, invalidCss, 'invalid.css') } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};

export const Required: Story = {
  render: () => <RequiredDemo />,
  parameters: {
    docs: { source: { code: demoSource(requiredSource, requiredCss, 'required.css') } },
  },
};

export const Textarea: Story = {
  render: () => <TextareaDemo />,
  parameters: {
    docs: { source: { code: demoSource(textareaSource, textareaCss, 'textarea.css') } },
  },
};
