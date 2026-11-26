import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/editable/controlled';
import controlledSource from './demos/editable/controlled?raw';
import controlledCss from './demos/editable/controlled.css?raw';
import DefaultDemo from './demos/editable/default';
import defaultSource from './demos/editable/default?raw';
import defaultCss from './demos/editable/default.css?raw';
import DisabledDemo from './demos/editable/disabled';
import disabledSource from './demos/editable/disabled?raw';
import disabledCss from './demos/editable/disabled.css?raw';
import DoubleClickDemo from './demos/editable/double-click';
import doubleClickSource from './demos/editable/double-click?raw';
import doubleClickCss from './demos/editable/double-click.css?raw';
import MultilineDemo from './demos/editable/multiline';
import multilineSource from './demos/editable/multiline?raw';
import multilineCss from './demos/editable/multiline.css?raw';
import ReadOnlyDemo from './demos/editable/read-only';
import readOnlySource from './demos/editable/read-only?raw';
import readOnlyCss from './demos/editable/read-only.css?raw';
import WithFieldDemo from './demos/editable/with-field';
import withFieldSource from './demos/editable/with-field?raw';
import withFieldCss from './demos/editable/with-field.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Editable',
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

export const DoubleClick: Story = {
  render: () => <DoubleClickDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(doubleClickSource, doubleClickCss, 'double-click.css') },
    },
  },
};

export const Multiline: Story = {
  render: () => <MultilineDemo />,
  parameters: {
    docs: { source: { code: demoSource(multilineSource, multilineCss, 'multiline.css') } },
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
