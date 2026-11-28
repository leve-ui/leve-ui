import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/listbox/default';
import defaultSource from './demos/listbox/default?raw';
import defaultCss from './demos/listbox/default.css?raw';
import DisabledDemo from './demos/listbox/disabled';
import disabledSource from './demos/listbox/disabled?raw';
import disabledCss from './demos/listbox/disabled.css?raw';
import GroupedDemo from './demos/listbox/grouped';
import groupedSource from './demos/listbox/grouped?raw';
import groupedCss from './demos/listbox/grouped.css?raw';
import MultipleDemo from './demos/listbox/multiple';
import multipleSource from './demos/listbox/multiple?raw';
import multipleCss from './demos/listbox/multiple.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/listbox/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Listbox',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Multiple: Story = {
  render: () => <MultipleDemo />,
  parameters: {
    docs: { source: { code: demoSource(multipleSource, multipleCss, 'multiple.css') } },
  },
};

export const Grouped: Story = {
  render: () => <GroupedDemo />,
  parameters: { docs: { source: { code: demoSource(groupedSource, groupedCss, 'grouped.css') } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};
