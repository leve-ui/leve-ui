import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/steps/controlled';
import controlledSource from './demos/steps/controlled?raw';
import controlledCss from './demos/steps/controlled.css?raw';
import DefaultDemo from './demos/steps/default';
import defaultSource from './demos/steps/default?raw';
import defaultCss from './demos/steps/default.css?raw';
import LinearDemo from './demos/steps/linear';
import linearSource from './demos/steps/linear?raw';
import linearCss from './demos/steps/linear.css?raw';
import VerticalDemo from './demos/steps/vertical';
import verticalSource from './demos/steps/vertical?raw';
import verticalCss from './demos/steps/vertical.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Steps',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Linear: Story = {
  render: () => <LinearDemo />,
  parameters: { docs: { source: { code: demoSource(linearSource, linearCss, 'linear.css') } } },
};

export const Vertical: Story = {
  render: () => <VerticalDemo />,
  parameters: {
    docs: { source: { code: demoSource(verticalSource, verticalCss, 'vertical.css') } },
  },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};
