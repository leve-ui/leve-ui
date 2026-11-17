import {
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
} from '@builder.io/qwik';
import { useControllableState } from '@leve-ui/utils';
import { type MenuIds, type MenuPoint, menuContextId } from './menu-context';

export type MenuRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. */
  ids?: Partial<MenuIds>;
  /**
   * Whether the menu is open initially (uncontrolled). It opens when the page resumes.
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the menu opens or closes by a user interaction. */
  onOpenChange$?: QRL<(open: boolean) => void>;
  /**
   * Whether ArrowDown on the last item moves to the first one, and ArrowUp on the first to the last.
   * @default false
   */
  loop?: boolean;
};

/**
 * メニュー（ボタンで開く操作の一覧）のルート要素です。開閉状態を持ち、Context を提供します。
 *
 * WAI-ARIA APG の Menu Button パターンに準拠します。Content は `popover="manual"` で最前面に出し
 * （`adr/0029`）、Floating UI で Trigger の隣に置きます（`adr/0030`）。項目のフォーカスは
 * ロービングフォーカスで、項目の一覧はキー操作のときに DOM から読みます（`adr/0035`）。
 *
 * `Menu.Trigger` の代わりに `Menu.ContextTrigger` を置くと、右クリックで開くコンテキストメニューになります。
 * 1 つの Root に Trigger と ContextTrigger の両方は置けません。
 */
export const MenuRoot = component$<MenuRootProps>(
  ({
    ids: propIds,
    defaultOpen = false,
    'bind:open': bindOpen,
    onOpenChange$,
    loop: _loop,
    ...props
  }) => {
    const [open, setOpen$] = useControllableState({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });
    const initialFocus = useSignal<'first' | 'last'>('first');
    const loop = useComputed$(() => Boolean(_loop));
    const point = useSignal<MenuPoint | null>(null);

    const base = useId();
    const ids: MenuIds = {
      trigger: propIds?.trigger ?? `${base}-trigger`,
      content: propIds?.content ?? `${base}-content`,
    };

    useContextProvider(menuContextId, { ids, open, setOpen$, initialFocus, loop, point });

    return (
      <div {...props} data-leve-menu="" data-state={open.value ? 'open' : 'closed'}>
        <Slot />
      </div>
    );
  },
);
