import { component$, useStyles$ } from '@builder.io/qwik';
import { Accordion } from '@leve-ui/accordion';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './multiple.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Accordion.Root type="multiple" defaultValue={['item-1']} class="accordion-multiple-root">
      <Accordion.Item value="item-1" class="accordion-multiple-item">
        <Accordion.Header class="accordion-multiple-header">
          <Accordion.Trigger class="accordion-multiple-trigger">
            <span>What is leve-ui?</span>
            <LuChevronDown class="accordion-multiple-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-multiple-content">
          leve-ui is a headless UI component library built for Qwik with full WAI-ARIA compliance.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-2" class="accordion-multiple-item">
        <Accordion.Header class="accordion-multiple-header">
          <Accordion.Trigger class="accordion-multiple-trigger">
            <span>Is it accessible?</span>
            <LuChevronDown class="accordion-multiple-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-multiple-content">
          Yes, all components follow WAI-ARIA Authoring Practices Guide (APG) patterns and keyboard
          interactions.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-3" class="accordion-multiple-item">
        <Accordion.Header class="accordion-multiple-header">
          <Accordion.Trigger class="accordion-multiple-trigger">
            <span>Can I customize the styles?</span>
            <LuChevronDown class="accordion-multiple-chevron" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="accordion-multiple-content">
          Yes, leve-ui components are headless and unstyled. You can style them using CSS, Tailwind,
          or any CSS-in-JS library.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
});
