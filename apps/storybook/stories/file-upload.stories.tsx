import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/file-upload/default';
import defaultSource from './demos/file-upload/default?raw';
import defaultCss from './demos/file-upload/default.css?raw';
import DisabledDemo from './demos/file-upload/disabled';
import disabledSource from './demos/file-upload/disabled?raw';
import disabledCss from './demos/file-upload/disabled.css?raw';
import MultipleDemo from './demos/file-upload/multiple';
import multipleSource from './demos/file-upload/multiple?raw';
import multipleCss from './demos/file-upload/multiple.css?raw';
import ValidationDemo from './demos/file-upload/validation';
import validationSource from './demos/file-upload/validation?raw';
import validationCss from './demos/file-upload/validation.css?raw';
import WithFieldDemo from './demos/file-upload/with-field';
import withFieldSource from './demos/file-upload/with-field?raw';
import withFieldCss from './demos/file-upload/with-field.css?raw';
import WithFormDemo from './demos/file-upload/with-form';
import withFormSource from './demos/file-upload/with-form?raw';
import withFormCss from './demos/file-upload/with-form.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/FileUpload',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Multiple: Story = {
  render: () => <MultipleDemo />,
  parameters: {
    docs: { source: { code: demoSource(multipleSource, multipleCss, 'multiple.css') } },
  },
};

export const Validation: Story = {
  render: () => <ValidationDemo />,
  parameters: {
    docs: { source: { code: demoSource(validationSource, validationCss, 'validation.css') } },
  },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
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
