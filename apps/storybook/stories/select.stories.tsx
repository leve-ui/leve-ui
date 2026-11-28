import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/select/controlled';
import controlledSource from './demos/select/controlled?raw';
import controlledCss from './demos/select/controlled.css?raw';
import DefaultDemo from './demos/select/default';
import defaultSource from './demos/select/default?raw';
import defaultCss from './demos/select/default.css?raw';
import DisabledDemo from './demos/select/disabled';
import disabledSource from './demos/select/disabled?raw';
import disabledCss from './demos/select/disabled.css?raw';
import FieldDemo from './demos/select/field';
import fieldSource from './demos/select/field?raw';
import fieldCss from './demos/select/field.css?raw';
import GroupedDemo from './demos/select/grouped';
import groupedSource from './demos/select/grouped?raw';
import groupedCss from './demos/select/grouped.css?raw';
import { demoSource } from './source';

// Each story renders a component$ from demos/select/ and exposes its full source in Docs "Show code"
const meta: Meta = {
  title: 'Components/Select',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Grouped: Story = {
  render: () => <GroupedDemo />,
  parameters: { docs: { source: { code: demoSource(groupedSource, groupedCss, 'grouped.css') } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};

export const Field: Story = {
  render: () => <FieldDemo />,
  parameters: { docs: { source: { code: demoSource(fieldSource, fieldCss, 'field.css') } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};
