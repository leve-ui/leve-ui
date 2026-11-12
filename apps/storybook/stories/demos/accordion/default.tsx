import { component$, useStyles$ } from '@builder.io/qwik';
import { Accordion } from '@leve-ui/accordion';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Accordion.Root class="accordion-default-root">
      <Accordion.Item value="item-1" class="accordion-default-item">
        <Accordion.Header class="accordion-default-header">
          <Accordion.Trigger class="accordion-default-trigger">
            <span>What is leve-ui?</span>
            <LuChevronDown class="accordion-default-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-default-content">
          leve-ui is a headless UI component library built for Qwik with full WAI-ARIA compliance.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-2" class="accordion-default-item">
        <Accordion.Header class="accordion-default-header">
          <Accordion.Trigger class="accordion-default-trigger">
            <span>Is it accessible?</span>
            <LuChevronDown class="accordion-default-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-default-content">
          Yes, all components follow WAI-ARIA Authoring Practices Guide (APG) patterns and keyboard
          interactions.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-3" class="accordion-default-item">
        <Accordion.Header class="accordion-default-header">
          <Accordion.Trigger class="accordion-default-trigger">
            <span>Can I customize the styles?</span>
            <LuChevronDown class="accordion-default-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-default-content">
          Yes, leve-ui components are headless and unstyled. You can style them using CSS, Tailwind,
          or any CSS-in-JS library.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
});
