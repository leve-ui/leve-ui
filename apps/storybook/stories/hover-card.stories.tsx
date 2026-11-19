import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CustomTriggerDemo from './demos/hover-card/custom-trigger';
import customTriggerSource from './demos/hover-card/custom-trigger?raw';
import customTriggerCss from './demos/hover-card/custom-trigger.css?raw';
import DefaultDemo from './demos/hover-card/default';
import defaultSource from './demos/hover-card/default?raw';
import defaultCss from './demos/hover-card/default.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/hover-card/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/HoverCard',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const CustomTrigger: Story = {
  render: () => <CustomTriggerDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(customTriggerSource, customTriggerCss, 'custom-trigger.css') },
    },
  },
};
