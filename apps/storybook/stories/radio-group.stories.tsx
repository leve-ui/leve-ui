import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/radio-group/controlled';
import controlledSource from './demos/radio-group/controlled?raw';
import controlledCss from './demos/radio-group/controlled.css?raw';
import DefaultDemo from './demos/radio-group/default';
import defaultSource from './demos/radio-group/default?raw';
import defaultCss from './demos/radio-group/default.css?raw';
import DefaultValueDemo from './demos/radio-group/default-value';
import defaultValueSource from './demos/radio-group/default-value?raw';
import defaultValueCss from './demos/radio-group/default-value.css?raw';
import DisabledDemo from './demos/radio-group/disabled';
import disabledSource from './demos/radio-group/disabled?raw';
import disabledCss from './demos/radio-group/disabled.css?raw';
import DisabledItemDemo from './demos/radio-group/disabled-item';
import disabledItemSource from './demos/radio-group/disabled-item?raw';
import disabledItemCss from './demos/radio-group/disabled-item.css?raw';
import HorizontalDemo from './demos/radio-group/horizontal';
import horizontalSource from './demos/radio-group/horizontal?raw';
import horizontalCss from './demos/radio-group/horizontal.css?raw';
import WithFormDemo from './demos/radio-group/with-form';
import withFormSource from './demos/radio-group/with-form?raw';
import withFormCss from './demos/radio-group/with-form.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/RadioGroup',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const DefaultValue: Story = {
  render: () => <DefaultValueDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(defaultValueSource, defaultValueCss, 'default-value.css') },
    },
  },
};

export const Horizontal: Story = {
  render: () => <HorizontalDemo />,
  parameters: {
    docs: { source: { code: demoSource(horizontalSource, horizontalCss, 'horizontal.css') } },
  },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};

export const DisabledItem: Story = {
  render: () => <DisabledItemDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(disabledItemSource, disabledItemCss, 'disabled-item.css') },
    },
  },
};

export const WithForm: Story = {
  render: () => <WithFormDemo />,
  parameters: {
    docs: { source: { code: demoSource(withFormSource, withFormCss, 'with-form.css') } },
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};
