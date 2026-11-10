import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/alert/default';
import defaultSource from './demos/alert/default?raw';
import OnSubmitDemo from './demos/alert/on-submit';
import onSubmitSource from './demos/alert/on-submit?raw';

// 各ストーリーは demos/alert/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Alert',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: defaultSource } } },
};

export const OnSubmit: Story = {
  render: () => <OnSubmitDemo />,
  parameters: { docs: { source: { code: onSubmitSource } } },
};
