import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/field/default';
import defaultSource from './demos/field/default?raw';
import DisabledDemo from './demos/field/disabled';
import disabledSource from './demos/field/disabled?raw';
import InvalidDemo from './demos/field/invalid';
import invalidSource from './demos/field/invalid?raw';
import RequiredDemo from './demos/field/required';
import requiredSource from './demos/field/required?raw';
import TextareaDemo from './demos/field/textarea';
import textareaSource from './demos/field/textarea?raw';

const meta: Meta = {
  title: 'Components/Field',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const Invalid: Story = {
  render: () => <InvalidDemo />,
  parameters: { docs: { source: { code: invalidSource } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: disabledSource } } },
};

export const Required: Story = {
  render: () => <RequiredDemo />,
  parameters: { docs: { source: { code: requiredSource } } },
};

export const Textarea: Story = {
  render: () => <TextareaDemo />,
  parameters: { docs: { source: { code: textareaSource } } },
};
