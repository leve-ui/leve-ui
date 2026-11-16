import type { ReadonlySignal } from '@builder.io/qwik';
import { createDismissableLayer, createFocusScope, lockScroll } from '@leve-ui/utils';
import type { DialogContext } from './dialog-context';

export type ModalOptions = {
  context: DialogContext;
  closeOnEscape: ReadonlySignal<boolean>;
  closeOnOutsideClick: ReadonlySignal<boolean>;
};

/**
 * Opens the dialog as a modal and wires focus, scroll lock and dismissal. Returns the cleanup,
 * which closes it and returns focus. Runs on the client only.
 */
export function openModal(dialog: HTMLDialogElement, options: ModalOptions): () => void {
  const { context } = options;
  const document = dialog.ownerDocument;
  // WebKit does not focus a button on click, so the element focused before opening may be the
  // body; return focus to the Trigger then
  const previous = document.activeElement;
  function restoreTarget() {
    if (previous instanceof HTMLElement && previous !== document.body && previous.isConnected) {
      return previous;
    }
    return document.getElementById(context.ids.trigger);
  }
  if (!dialog.open) {
    try {
      dialog.showModal();
    } catch {
      // Not a browser with <dialog> support (e.g. the test DOM of @builder.io/qwik/testing)
      return function cleanup() {};
    }
  }
  const unlockScroll = lockScroll();
  const focusScope = createFocusScope(dialog, { trap: true, restoreFocus: restoreTarget });
  function close() {
    if (context.open.value) context.setOpen$(false);
  }
  const layer = createDismissableLayer(dialog, {
    onDismiss: close,
    onEscapeKeyDown(event) {
      if (!options.closeOnEscape.value) event.preventDefault();
    },
  });

  // Escape is handled by the dismissable layer, so that nested layers close one at a time
  function onCancel(event: Event) {
    event.preventDefault();
  }
  // The browser may close the dialog anyway (close watcher rules); follow it
  function onClose() {
    close();
  }
  // A pointer down on the backdrop targets the dialog itself, outside its box
  function onPointerDown(event: PointerEvent) {
    if (event.target !== dialog || !options.closeOnOutsideClick.value) return;
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
    if (dialog.open) dialog.close();
    focusScope.destroy();
    unlockScroll();
  };
}
