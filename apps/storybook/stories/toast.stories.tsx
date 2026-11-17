import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ActionDemo from './demos/toast/action';
import actionSource from './demos/toast/action?raw';
import actionCss from './demos/toast/action.css?raw';
import DefaultDemo from './demos/toast/default';
import defaultSource from './demos/toast/default?raw';
import defaultCss from './demos/toast/default.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/toast/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Toast',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Action: Story = {
  render: () => <ActionDemo />,
  parameters: { docs: { source: { code: demoSource(actionSource, actionCss, 'action.css') } } },
};
