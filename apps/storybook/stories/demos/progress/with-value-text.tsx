import { component$, useStyles$ } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';
import styles from './with-value-text.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Progress.Root value={30} valueText="3 of 10 files" class="progress-with-value-text">
      <Progress.Label class="progress-with-value-text-label">Uploading</Progress.Label>
      <Progress.ValueText class="progress-with-value-text-value" />
      <Progress.Track class="progress-with-value-text-track">
        <Progress.Indicator class="progress-with-value-text-indicator" />
      </Progress.Track>
    </Progress.Root>
  );
});
