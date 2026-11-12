import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/radio-group/controlled';
import controlledSource from './demos/radio-group/controlled?raw';
import DefaultDemo from './demos/radio-group/default';
import defaultSource from './demos/radio-group/default?raw';
import DefaultValueDemo from './demos/radio-group/default-value';
import defaultValueSource from './demos/radio-group/default-value?raw';
import DisabledDemo from './demos/radio-group/disabled';
import disabledSource from './demos/radio-group/disabled?raw';
import DisabledItemDemo from './demos/radio-group/disabled-item';
import disabledItemSource from './demos/radio-group/disabled-item?raw';
import HorizontalDemo from './demos/radio-group/horizontal';
import horizontalSource from './demos/radio-group/horizontal?raw';
import WithFormDemo from './demos/radio-group/with-form';
import withFormSource from './demos/radio-group/with-form?raw';

const meta: Meta = {
  title: 'Components/RadioGroup',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const DefaultValue: Story = {
  render: () => <DefaultValueDemo />,
  parameters: { docs: { source: { code: defaultValueSource } } },
};

export const Horizontal: Story = {
  render: () => <HorizontalDemo />,
  parameters: { docs: { source: { code: horizontalSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};

export const DisabledItem: Story = {
  render: () => <DisabledItemDemo />,
  parameters: { docs: { source: { code: disabledItemSource } } },
};

export const WithForm: Story = {
  render: () => <WithFormDemo />,
  parameters: { docs: { source: { code: withFormSource } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: { docs: { source: { code: controlledSource } } },
};
