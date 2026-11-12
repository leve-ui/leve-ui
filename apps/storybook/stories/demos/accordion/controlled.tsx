import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Accordion } from '@leve-ui/accordion';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const openValues = useSignal<string[]>(['item-1']);

  return (
    <div class="accordion-controlled-wrapper">
      <Accordion.Root collapsible bind:value={openValues} class="accordion-controlled-root">
        <Accordion.Item value="item-1" class="accordion-controlled-item">
          <Accordion.Header class="accordion-controlled-header">
            <Accordion.Trigger class="accordion-controlled-trigger">
              <span>What is leve-ui?</span>
              <LuChevronDown class="accordion-controlled-chevron" aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class="accordion-controlled-content">
            leve-ui is a headless UI component library built for Qwik with full WAI-ARIA compliance.
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-2" class="accordion-controlled-item">
          <Accordion.Header class="accordion-controlled-header">
            <Accordion.Trigger class="accordion-controlled-trigger">
              <span>Is it accessible?</span>
              <LuChevronDown class="accordion-controlled-chevron" aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class="accordion-controlled-content">
            Yes, all components follow WAI-ARIA Authoring Practices Guide (APG) patterns and
            keyboard interactions.
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-3" class="accordion-controlled-item">
          <Accordion.Header class="accordion-controlled-header">
            <Accordion.Trigger class="accordion-controlled-trigger">
              <span>Can I customize the styles?</span>
              <LuChevronDown class="accordion-controlled-chevron" aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class="accordion-controlled-content">
            Yes, leve-ui components are headless and unstyled. You can style them using CSS,
            Tailwind, or any CSS-in-JS library.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <p class="accordion-controlled-status">
        Open items: {openValues.value.length > 0 ? openValues.value.join(', ') : 'none'}
      </p>
    </div>
  );
});
