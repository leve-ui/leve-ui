import type { QRL, ReadonlySignal } from '@builder.io/qwik';
import { createDismissableLayer } from './dismissable-layer';
import { type FloatingOptions, startFloating } from './floating';
import { createFocusScope } from './focus-scope';

/** `openPopoverElement` のオプション。 */
export interface PopoverElementOptions {
  /** 開閉状態。閉じる操作のときに `setOpen$(false)` を呼ぶ */
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => unknown>;
  /** Trigger の要素。外側の判定から除き（Trigger 自身が開閉する）、フォーカスの戻り先にする */
  trigger: HTMLElement | null;
  /** 位置の基準。省略時は Trigger */
  anchor?: Element | null;
  /** 位置決めのオプション（`adr/0030`） */
  floating: ReadonlyFloatingOptions;
  /** 開いたときにフォーカスを中へ移すかどうか（Popover は移す、Tooltip は移さない） */
  moveFocus: boolean;
  /**
   * `moveFocus` のとき、最初にフォーカスする要素。省略時は最初のフォーカス可能な要素（なければ要素自身）。
   * 例: Menu は最初（または最後）の項目を返す。
   */
  initialFocus?: (() => HTMLElement | null | undefined) | false;
  /**
   * 外側でのポインタ押下で閉じるときに呼ばれます（`closeOnOutsideClick` のとき）。
   * 例: サブメニューの外側、親メニューの外側を押したら親メニューも閉じる。
   */
  onOutsidePointerDown?: (target: EventTarget | null) => void;
  /** Escape で閉じるかどうか */
  closeOnEscape: ReadonlySignal<boolean>;
  /** 外側でのポインタ押下で閉じるかどうか */
  closeOnOutsideClick: ReadonlySignal<boolean>;
}

type ReadonlyFloatingOptions = Readonly<Omit<FloatingOptions, 'arrow'>> & {
  /** 矢印の要素を探すセレクター（例: `'[data-leve-popover-arrow]'`） */
  arrowSelector?: string;
};

/**
 * `popover="manual"` の要素を最前面（top layer）に開き、位置決め・フォーカス・閉じる操作を配線します
 * （`adr/0029`、`adr/0030`）。クライアントでだけ呼び出してください。戻り値の関数で閉じます。
 *
 * - Floating UI で Trigger（または `anchor`）の隣に置き、開いている間だけ位置を更新します。
 * - `moveFocus` のときは、最初のフォーカス可能な要素（なければ要素自身）にフォーカスを移します。
 * - Escape、外側でのポインタ押下、外側へのフォーカス移動で閉じます。Trigger は外側に含めません。
 * - Escape や Close で閉じたときは Trigger にフォーカスを戻し、外側の操作で閉じたときは戻しません。
 */
export function openPopoverElement(
  element: HTMLElement,
  options: PopoverElementOptions,
): () => void {
  const document = element.ownerDocument;
  try {
    if (!element.matches(':popover-open')) element.showPopover();
  } catch {
    // Not a browser with popover support (e.g. the test DOM of @builder.io/qwik/testing)
    return function cleanup() {};
  }

  const { arrowSelector, ...floatingOptions } = options.floating;
  const arrow = arrowSelector ? element.querySelector<HTMLElement>(arrowSelector) : null;
  let dismissedOutside = false;
  let restore = true;
  let closed = false;
  function restoreTarget() {
    return restore ? options.trigger : null;
  }
  // Focus moves in only after the first positioning: focusing earlier would scroll the page to
  // where the browser first renders the popover
  let focusScope: ReturnType<typeof createFocusScope> | null = null;
  function onPositioned() {
    if (focusScope || closed || !options.moveFocus) return;
    focusScope = createFocusScope(element, {
      trap: false,
      initialFocus: options.initialFocus,
      restoreFocus: restoreTarget,
    });
  }
  const stopFloating = startFloating(options.anchor ?? options.trigger ?? element, element, {
    ...floatingOptions,
    arrow,
    onUpdate: onPositioned,
  });

  function close() {
    if (options.open.value) options.setOpen$(false);
  }
  const layer = createDismissableLayer(element, {
    onDismiss(reason) {
      if (reason !== 'escape-key') dismissedOutside = true;
      close();
    },
    onEscapeKeyDown(event) {
      if (!options.closeOnEscape.value) event.preventDefault();
    },
    onPointerDownOutside(event) {
      if (!options.closeOnOutsideClick.value) event.preventDefault();
      else options.onOutsidePointerDown?.(event.originalEvent.target);
    },
    onFocusOutside(event) {
      // Only a popover that took focus closes when focus leaves it
      if (!options.moveFocus) event.preventDefault();
    },
    branches() {
      return [options.trigger];
    },
  });

  // WebKit moves focus to the body when Tab leaves the last element of a top-layer popover, so no
  // focusin reaches the dismissable layer; close then. When the window loses focus, the active
  // element does not change, so that case is not closed.
  // WebKit also does not focus a button on click: pressing the Trigger moves focus to the body
  // too, and the Trigger then toggles the popover itself.
  let triggerPressed = false;
  function onTriggerPointerDown() {
    triggerPressed = true;
  }
  function onTriggerPointerUp() {
    setTimeout(() => {
      triggerPressed = false;
    }, 0);
  }
  function onFocusOut(event: FocusEvent) {
    if (!options.moveFocus || event.relatedTarget) return;
    setTimeout(() => {
      if (triggerPressed) return;
      const active = document.activeElement;
      if (active === null || active === document.body) close();
    }, 0);
  }
  element.addEventListener('focusout', onFocusOut);
  options.trigger?.addEventListener('pointerdown', onTriggerPointerDown);
  options.trigger?.addEventListener('pointerup', onTriggerPointerUp);

  return function cleanup() {
    closed = true;
    element.removeEventListener('focusout', onFocusOut);
    options.trigger?.removeEventListener('pointerdown', onTriggerPointerDown);
    options.trigger?.removeEventListener('pointerup', onTriggerPointerUp);
    layer.destroy();
    stopFloating();
    // Return focus only when it was inside, not after the user moved on to the page
    const active = document.activeElement;
    restore =
      !dismissedOutside &&
      (active === null || active === document.body || element.contains(active));
    try {
      if (element.matches(':popover-open')) element.hidePopover();
    } catch {
      // Already removed from the document
    }
    focusScope?.destroy();
  };
}
