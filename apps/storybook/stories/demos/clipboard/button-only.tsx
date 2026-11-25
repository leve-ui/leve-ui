import { component$, useStyles$ } from '@builder.io/qwik';
import { Clipboard } from '@leve-ui/clipboard';
import { LuCheck, LuCopy } from '@qwikest/icons/lucide';
import styles from './button-only.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Clipboard.Root value="https://leve-ui.dev" class="clipboard-button-only">
      <Clipboard.Trigger class="clipboard-button-only-trigger">
        <Clipboard.Indicator class="clipboard-button-only-indicator">
          <LuCopy
            class="clipboard-button-only-icon clipboard-button-only-icon-idle"
            aria-hidden="true"
          />
          <LuCheck
            class="clipboard-button-only-icon clipboard-button-only-icon-copied"
            aria-hidden="true"
          />
        </Clipboard.Indicator>
        <span class="clipboard-button-only-label-idle">Copy link</span>
        <span class="clipboard-button-only-label-copied">Copied</span>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
});
