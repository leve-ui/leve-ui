import { Label } from '@leve-ui/label';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

const meta: Meta = {
  title: 'Components/Label',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '240px' }}>
      <Label.Root for="email">Email</Label.Root>
      <input id="email" type="email" />
    </div>
  ),
};

export const Wrapping: Story = {
  render: () => (
    <Label.Root style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input type="checkbox" />
      Accept terms
    </Label.Root>
  ),
};
