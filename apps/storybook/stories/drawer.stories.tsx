import type { Meta, StoryObj } from 'storybook-framework-qwik';
import DefaultDemo from './demos/drawer/default';
import defaultSource from './demos/drawer/default?raw';
import defaultCss from './demos/drawer/default.css?raw';
import ModalDemo from './demos/drawer/modal';
import modalSource from './demos/drawer/modal?raw';
import modalCss from './demos/drawer/modal.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/drawer/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Drawer',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Modal: Story = {
  render: () => <ModalDemo />,
  parameters: { docs: { source: { code: demoSource(modalSource, modalCss, 'modal.css') } } },
};
