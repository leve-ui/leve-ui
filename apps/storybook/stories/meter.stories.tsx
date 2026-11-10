import { component$, useSignal } from '@builder.io/qwik';
import { Meter } from '@leve-ui/meter';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

const meta: Meta = {
  title: 'Components/Meter',
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

const Example = component$<{ value: number; max?: number; valueText?: string }>(
  ({ value, max = 100, valueText }) => (
    <Meter.Root value={value} max={max} valueText={valueText}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
        <Meter.Label>Storage</Meter.Label>
        <Meter.ValueText />
      </div>
      <Meter.Track style={trackStyle}>
        <Meter.Indicator
          style={{ height: '100%', width: `${(value / max) * 100}%`, background: '#16a34a' }}
        />
      </Meter.Track>
    </Meter.Root>
  ),
);

export const Default: Story = {
  render: () => <Example value={25} />,
};

export const WithValueText: Story = {
  render: () => <Example value={50} max={200} valueText="50 GB of 200 GB" />,
};

const Interactive = component$(() => {
  const value = useSignal(50);
  return (
    <div>
      <button type="button" onClick$={() => (value.value = Math.max(value.value - 10, 0))}>
        Decrease
      </button>
      <button type="button" onClick$={() => (value.value = Math.min(value.value + 10, 100))}>
        Increase
      </button>
      <Example value={value.value} />
    </div>
  );
});

export const Controlled: Story = {
  render: () => <Interactive />,
};
