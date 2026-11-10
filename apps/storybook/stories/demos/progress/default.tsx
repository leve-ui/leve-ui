import { component$, useStyles$ } from '@builder.io/qwik';
import { Progress } from '@leve-ui/progress';

const styles = `
  .progress {
    display: grid;
    grid-template-columns: 1fr auto;
    row-gap: 0.5rem;
    width: 15rem;
  }

  .progress-track {
    grid-column: 1 / -1;
    height: 0.5rem;
    background: #e5e7eb;
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-indicator {
    height: 100%;
    /* Percentage of the Root value, set by the library */
    width: var(--leve-progress-percent);
    background: #2563eb;
    border-radius: 9999px;
    transition: width 300ms ease-out;
  }

  /* No percentage while indeterminate, so slide a fixed-width bar instead */
  .progress-indicator[data-state='indeterminate'] {
    width: 50%;
    animation: progress-indeterminate 1s ease-in-out infinite;
  }

  @keyframes progress-indeterminate {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(200%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .progress-indicator {
      transition: none;
    }

    .progress-indicator[data-state='indeterminate'] {
      animation: none;
      opacity: 0.5;
    }
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Progress.Root value={40} class="progress">
      <Progress.Label>Uploading</Progress.Label>
      <Progress.ValueText />
      <Progress.Track class="progress-track">
        <Progress.Indicator class="progress-indicator" />
      </Progress.Track>
    </Progress.Root>
  );
});
