import { component$, useSignal } from '@builder.io/qwik';
import { Alert } from '@leve-ui/alert';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

const meta: Meta = {
  title: 'Components/Alert',
};

export default meta;

type Story = StoryObj;

const alertStyle = {
  border: '1px solid #fca5a5',
  background: '#fef2f2',
  padding: '12px',
  borderRadius: '6px',
};

export const Default: Story = {
  render: () => (
    <Alert.Root style={alertStyle}>
      <Alert.Title style={{ fontWeight: 600 }}>Payment failed</Alert.Title>
      <Alert.Description>Check your card details and try again.</Alert.Description>
    </Alert.Root>
  ),
};

const Triggered = component$(() => {
  const visible = useSignal(false);
  return (
    <div>
      <button type="button" onClick$={() => (visible.value = true)}>
        Submit
      </button>
      {visible.value && (
        <Alert.Root style={alertStyle}>
          <Alert.Title style={{ fontWeight: 600 }}>Submission failed</Alert.Title>
          <Alert.Description>Email is required.</Alert.Description>
        </Alert.Root>
      )}
    </div>
  );
});

export const OnSubmit: Story = {
  render: () => <Triggered />,
};
