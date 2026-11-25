import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/password-input/controlled';
import controlledSource from './demos/password-input/controlled?raw';
import controlledCss from './demos/password-input/controlled.css?raw';
import DefaultDemo from './demos/password-input/default';
import defaultSource from './demos/password-input/default?raw';
import defaultCss from './demos/password-input/default.css?raw';
import DefaultVisibleDemo from './demos/password-input/default-visible';
import defaultVisibleSource from './demos/password-input/default-visible?raw';
import defaultVisibleCss from './demos/password-input/default-visible.css?raw';
import DisabledDemo from './demos/password-input/disabled';
import disabledSource from './demos/password-input/disabled?raw';
import disabledCss from './demos/password-input/disabled.css?raw';
import WithFieldDemo from './demos/password-input/with-field';
import withFieldSource from './demos/password-input/with-field?raw';
import withFieldCss from './demos/password-input/with-field.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/PasswordInput',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const DefaultVisible: Story = {
  render: () => <DefaultVisibleDemo />,
  parameters: {
    docs: {
      source: {
        code: demoSource(defaultVisibleSource, defaultVisibleCss, 'default-visible.css'),
      },
    },
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
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
