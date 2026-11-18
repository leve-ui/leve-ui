import type { QRL, ReadonlySignal } from '@builder.io/qwik';
import { createDismissableLayer } from './dismissable-layer';
import { getElementByIdInContainer } from './dom';
import { createFocusScope } from './focus-scope';
import { lockScroll } from './scroll-lock';

/** `openDialogElement` のオプション。 */
export interface DialogElementOptions {
  /**
   * `true`: `showModal()` で開き、フォーカスを閉じ込め、ページのスクロールを止める（Dialog、modal の Drawer）。
   * `false`: `popover="manual"` の要素として `showPopover()` で開き、ページは操作できるままにする
   * （非モーダルの Drawer）。要素に `popover="manual"` を付けておくこと。
   */
  modal: boolean;
  /** 開閉状態。閉じる操作のときに `setOpen$(false)` を呼ぶ */
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => unknown>;
  /** 開く前のフォーカスが `body` だった場合の戻り先（Trigger の ID） */
  triggerId: string;
  /** Escape で閉じるかどうか */
  closeOnEscape: ReadonlySignal<boolean>;
  /** 外側（モーダルでは背景）でのポインタ押下で閉じるかどうか。非モーダルでは常に閉じない */
  closeOnOutsideClick: ReadonlySignal<boolean>;
}

/**
 * ネイティブの `<dialog>` を最前面（top layer）に開き、フォーカスと閉じる操作を配線します（`adr/0029`）。
 * クライアントでだけ呼び出してください。戻り値の関数で閉じ、フォーカスを戻します。
 *
 * - 開くと最初のフォーカス可能な要素（なければ要素自身）にフォーカスします。
 * - 閉じると、開く前にフォーカスがあった要素（`body` だった場合は Trigger）に戻します。
 *   非モーダルでは、閉じたときにフォーカスが要素の外（ページの別の場所）にあれば戻しません。
 * - Escape は `createDismissableLayer` で処理し、入れ子のレイヤーは 1 つずつ閉じます。
 */
export function openDialogElement(
  dialog: HTMLDialogElement,
  options: DialogElementOptions,
): () => void {
  const document = dialog.ownerDocument;
  const { modal } = options;

  // WebKit does not focus a button on click, so the element focused before opening may be the
  // body; return focus to the Trigger then
  const previous = document.activeElement;
  let restore = true;
  function restoreTarget() {
    if (!restore) return null;
    if (previous instanceof HTMLElement && previous !== document.body && previous.isConnected) {
      return previous;
    }
    return getElementByIdInContainer(dialog, options.triggerId);
  }

  try {
    if (modal && !dialog.open) dialog.showModal();
    if (!modal && !dialog.matches(':popover-open')) dialog.showPopover();
  } catch {
    // Not a browser with <dialog> / popover support (e.g. the test DOM of @builder.io/qwik/testing)
    return function cleanup() {};
  }

  const unlockScroll = modal ? lockScroll() : null;
  const focusScope = createFocusScope(dialog, { trap: modal, restoreFocus: restoreTarget });

  function close() {
    if (options.open.value) options.setOpen$(false);
  }
  const layer = createDismissableLayer(dialog, {
    onDismiss: close,
    onEscapeKeyDown(event) {
      if (!options.closeOnEscape.value) event.preventDefault();
    },
    // A non-modal dialog stays open while the page is used
    onPointerDownOutside(event) {
      if (!modal) event.preventDefault();
    },
    onFocusOutside(event) {
      if (!modal) event.preventDefault();
    },
  });

  // Escape is handled by the dismissable layer, so that nested layers close one at a time
  function onCancel(event: Event) {
    event.preventDefault();
  }
  // The browser may close a modal dialog anyway (close watcher rules); follow it
  function onClose() {
    close();
  }
  // A pointer down on the backdrop targets the dialog itself, outside its box
  function onPointerDown(event: PointerEvent) {
    if (!modal || event.target !== dialog || !options.closeOnOutsideClick.value) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) close();
  }
  dialog.addEventListener('cancel', onCancel);
  dialog.addEventListener('close', onClose);
  dialog.addEventListener('pointerdown', onPointerDown);

  return function cleanup() {
    dialog.removeEventListener('cancel', onCancel);
    dialog.removeEventListener('close', onClose);
    dialog.removeEventListener('pointerdown', onPointerDown);
    layer.destroy();
    // Do not take focus back from the page when a non-modal dialog closes from outside
    const active = document.activeElement;
    restore = modal || active === document.body || active === null || dialog.contains(active);
    if (modal && dialog.open) dialog.close();
    if (!modal && dialog.matches(':popover-open')) dialog.hidePopover();
    focusScope.destroy();
    unlockScroll?.();
  };
}
