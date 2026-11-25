import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { clipboardContextId } from './clipboard-context';

export type ClipboardInputProps = PropsOf<'input'>;

/**
 * Optional read-only input displaying the value to be copied.
 */
export const ClipboardInput = component$<ClipboardInputProps>((props) => {
  const context = useContext(clipboardContextId);

  return (
    <input
      {...props}
      value={context.value.value}
      readOnly
      data-leve-clipboard-input=""
      data-state={context.copied.value ? 'copied' : 'idle'}
      data-copied={dataAttr(context.copied.value)}
    />
  );
});
