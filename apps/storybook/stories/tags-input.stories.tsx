import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/tags-input/controlled';
import controlledSource from './demos/tags-input/controlled?raw';
import controlledCss from './demos/tags-input/controlled.css?raw';
import DefaultDemo from './demos/tags-input/default';
import defaultSource from './demos/tags-input/default?raw';
import defaultCss from './demos/tags-input/default.css?raw';
import DisabledDemo from './demos/tags-input/disabled';
import disabledSource from './demos/tags-input/disabled?raw';
import disabledCss from './demos/tags-input/disabled.css?raw';
import EditableDemo from './demos/tags-input/editable';
import editableSource from './demos/tags-input/editable?raw';
import editableCss from './demos/tags-input/editable.css?raw';
import ReadOnlyDemo from './demos/tags-input/read-only';
import readOnlySource from './demos/tags-input/read-only?raw';
import readOnlyCss from './demos/tags-input/read-only.css?raw';
import SuggestionsOnlyDemo from './demos/tags-input/suggestions-only';
import suggestionsOnlySource from './demos/tags-input/suggestions-only?raw';
import suggestionsOnlyCss from './demos/tags-input/suggestions-only.css?raw';
import ValidationDemo from './demos/tags-input/validation';
import validationSource from './demos/tags-input/validation?raw';
import validationCss from './demos/tags-input/validation.css?raw';
import WithComboboxDemo from './demos/tags-input/with-combobox';
import withComboboxSource from './demos/tags-input/with-combobox?raw';
import withComboboxCss from './demos/tags-input/with-combobox.css?raw';
import WithFieldDemo from './demos/tags-input/with-field';
import withFieldSource from './demos/tags-input/with-field?raw';
import withFieldCss from './demos/tags-input/with-field.css?raw';
import WithFormDemo from './demos/tags-input/with-form';
import withFormSource from './demos/tags-input/with-form?raw';
import withFormCss from './demos/tags-input/with-form.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/TagsInput',
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

export const Editable: Story = {
  render: () => <EditableDemo />,
  parameters: {
    docs: { source: { code: demoSource(editableSource, editableCss, 'editable.css') } },
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

export const WithCombobox: Story = {
  render: () => <WithComboboxDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(withComboboxSource, withComboboxCss, 'with-combobox.css') },
    },
  },
};

export const SuggestionsOnly: Story = {
  render: () => <SuggestionsOnlyDemo />,
  parameters: {
    docs: {
      source: {
        code: demoSource(suggestionsOnlySource, suggestionsOnlyCss, 'suggestions-only.css'),
      },
    },
  },
};
