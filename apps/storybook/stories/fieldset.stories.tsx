import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/fieldset/default';
import defaultSource from './demos/fieldset/default?raw';
import defaultCss from './demos/fieldset/default.css?raw';
import DisabledDemo from './demos/fieldset/disabled';
import disabledSource from './demos/fieldset/disabled?raw';
import disabledCss from './demos/fieldset/disabled.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/fieldset/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Fieldset',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};
