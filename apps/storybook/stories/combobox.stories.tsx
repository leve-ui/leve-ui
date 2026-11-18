import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/combobox/default';
import defaultSource from './demos/combobox/default?raw';
import defaultCss from './demos/combobox/default.css?raw';
import GroupedDemo from './demos/combobox/grouped';
import groupedSource from './demos/combobox/grouped?raw';
import groupedCss from './demos/combobox/grouped.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/combobox/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Combobox',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Grouped: Story = {
  render: () => <GroupedDemo />,
  parameters: { docs: { source: { code: demoSource(groupedSource, groupedCss, 'grouped.css') } } },
};
