import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { popoverContextId } from './popover-context';

export type PopoverTitleProps = PropsOf<'h2'>;

/** ポップオーバーの見出しです。Content の `aria-labelledby` がこの要素を指します。 */
export const PopoverTitle = component$<PopoverTitleProps>((props) => {
  const context = useContext(popoverContextId);

  return (
    <h2 {...props} id={context.ids.title} data-leve-popover-title="">
      <Slot />
    </h2>
  );
});
