import { component$, useStyles$ } from '@builder.io/qwik';
import { Meter } from '@leve-ui/meter';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Meter.Root value={25} class="meter-default">
      <Meter.Label class="meter-default-label">Storage</Meter.Label>
      <Meter.ValueText class="meter-default-value" />
      <Meter.Track class="meter-default-track">
        <Meter.Indicator class="meter-default-indicator" />
      </Meter.Track>
    </Meter.Root>
  );
});
