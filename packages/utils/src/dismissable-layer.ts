import { isBrowser } from './env';

/**
 * レイヤーが閉じられる理由。
 *
 * - `'escape-key'`: Escape キーが押下された
 * - `'pointer-down-outside'`: レイヤー外でポインタが押下された
 * - `'focus-outside'`: レイヤー外にフォーカスが移動した
 */
export type DismissReason = 'escape-key' | 'pointer-down-outside' | 'focus-outside';

/**
 * レイヤーのイベントコールバックに渡されるイベントオブジェクト。
 * `preventDefault()` を呼び出すことでレイヤーが閉じられるのを防ぎます。
 */
export interface DismissableLayerEvent<E extends Event = Event> {
  /** レイヤーが閉じられる理由。 */
  readonly reason: DismissReason;
  /** 発生したネイティブイベント。 */
  readonly originalEvent: E;
  /** `preventDefault()` が呼び出されたかどうか。 */
  readonly defaultPrevented: boolean;
  /** レイヤーが閉じられるのを防ぎます（ネイティブイベントの伝播や既定の動作は抑止しません）。 */
  preventDefault(): void;
}

/**
 * `createDismissableLayer` のオプション。
 */
export interface DismissableLayerOptions {
  /**
   * レイヤーが閉じられるときに呼び出されるコールバック。
   * 各イベント固有のコールバックで `preventDefault()` が呼び出されなかった場合に呼び出されます。
   */
  onDismiss: (reason: DismissReason) => void;
  /** Escape キーが押下されたときに呼び出されるコールバック。 */
  onEscapeKeyDown?: (event: DismissableLayerEvent<KeyboardEvent>) => void;
  /** レイヤー外でポインタが押下されたときに呼び出されるコールバック。 */
  onPointerDownOutside?: (event: DismissableLayerEvent<PointerEvent>) => void;
  /** レイヤー外にフォーカスが移動したときに呼び出されるコールバック。 */
  onFocusOutside?: (event: DismissableLayerEvent<FocusEvent>) => void;
  /**
   * レイヤーの一部として扱う要素（トリガーなど）を返す関数。
   * これらの要素への操作は「外側」とは判定されません。判定のたびに呼び出されます。
   */
  branches?: () => Iterable<Element | null | undefined>;
}

/**
 * DismissableLayer のインスタンス。
 */
export interface DismissableLayer {
  /** このレイヤーがスタックの最前面（トップ）にあるかどうかを返します。 */
  isTopmost(): boolean;
  /** レイヤーをスタックおよびリスナーから削除します。べき等であり、複数回呼び出しても安全です。 */
  destroy(): void;
}

interface LayerEntry {
  element: HTMLElement;
  options: DismissableLayerOptions;
  destroyed: boolean;
}

const stack: LayerEntry[] = [];

function isNode(target: unknown): target is Node {
  if (typeof Node !== 'undefined') {
    return target instanceof Node;
  }
  return typeof (target as { nodeType?: unknown } | null)?.nodeType === 'number';
}

function isTargetInside(
  target: EventTarget | null,
  element: HTMLElement,
  branches?: () => Iterable<Element | null | undefined>,
): boolean {
  if (!isNode(target)) {
    return false;
  }
  if (element.contains(target)) {
    return true;
  }
  if (branches) {
    const branchList = branches();
    if (branchList) {
      for (const branch of branchList) {
        if (branch != null && typeof branch.contains === 'function' && branch.contains(target)) {
          return true;
        }
      }
    }
  }
  return false;
}

function createLayerEvent<E extends Event>(
  reason: DismissReason,
  originalEvent: E,
): { event: DismissableLayerEvent<E>; isPrevented: () => boolean } {
  let defaultPrevented = false;
  const event: DismissableLayerEvent<E> = {
    reason,
    originalEvent,
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault() {
      defaultPrevented = true;
    },
  };
  return {
    event,
    isPrevented: () => defaultPrevented,
  };
}

function handleDocumentKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.isComposing) {
    return;
  }
  const topLayer = stack[stack.length - 1];
  if (!topLayer || topLayer.destroyed) {
    return;
  }
  const { event: layerEvent, isPrevented } = createLayerEvent('escape-key', event);
  topLayer.options.onEscapeKeyDown?.(layerEvent);
  if (!isPrevented() && !topLayer.destroyed) {
    topLayer.options.onDismiss('escape-key');
  }
}

function handleDocumentPointerDown(event: PointerEvent) {
  const topLayer = stack[stack.length - 1];
  if (!topLayer || topLayer.destroyed) {
    return;
  }
  if (isTargetInside(event.target, topLayer.element, topLayer.options.branches)) {
    return;
  }
  const { event: layerEvent, isPrevented } = createLayerEvent('pointer-down-outside', event);
  topLayer.options.onPointerDownOutside?.(layerEvent);
  if (!isPrevented() && !topLayer.destroyed) {
    topLayer.options.onDismiss('pointer-down-outside');
  }
}

function handleDocumentFocusIn(event: FocusEvent) {
  const topLayer = stack[stack.length - 1];
  if (!topLayer || topLayer.destroyed) {
    return;
  }
  if (isTargetInside(event.target, topLayer.element, topLayer.options.branches)) {
    return;
  }
  const { event: layerEvent, isPrevented } = createLayerEvent('focus-outside', event);
  topLayer.options.onFocusOutside?.(layerEvent);
  if (!isPrevented() && !topLayer.destroyed) {
    topLayer.options.onDismiss('focus-outside');
  }
}

function addGlobalListeners() {
  document.addEventListener('keydown', handleDocumentKeyDown, true);
  document.addEventListener('pointerdown', handleDocumentPointerDown, true);
  document.addEventListener('focusin', handleDocumentFocusIn, true);
}

function removeGlobalListeners() {
  document.removeEventListener('keydown', handleDocumentKeyDown, true);
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true);
  document.removeEventListener('focusin', handleDocumentFocusIn, true);
}

/**
 * 対象の要素を DismissableLayer としてスタックに登録します。
 *
 * Escape キーの押下、またはレイヤー外でのポインタ押下・フォーカス移動時に最前面のレイヤーを閉じます。
 * スタック構造により、ネストされたレイヤーが存在する場合は最前面のレイヤーのみがイベントに反応します。
 *
 * SSR 環境（`isBrowser` が false）では何も行わない no-op レイヤーを返します。
 *
 * @param element レイヤーの対象要素
 * @param options 各種イベントハンドラや branches の設定
 * @returns レイヤーの破棄や状態取得を行う `DismissableLayer` オブジェクト
 *
 * @example
 * const layer = createDismissableLayer(modalEl, {
 *   onDismiss: (reason) => {
 *     console.log('Close layer:', reason);
 *   },
 * });
 *
 * // レイヤー破棄時
 * layer.destroy();
 */
export const createDismissableLayer = (
  element: HTMLElement,
  options: DismissableLayerOptions,
): DismissableLayer => {
  if (!isBrowser) {
    return {
      isTopmost: () => false,
      destroy: () => {},
    };
  }

  const entry: LayerEntry = {
    element,
    options,
    destroyed: false,
  };

  stack.push(entry);
  if (stack.length === 1) {
    addGlobalListeners();
  }

  return {
    isTopmost: () => !entry.destroyed && stack.length > 0 && stack[stack.length - 1] === entry,
    destroy: () => {
      if (entry.destroyed) {
        return;
      }
      entry.destroyed = true;
      const index = stack.indexOf(entry);
      if (index !== -1) {
        stack.splice(index, 1);
        if (stack.length === 0) {
          removeGlobalListeners();
        }
      }
    },
  };
};
