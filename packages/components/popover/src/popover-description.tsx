import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { popoverContextId } from './popover-context';

export type PopoverDescriptionProps = PropsOf<'p'>;

/** ポップオーバーの説明文です。Content の `aria-describedby` がこの要素を指します。 */
export const PopoverDescription = component$<PopoverDescriptionProps>((props) => {
  const context = useContext(popoverContextId);

  return (
    <p {...props} id={context.ids.description} data-leve-popover-description="">
      <Slot />
    </p>
  );
});
