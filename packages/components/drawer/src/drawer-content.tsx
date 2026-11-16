import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { openDialogElement } from '@leve-ui/utils';
import { drawerContextId } from './drawer-context';

export type DrawerContentProps = PropsOf<'dialog'> & {
  /**
   * Whether Escape closes the drawer.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Whether a pointer down on the backdrop closes a modal drawer. A non-modal drawer never
   * closes on outside interaction.
   * @default true
   */
  closeOnOutsideClick?: boolean;
};

/**
 * ドロワー本体です。ネイティブの `<dialog>` を使います（`adr/0029`）。
 *
 * - 非モーダル（既定）: `popover="manual"` の `<dialog>` を `showPopover()` で最前面に出します。
 *   ページは操作できるままで、フォーカスは閉じ込めず、外側をクリックしても閉じません。
 * - モーダル（Root の `modal`）: `showModal()` で開き、`aria-modal="true"` を出力して、フォーカスを
 *   閉じ込め、ページのスクロールを止め、背景（`::backdrop`）のクリックで閉じます。
 * - どちらも、開くと最初のフォーカス可能な要素にフォーカスし、Escape で閉じ、閉じるとフォーカスを
 *   Trigger（開く前にフォーカスがあった要素）に戻します。非モーダルで、閉じたときにフォーカスが
 *   ページの別の場所にあれば、フォーカスは動かしません。
 * - 位置は `data-side` を使って CSS で決めてください。
 */
export const DrawerContent = component$<DrawerContentProps>(
  ({ closeOnEscape, closeOnOutsideClick, ...props }) => {
    const context = useContext(drawerContextId);
    const ref = useSignal<HTMLDialogElement>();
    // Read at event time, so that changes to the props apply while the drawer is open
    const closeOnEscapeSignal = useComputed$(() => closeOnEscape ?? true);
    const closeOnOutsideClickSignal = useComputed$(() => closeOnOutsideClick ?? true);

    // biome-ignore lint/correctness/noQwikUseVisibleTask: showModal() / showPopover(), focus and listeners need the DOM; it must also run for a drawer open on load (adr/0029)
    useVisibleTask$(
      ({ track, cleanup }) => {
        const open = track(() => context.open.value);
        const modal = track(() => context.modal.value);
        const dialog = ref.value;
        if (!dialog || !open) return;
        cleanup(
          openDialogElement(dialog, {
            modal,
            open: context.open,
            setOpen$: context.setOpen$,
            triggerId: context.ids.trigger,
            closeOnEscape: closeOnEscapeSignal,
            closeOnOutsideClick: closeOnOutsideClickSignal,
          }),
        );
      },
      { strategy: 'document-ready' },
    );

    return (
      <dialog
        {...props}
        ref={ref}
        id={context.ids.content}
        popover={context.modal.value ? undefined : 'manual'}
        aria-modal={context.modal.value ? 'true' : undefined}
        aria-labelledby={context.ids.title}
        aria-describedby={context.ids.description}
        data-leve-drawer-content=""
        data-state={context.open.value ? 'open' : 'closed'}
        data-side={context.side.value}
      >
        <Slot />
      </dialog>
    );
  },
);
