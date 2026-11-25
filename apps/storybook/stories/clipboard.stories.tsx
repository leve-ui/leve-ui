import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ButtonOnlyDemo from './demos/clipboard/button-only';
import buttonOnlySource from './demos/clipboard/button-only?raw';
import buttonOnlyCss from './demos/clipboard/button-only.css?raw';
import CustomTimeoutDemo from './demos/clipboard/custom-timeout';
import customTimeoutSource from './demos/clipboard/custom-timeout?raw';
import customTimeoutCss from './demos/clipboard/custom-timeout.css?raw';
import DefaultDemo from './demos/clipboard/default';
import defaultSource from './demos/clipboard/default?raw';
import defaultCss from './demos/clipboard/default.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/Clipboard',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const ButtonOnly: Story = {
  render: () => <ButtonOnlyDemo />,
  parameters: {
    docs: { source: { code: demoSource(buttonOnlySource, buttonOnlyCss, 'button-only.css') } },
  },
};

export const CustomTimeout: Story = {
  render: () => <CustomTimeoutDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(customTimeoutSource, customTimeoutCss, 'custom-timeout.css') },
    },
  },
};
