import { component$, useStyles$ } from '@builder.io/qwik';
import { Meter } from '@leve-ui/meter';

const styles = `
  .meter {
    display: grid;
    grid-template-columns: 1fr auto;
    row-gap: 0.5rem;
    width: 15rem;
  }

  .meter-track {
    grid-column: 1 / -1;
    height: 0.5rem;
    background: #e5e7eb;
    border-radius: 9999px;
    overflow: hidden;
  }

  .meter-indicator {
    height: 100%;
    /* Percentage of the Root value, set by the library */
    width: var(--leve-meter-percent);
    background: #16a34a;
    border-radius: 9999px;
    transition: width 300ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .meter-indicator {
      transition: none;
    }
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Meter.Root value={25} class="meter">
      <Meter.Label>Storage</Meter.Label>
      <Meter.ValueText />
      <Meter.Track class="meter-track">
        <Meter.Indicator class="meter-indicator" />
      </Meter.Track>
    </Meter.Root>
  );
});
