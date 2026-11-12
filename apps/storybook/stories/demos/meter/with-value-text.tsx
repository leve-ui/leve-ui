import { component$, useStyles$ } from '@builder.io/qwik';
import { Meter } from '@leve-ui/meter';
import styles from './with-value-text.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Meter.Root value={50} max={200} valueText="50 GB of 200 GB" class="meter-with-value-text">
      <Meter.Label class="meter-with-value-text-label">Storage</Meter.Label>
      <Meter.ValueText class="meter-with-value-text-value" />
      <Meter.Track class="meter-with-value-text-track">
        <Meter.Indicator class="meter-with-value-text-indicator" />
      </Meter.Track>
    </Meter.Root>
  );
});
