import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Meter } from '@leve-ui/meter';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal(50);

  return (
    <div class="meter-controlled-wrapper">
      <Meter.Root value={value.value} class="meter-controlled">
        <Meter.Label class="meter-controlled-label">Storage</Meter.Label>
        <Meter.ValueText class="meter-controlled-value" />
        <Meter.Track class="meter-controlled-track">
          <Meter.Indicator class="meter-controlled-indicator" />
        </Meter.Track>
      </Meter.Root>
      <div class="meter-controlled-buttons">
        <button
          type="button"
          class="meter-controlled-button"
          onClick$={() => (value.value = Math.max(value.value - 10, 0))}
        >
          Decrease
        </button>
        <button
          type="button"
          class="meter-controlled-button"
          onClick$={() => (value.value = Math.min(value.value + 10, 100))}
        >
          Increase
        </button>
      </div>
    </div>
  );
});
