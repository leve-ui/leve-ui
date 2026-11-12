import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Collapsible } from '@leve-ui/collapsible';

const styles = `
  .collapsible-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .collapsible-external-button {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    background-color: #2563eb;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  .collapsible-external-button:hover {
    background-color: #1d4ed8;
  }

  .collapsible-external-button:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .collapsible-root {
    width: 320px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #ffffff;
    overflow: hidden;
  }

  .collapsible-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 150ms ease;
  }

  .collapsible-trigger:hover {
    background-color: #f9fafb;
  }

  .collapsible-trigger:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
  }

  /* Chevron rotation based on open state */
  .collapsible-chevron {
    width: 16px;
    height: 16px;
    transition: transform 200ms ease;
  }

  .collapsible-trigger[data-state="open"] .collapsible-chevron {
    transform: rotate(180deg);
  }

  .collapsible-content {
    padding: 12px 16px;
    font-size: 14px;
    color: #4b5563;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }
`;

export default component$(() => {
  useStyles$(styles);
  const open = useSignal(false);

  return (
    <div class="collapsible-wrapper">
      <button
        type="button"
        class="collapsible-external-button"
        onClick$={() => {
          open.value = !open.value;
        }}
      >
        {open.value ? 'Close' : 'Open'} from outside
      </button>

      <Collapsible.Root bind:open={open} class="collapsible-root">
        <Collapsible.Trigger class="collapsible-trigger">
          <span>Controlled collapsible</span>
          <svg
            class="collapsible-chevron"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Collapsible.Trigger>
        <Collapsible.Content class="collapsible-content">
          This collapsible state is controlled by an external signal.
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
});
