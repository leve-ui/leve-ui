import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/pagination/controlled';
import controlledSource from './demos/pagination/controlled?raw';
import controlledCss from './demos/pagination/controlled.css?raw';
import DefaultDemo from './demos/pagination/default';
import defaultSource from './demos/pagination/default?raw';
import defaultCss from './demos/pagination/default.css?raw';
import DisabledDemo from './demos/pagination/disabled';
import disabledSource from './demos/pagination/disabled?raw';
import disabledCss from './demos/pagination/disabled.css?raw';
import LinkModeDemo from './demos/pagination/link-mode';
import linkModeSource from './demos/pagination/link-mode?raw';
import linkModeCss from './demos/pagination/link-mode.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Pagination',
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

export const LinkMode: Story = {
  render: () => <LinkModeDemo />,
  parameters: {
    docs: { source: { code: demoSource(linkModeSource, linkModeCss, 'link-mode.css') } },
  },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};
