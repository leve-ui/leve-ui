import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { clipboardContextId } from './clipboard-context';

export type ClipboardIndicatorProps = PropsOf<'span'>;

/**
 * Visual indicator (e.g. copy/check icon) reflecting the current clipboard state.
 */
export const ClipboardIndicator = component$<ClipboardIndicatorProps>((props) => {
  const context = useContext(clipboardContextId);

  return (
    <span
      {...props}
      aria-hidden="true"
      data-leve-clipboard-indicator=""
      data-state={context.copied.value ? 'copied' : 'idle'}
      data-copied={dataAttr(context.copied.value)}
    >
      <Slot />
    </span>
  );
});
