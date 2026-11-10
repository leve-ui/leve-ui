import { Separator } from '@leve-ui/separator';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

const meta: Meta = {
  title: 'Components/Separator',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div>
      <p>Above</p>
      <Separator.Root style={{ height: '1px', background: '#d1d5db', margin: '8px 0' }} />
      <p>Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '24px' }}>
      <span>Left</span>
      <Separator.Root
        orientation="vertical"
        style={{ width: '1px', alignSelf: 'stretch', background: '#d1d5db' }}
      />
      <span>Right</span>
    </div>
  ),
};

export const Decorative: Story = {
  render: () => (
    <div>
      <p>Above</p>
      <Separator.Root
        decorative
        style={{ height: '1px', background: '#d1d5db', margin: '8px 0' }}
      />
      <p>Below</p>
    </div>
  ),
};
