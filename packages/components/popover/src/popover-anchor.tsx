import {
  type Component,
  component$,
  getPlatform,
  type PropsOf,
  Slot,
  useContext,
  useTask$,
} from '@builder.io/qwik';
import { popoverContextId } from './popover-context';

export type PopoverAnchorProps = PropsOf<'div'> & {
  /**
   * The element or component to render instead of `<div>`. A component must spread the props it receives onto one element.
   * @default 'div'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * Trigger ではなく、この要素の隣に Content を置きたいときに使います（任意）。
 * 例: 入力欄の横のボタンで開くが、入力欄の下に出したい場合に、入力欄を Anchor で囲む。
 * `as` でほかの要素やコンポーネントに差し替えられます。
 */
export const PopoverAnchor = component$<PopoverAnchorProps>(
  ({ as: Component = 'div', ...props }) => {
    const context = useContext(popoverContextId);
    const Element = Component as 'div';

    useTask$(({ cleanup }) => {
      context.hasAnchor.value = true;
      if (!getPlatform().isServer) {
        cleanup(() => {
          context.hasAnchor.value = false;
        });
      }
    });

    return (
      <Element {...props} id={context.ids.anchor} data-leve-popover-anchor="">
        <Slot />
      </Element>
    );
  },
);
