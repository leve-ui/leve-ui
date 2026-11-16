import {
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import { useControllableState } from '@leve-ui/utils';
import { type DrawerIds, type DrawerSide, drawerContextId } from './drawer-context';

export type DrawerRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. */
  ids?: Partial<DrawerIds>;
  /**
   * Whether the drawer is open initially (uncontrolled). The drawer opens when the page resumes,
   * since it is shown from the client.
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the drawer opens or closes by a user interaction. */
  onOpenChange$?: QRL<(open: boolean) => void>;
  /**
   * Whether the drawer is modal: it traps focus, blocks the page and closes on outside click,
   * like a Dialog. By default the page stays usable while the drawer is open.
   * @default false
   */
  modal?: boolean;
  /**
   * The edge of the screen the drawer is attached to. Only sets `data-side`; place it with CSS.
   * @default 'right'
   */
  side?: DrawerSide;
};

/**
 * ドロワー（画面の端から出るパネル）のルート要素です。開閉状態を持ち、子パーツに Context を提供します。
 *
 * 既定では非モーダルのダイアログです（`adr/0028`）。開いている間もページを操作でき、
 * フォーカスは閉じ込めず、外側をクリックしても閉じません。`modal` を付けると、
 * WAI-ARIA APG の Dialog (Modal) パターンに従うモーダルになります。
 * Content はネイティブの `<dialog>` で、最前面（top layer）に描画します（`adr/0029`）。
 */
export const DrawerRoot = component$<DrawerRootProps>(
  ({
    ids: propIds,
    defaultOpen = false,
    'bind:open': bindOpen,
    onOpenChange$,
    modal: _modal,
    side: _side,
    ...props
  }) => {
    const [open, setOpen$] = useControllableState({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });
    const modal = useComputed$(() => Boolean(_modal));
    const side = useComputed$(() => _side ?? 'right');

    const base = useId();
    const ids: DrawerIds = {
      trigger: propIds?.trigger ?? `${base}-trigger`,
      content: propIds?.content ?? `${base}-content`,
      title: propIds?.title ?? `${base}-title`,
      description: propIds?.description ?? `${base}-description`,
    };

    useContextProvider(drawerContextId, { ids, open, setOpen$, modal, side });

    return (
      <div
        {...props}
        data-leve-drawer=""
        data-state={open.value ? 'open' : 'closed'}
        data-side={side.value}
      >
        <Slot />
      </div>
    );
  },
);
