import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CustomTriggerDemo from './demos/tooltip/custom-trigger';
import customTriggerSource from './demos/tooltip/custom-trigger?raw';
import customTriggerCss from './demos/tooltip/custom-trigger.css?raw';
import DefaultDemo from './demos/tooltip/default';
import defaultSource from './demos/tooltip/default?raw';
import defaultCss from './demos/tooltip/default.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/tooltip/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Tooltip',
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
