import { component$, useSignal } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

const meta: Meta = {
  title: 'Components/Progress',
};

export default meta;

type Story = StoryObj;

const trackStyle = {
  width: '240px',
  height: '8px',
  background: '#e5e7eb',
  borderRadius: '9999px',
  overflow: 'hidden',
};

const Example = component$<{ value: number | null; valueText?: string }>(({ value, valueText }) => (
  <Progress.Root value={value} valueText={valueText}>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
      <Progress.Label>Uploading</Progress.Label>
      <Progress.ValueText />
    </div>
    <Progress.Track style={trackStyle}>
      <Progress.Indicator
        style={{
          height: '100%',
          width: value === null ? '30%' : `${value}%`,
          background: '#2563eb',
        }}
      />
    </Progress.Track>
  </Progress.Root>
));

export const Default: Story = {
  render: () => <Example value={40} />,
};

export const Indeterminate: Story = {
  render: () => <Example value={null} />,
};

export const WithValueText: Story = {
  render: () => <Example value={30} valueText="3 of 10 files" />,
};

const Interactive = component$(() => {
  const value = useSignal(0);
  return (
    <div>
      <button type="button" onClick$={() => (value.value = Math.min(value.value + 25, 100))}>
        Advance
      </button>
      <Example value={value.value} />
    </div>
  );
});

export const Controlled: Story = {
  render: () => <Interactive />,
};
