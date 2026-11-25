import { component$, useStyles$ } from '@builder.io/qwik';
import { Clipboard } from '@leve-ui/clipboard';
import { LuCheck, LuCopy } from '@qwikest/icons/lucide';
import styles from './custom-timeout.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Clipboard.Root value="sk_live_example_12345" timeout={500} class="clipboard-custom-timeout">
      <Clipboard.Input class="clipboard-custom-timeout-input" aria-label="API key" />
      <Clipboard.Trigger class="clipboard-custom-timeout-trigger" aria-label="Copy API key">
        <Clipboard.Indicator class="clipboard-custom-timeout-indicator">
          <LuCopy
            class="clipboard-custom-timeout-icon clipboard-custom-timeout-icon-idle"
            aria-hidden="true"
          />
          <LuCheck
            class="clipboard-custom-timeout-icon clipboard-custom-timeout-icon-copied"
            aria-hidden="true"
          />
        </Clipboard.Indicator>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
});
