import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/avatar/default';
import defaultSource from './demos/avatar/default?raw';
import defaultCss from './demos/avatar/default.css?raw';
import FallbackDemo from './demos/avatar/fallback';
import fallbackSource from './demos/avatar/fallback?raw';
import fallbackCss from './demos/avatar/fallback.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/avatar/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Avatar',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Fallback: Story = {
  render: () => <FallbackDemo />,
  parameters: {
    docs: { source: { code: demoSource(fallbackSource, fallbackCss, 'fallback.css') } },
  },
};
