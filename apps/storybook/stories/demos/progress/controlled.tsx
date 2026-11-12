import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal(0);

  return (
    <div class="progress-controlled-wrapper">
      <Progress.Root value={value.value} class="progress-controlled">
        <Progress.Label class="progress-controlled-label">Uploading</Progress.Label>
        <Progress.ValueText class="progress-controlled-value" />
        <Progress.Track class="progress-controlled-track">
          <Progress.Indicator class="progress-controlled-indicator" />
        </Progress.Track>
      </Progress.Root>
      <div class="progress-controlled-buttons">
        <button
          type="button"
          class="progress-controlled-button"
          onClick$={() => (value.value = Math.min(value.value + 25, 100))}
        >
          Advance
        </button>
        <button type="button" class="progress-controlled-button" onClick$={() => (value.value = 0)}>
          Reset
        </button>
      </div>
    </div>
  );
});
