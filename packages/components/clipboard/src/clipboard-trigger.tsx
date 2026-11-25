import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { clipboardContextId } from './clipboard-context';

export type ClipboardTriggerProps = PropsOf<'button'>;

/**
 * Button that copies the configured value to the clipboard when activated.
 */
export const ClipboardTrigger = component$<ClipboardTriggerProps>(({ onClick$, ...restProps }) => {
  const context = useContext(clipboardContextId);

  return (
    <button
      {...restProps}
      type="button"
      onClick$={[context.copy$, onClick$]}
      data-leve-clipboard-trigger=""
      data-state={context.copied.value ? 'copied' : 'idle'}
      data-copied={dataAttr(context.copied.value)}
    >
      <Slot />
    </button>
  );
});
