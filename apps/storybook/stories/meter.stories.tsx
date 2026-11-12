import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/meter/controlled';
import controlledSource from './demos/meter/controlled?raw';
import controlledCss from './demos/meter/controlled.css?raw';
import DefaultDemo from './demos/meter/default';
import defaultSource from './demos/meter/default?raw';
import defaultCss from './demos/meter/default.css?raw';
import WithValueTextDemo from './demos/meter/with-value-text';
import withValueTextSource from './demos/meter/with-value-text?raw';
import withValueTextCss from './demos/meter/with-value-text.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/meter/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Meter',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const WithValueText: Story = {
  render: () => <WithValueTextDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(withValueTextSource, withValueTextCss, 'with-value-text.css') },
    },
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};
