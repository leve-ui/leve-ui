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
import { dialogContextId } from './dialog-context';

export type DialogContentProps = PropsOf<'dialog'> & {
  /**
   * Whether Escape closes the dialog. Browsers may still close it when Escape is pressed twice
   * without any other interaction; the state follows.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Whether a pointer down outside the dialog (on its backdrop) closes it.
   * @default true
   */
  closeOnOutsideClick?: boolean;
};

/**
 * ダイアログ本体です。ネイティブの `<dialog>` を `showModal()` で開きます（`adr/0029`）。
 *
 * - `aria-modal="true"`、`aria-labelledby`（Title）、`aria-describedby`（Description）を出力します。
 *   Description を置かない場合、`aria-describedby` は存在しない ID を指しますが、支援技術はそれを無視します。
 * - 開くと最初のフォーカス可能な要素（なければ Content 自身）にフォーカスし、Tab / Shift+Tab を
 *   ダイアログ内に閉じ込め、ページのスクロールを止めます。閉じると、開く前にフォーカスがあった要素に戻ります。
 * - Escape と、背景（`::backdrop`）でのポインタ押下で閉じます（`closeOnEscape` / `closeOnOutsideClick`）。
 * - 背景は `[data-leve-dialog-content]::backdrop` などでスタイルしてください。
 * - SSR では閉じた状態で出力され、`defaultOpen` のダイアログはページの再開後に開きます。
 */
export const DialogContent = component$<DialogContentProps>(
  ({ closeOnEscape, closeOnOutsideClick, ...props }) => {
    const context = useContext(dialogContextId);
    const ref = useSignal<HTMLDialogElement>();
    // Read at event time, so that changes to the props apply while the dialog is open
    const closeOnEscapeSignal = useComputed$(() => closeOnEscape ?? true);
    const closeOnOutsideClickSignal = useComputed$(() => closeOnOutsideClick ?? true);

    // biome-ignore lint/correctness/noQwikUseVisibleTask: showModal(), focus and listeners need the DOM; it must also run for a dialog open on load (adr/0029)
    useVisibleTask$(
      ({ track, cleanup }) => {
        const open = track(() => context.open.value);
        const dialog = ref.value;
        if (!dialog || !open) return;

        cleanup(
          openDialogElement(dialog, {
            modal: true,
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
        aria-modal="true"
        aria-labelledby={context.ids.title}
        aria-describedby={context.ids.description}
        data-leve-dialog-content=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </dialog>
    );
  },
);
