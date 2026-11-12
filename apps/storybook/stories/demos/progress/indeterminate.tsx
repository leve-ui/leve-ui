import { component$, useStyles$ } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';
import styles from './indeterminate.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Progress.Root value={null} class="progress-indeterminate">
      <Progress.Label class="progress-indeterminate-label">Uploading</Progress.Label>
      <Progress.ValueText class="progress-indeterminate-value" />
      <Progress.Track class="progress-indeterminate-track">
        <Progress.Indicator class="progress-indeterminate-indicator" />
      </Progress.Track>
    </Progress.Root>
  );
});
