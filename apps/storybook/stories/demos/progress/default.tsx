import { component$, useStyles$ } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Progress.Root value={40} class="progress-default">
      <Progress.Label class="progress-default-label">Uploading</Progress.Label>
      <Progress.ValueText class="progress-default-value" />
      <Progress.Track class="progress-default-track">
        <Progress.Indicator class="progress-default-indicator" />
      </Progress.Track>
    </Progress.Root>
  );
});
