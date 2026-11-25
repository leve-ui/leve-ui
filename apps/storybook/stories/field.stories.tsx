import type { Meta, StoryObj } from 'storybook-framework-qwik';
import AutoresizeDemo from './demos/field/autoresize';
import autoresizeSource from './demos/field/autoresize?raw';
import autoresizeCss from './demos/field/autoresize.css?raw';
import DefaultDemo from './demos/field/default';
import defaultSource from './demos/field/default?raw';
import defaultCss from './demos/field/default.css?raw';
import DisabledDemo from './demos/field/disabled';
import disabledSource from './demos/field/disabled?raw';
import disabledCss from './demos/field/disabled.css?raw';
import InvalidDemo from './demos/field/invalid';
import invalidSource from './demos/field/invalid?raw';
import invalidCss from './demos/field/invalid.css?raw';
import ReadOnlyDemo from './demos/field/read-only';
import readOnlySource from './demos/field/read-only?raw';
import readOnlyCss from './demos/field/read-only.css?raw';
import RequiredDemo from './demos/field/required';
import requiredSource from './demos/field/required?raw';
import requiredCss from './demos/field/required.css?raw';
import SelectDemo from './demos/field/select';
import selectSource from './demos/field/select?raw';
import selectCss from './demos/field/select.css?raw';
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

export const ReadOnly: Story = {
  render: () => <ReadOnlyDemo />,
  parameters: {
    docs: { source: { code: demoSource(readOnlySource, readOnlyCss, 'read-only.css') } },
  },
};

export const Select: Story = {
  render: () => <SelectDemo />,
  parameters: {
    docs: { source: { code: demoSource(selectSource, selectCss, 'select.css') } },
  },
};

export const Autoresize: Story = {
  render: () => <AutoresizeDemo />,
  parameters: {
    docs: { source: { code: demoSource(autoresizeSource, autoresizeCss, 'autoresize.css') } },
  },
};
