import { Avatar } from '@levis-ui/avatar';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

const avatarStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '9999px',
  overflow: 'hidden',
  background: '#e5e7eb',
  fontWeight: 600,
};

const meta: Meta = {
  title: 'Components/Avatar',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Avatar.Root style={avatarStyle}>
      <Avatar.Image src="https://i.pravatar.cc/96?img=5" alt="Sample user" width={48} height={48} />
      <Avatar.Fallback>LU</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar.Root style={avatarStyle}>
      <Avatar.Image src="/not-found.png" alt="Broken image" />
      <Avatar.Fallback>LU</Avatar.Fallback>
    </Avatar.Root>
  ),
};
