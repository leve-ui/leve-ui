import { component$, useStyles$ } from '@builder.io/qwik';
import { Clipboard } from '@leve-ui/clipboard';
import { LuCheck, LuCopy } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Clipboard.Root value="pnpm add @leve-ui/clipboard" class="clipboard-default">
      <Clipboard.Input class="clipboard-default-input" aria-label="Install command" />
      <Clipboard.Trigger class="clipboard-default-trigger" aria-label="Copy to clipboard">
        <Clipboard.Indicator class="clipboard-default-indicator">
          <LuCopy class="clipboard-default-icon clipboard-default-icon-idle" aria-hidden="true" />
          <LuCheck
            class="clipboard-default-icon clipboard-default-icon-copied"
            aria-hidden="true"
          />
        </Clipboard.Indicator>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
});
