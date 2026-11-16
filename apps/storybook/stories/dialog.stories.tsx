import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/dialog/controlled';
import controlledSource from './demos/dialog/controlled?raw';
import controlledCss from './demos/dialog/controlled.css?raw';
import DefaultDemo from './demos/dialog/default';
import defaultSource from './demos/dialog/default?raw';
import defaultCss from './demos/dialog/default.css?raw';
import PersistentDemo from './demos/dialog/persistent';
import persistentSource from './demos/dialog/persistent?raw';
import persistentCss from './demos/dialog/persistent.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/dialog/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Dialog',
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

export const Persistent: Story = {
  render: () => <PersistentDemo />,
  parameters: {
    docs: { source: { code: demoSource(persistentSource, persistentCss, 'persistent.css') } },
  },
};
