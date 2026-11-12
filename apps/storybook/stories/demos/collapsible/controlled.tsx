import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Collapsible } from '@leve-ui/collapsible';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const open = useSignal(false);

  return (
    <div class="collapsible-controlled-wrapper">
      <button
        type="button"
        class="collapsible-controlled-external-button"
        onClick$={() => {
          open.value = !open.value;
        }}
      >
        {open.value ? 'Close' : 'Open'} from outside
      </button>

      <Collapsible.Root bind:open={open} class="collapsible-controlled-root">
        <Collapsible.Trigger class="collapsible-controlled-trigger">
          <span>Controlled collapsible</span>
          <LuChevronDown class="collapsible-controlled-chevron" aria-hidden="true" />
        </Collapsible.Trigger>
        <Collapsible.Content class="collapsible-controlled-content">
          This collapsible state is controlled by an external signal.
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
});
