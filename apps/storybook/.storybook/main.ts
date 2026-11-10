import type { StorybookConfig } from 'storybook-framework-qwik';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: 'storybook-framework-qwik',
    options: {},
  },
};

export default config;
