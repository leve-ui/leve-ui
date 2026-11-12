import { component$, useStyles$ } from '@builder.io/qwik';
import { Accordion } from '@leve-ui/accordion';

const styles = `
  .accordion-root {
    width: 100%;
    max-width: 400px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #ffffff;
    overflow: hidden;
  }

  .accordion-item {
    border-bottom: 1px solid #e5e7eb;
  }

  .accordion-item:last-child {
    border-bottom: none;
  }

  .accordion-header {
    margin: 0;
  }

  .accordion-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 14px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 150ms ease;
  }

  .accordion-trigger:hover:not(:disabled):not([data-disabled]) {
    background-color: #f9fafb;
  }

  .accordion-trigger:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
  }

  .accordion-trigger:disabled,
  .accordion-trigger[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Rotate chevron when the item is open */
  .accordion-chevron {
    width: 16px;
    height: 16px;
    transition: transform 200ms ease;
  }

  .accordion-trigger[data-state="open"] .accordion-chevron {
    transform: rotate(180deg);
  }

  .accordion-content {
    padding: 12px 16px;
    font-size: 14px;
    color: #4b5563;
    line-height: 1.5;
    background-color: #f9fafb;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Accordion.Root class="accordion-root">
      <Accordion.Item value="item-1" class="accordion-item">
        <Accordion.Header class="accordion-header">
          <Accordion.Trigger class="accordion-trigger">
            <span>What is leve-ui?</span>
            <svg
              class="accordion-chevron"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-content">
          leve-ui is a headless UI component library built for Qwik with full WAI-ARIA compliance.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-2" class="accordion-item">
        <Accordion.Header class="accordion-header">
          <Accordion.Trigger class="accordion-trigger">
            <span>Is it accessible?</span>
            <svg
              class="accordion-chevron"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-content">
          Yes, all components follow WAI-ARIA Authoring Practices Guide (APG) patterns and keyboard
          interactions.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-3" class="accordion-item">
        <Accordion.Header class="accordion-header">
          <Accordion.Trigger class="accordion-trigger">
            <span>Can I customize the styles?</span>
            <svg
              class="accordion-chevron"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-content">
          Yes, leve-ui components are headless and unstyled. You can style them using CSS, Tailwind,
          or any CSS-in-JS library.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
});
