import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { popoverContextId } from './popover-context';

export type PopoverAnchorProps = PropsOf<'div'>;

/**
 * Trigger ではなく、この要素の隣に Content を置きたいときに使います（任意）。
 * 例: 入力欄の横のボタンで開くが、入力欄の下に出したい場合に、入力欄を Anchor で囲む。
 */
export const PopoverAnchor = component$<PopoverAnchorProps>((props) => {
  const context = useContext(popoverContextId);

  return (
    <div {...props} ref={context.anchor} data-leve-popover-anchor="">
      <Slot />
    </div>
  );
});
