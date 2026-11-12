import { component$, useStyles$ } from '@builder.io/qwik';
import { Accordion } from '@leve-ui/accordion';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './collapsible.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Accordion.Root collapsible defaultValue={['item-1']} class="accordion-collapsible-root">
      <Accordion.Item value="item-1" class="accordion-collapsible-item">
        <Accordion.Header class="accordion-collapsible-header">
          <Accordion.Trigger class="accordion-collapsible-trigger">
            <span>What is leve-ui?</span>
            <LuChevronDown class="accordion-collapsible-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-collapsible-content">
          leve-ui is a headless UI component library built for Qwik with full WAI-ARIA compliance.{' '}
          <a href="#learn-more" class="accordion-collapsible-link">
            Learn more about leve-ui
          </a>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-2" class="accordion-collapsible-item">
        <Accordion.Header class="accordion-collapsible-header">
          <Accordion.Trigger class="accordion-collapsible-trigger">
            <span>Is it accessible?</span>
            <LuChevronDown class="accordion-collapsible-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-collapsible-content">
          Yes, all components follow WAI-ARIA Authoring Practices Guide (APG) patterns and keyboard
          interactions.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-3" class="accordion-collapsible-item">
        <Accordion.Header class="accordion-collapsible-header">
          <Accordion.Trigger class="accordion-collapsible-trigger">
            <span>Can I customize the styles?</span>
            <LuChevronDown class="accordion-collapsible-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-collapsible-content">
          Yes, leve-ui components are headless and unstyled. You can style them using CSS, Tailwind,
          or any CSS-in-JS library.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
});
