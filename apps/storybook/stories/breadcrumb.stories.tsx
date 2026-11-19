import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CustomLinkDemo from './demos/breadcrumb/custom-link';
import customLinkSource from './demos/breadcrumb/custom-link?raw';
import customLinkCss from './demos/breadcrumb/custom-link.css?raw';
import DefaultDemo from './demos/breadcrumb/default';
import defaultSource from './demos/breadcrumb/default?raw';
import defaultCss from './demos/breadcrumb/default.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/breadcrumb/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Breadcrumb',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const CustomLink: Story = {
  render: () => <CustomLinkDemo />,
  parameters: {
    docs: { source: { code: demoSource(customLinkSource, customLinkCss, 'custom-link.css') } },
  },
};
