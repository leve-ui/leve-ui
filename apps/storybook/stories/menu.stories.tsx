import type { Meta, StoryObj } from 'storybook-framework-qwik';
import CheckableDemo from './demos/menu/checkable';
import checkableSource from './demos/menu/checkable?raw';
import checkableCss from './demos/menu/checkable.css?raw';
import ContextDemo from './demos/menu/context';
import contextSource from './demos/menu/context?raw';
import contextCss from './demos/menu/context.css?raw';
import DefaultDemo from './demos/menu/default';
import defaultSource from './demos/menu/default?raw';
import defaultCss from './demos/menu/default.css?raw';
import LinksDemo from './demos/menu/links';
import linksSource from './demos/menu/links?raw';
import linksCss from './demos/menu/links.css?raw';
import SubmenuDemo from './demos/menu/submenu';
import submenuSource from './demos/menu/submenu?raw';
import submenuCss from './demos/menu/submenu.css?raw';
import { demoSource } from './source';

// 各ストーリーは demos/menu/ の component$ を描画し、そのソースを Docs の「Show code」に表示する
const meta: Meta = {
  title: 'Components/Menu',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Checkable: Story = {
  render: () => <CheckableDemo />,
  parameters: {
    docs: { source: { code: demoSource(checkableSource, checkableCss, 'checkable.css') } },
  },
};

export const Submenu: Story = {
  render: () => <SubmenuDemo />,
  parameters: {
    docs: { source: { code: demoSource(submenuSource, submenuCss, 'submenu.css') } },
  },
};

export const Context: Story = {
  render: () => <ContextDemo />,
  parameters: {
    docs: { source: { code: demoSource(contextSource, contextCss, 'context.css') } },
  },
};

export const Links: Story = {
  render: () => <LinksDemo />,
  parameters: {
    docs: { source: { code: demoSource(linksSource, linksCss, 'links.css') } },
  },
};
