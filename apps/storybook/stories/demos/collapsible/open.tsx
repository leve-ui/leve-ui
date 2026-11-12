import { component$, useStyles$ } from '@builder.io/qwik';
import { Collapsible } from '@leve-ui/collapsible';

const styles = `
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

  .collapsible-trigger:disabled,
  .collapsible-trigger[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
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

  return (
    <Collapsible.Root defaultOpen class="collapsible-root">
      <Collapsible.Trigger class="collapsible-trigger">
        <span>What is leve-ui?</span>
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
        A headless, accessible UI component library built for Qwik.
      </Collapsible.Content>
    </Collapsible.Root>
  );
});
