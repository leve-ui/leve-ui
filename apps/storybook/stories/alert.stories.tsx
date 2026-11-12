import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/alert/default';
import defaultSource from './demos/alert/default?raw';
import defaultCss from './demos/alert/default.css?raw';
import OnSubmitDemo from './demos/alert/on-submit';
import onSubmitSource from './demos/alert/on-submit?raw';
import onSubmitCss from './demos/alert/on-submit.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/alert/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Alert',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const OnSubmit: Story = {
  render: () => <OnSubmitDemo />,
  parameters: {
    docs: { source: { code: demoSource(onSubmitSource, onSubmitCss, 'on-submit.css') } },
  },
};
