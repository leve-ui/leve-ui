import { isBrowser } from './env';

/**
 * フォーカスの対象となる要素、またはそれを返す関数。
 */
export type FocusTarget = HTMLElement | null | undefined | (() => HTMLElement | null | undefined);

/**
 * `createFocusScope` のオプション。
 */
export interface FocusScopeOptions {
  /**
   * このスコープが最前面のトラップである間、Tab / Shift+Tab およびフォーカスをコンテナ内に閉じ込めます。
   *
   * @default false
   */
  trap?: boolean;
  /**
   * スコープ作成時にフォーカスを移動する対象。
   * 指定された要素が存在しない場合は最初の Tab 移動可能要素、それもない場合はコンテナ自身にフォーカスします。
   * `false` の場合はフォーカスを移動しません。
   * 既にコンテナ内にフォーカスがある場合は移動しません。
   *
   * @default undefined (最初の tabbable 要素 → コンテナ)
   */
  initialFocus?: FocusTarget | false;
  /**
   * `destroy()` 呼び出し時のフォーカス復帰先。
   * `undefined` の場合はスコープ作成時にフォーカスされていた要素（DOM に接続されている場合のみ）へ復帰します。
   * `false` の場合は復帰しません。
   */
  restoreFocus?: FocusTarget | false;
}

/**
 * FocusScope のインスタンス。
 */
export interface FocusScope {
  /**
   * スコープをスタックから削除し、トラップを停止してフォーカスを復帰します。べき等です。
   */
  destroy(): void;
}

const TABBABLE_SELECTOR =
  'a[href], area[href], button, input, select, textarea, iframe, summary, audio[controls], video[controls], [contenteditable]:not([contenteditable="false"]), [tabindex]';

function getElementTabIndex(el: HTMLElement): number {
  if (el.hasAttribute('tabindex')) {
    const parsed = parseInt(el.getAttribute('tabindex') ?? '', 10);
    return Number.isNaN(parsed) ? -1 : parsed;
  }
  return Math.max(el.tabIndex, 0);
}

function isElementDisabled(el: HTMLElement): boolean {
  return (
    ('disabled' in el && Boolean((el as HTMLElement & { disabled?: boolean }).disabled)) ||
    el.hasAttribute('disabled')
  );
}

function isHiddenOrInert(el: HTMLElement, container: HTMLElement): boolean {
  let current: HTMLElement | null = el;
  while (current) {
    if (
      current.hasAttribute('hidden') ||
      current.hasAttribute('inert') ||
      (current as HTMLElement & { hidden?: boolean }).hidden ||
      (current as HTMLElement & { inert?: boolean }).inert
    ) {
      return true;
    }
    if (current === container) {
      break;
    }
    current = current.parentElement;
  }
  return false;
}

/**
 * `container` 内の Tab 移動可能な（tabbable な）子孫要素を DOM 順で取得します。
 *
 * `tabIndex >= 0` であり、無効化されておらず、`input[type="hidden"]` ではなく、
 * かつ自身および `container` までの祖先に `hidden` または `inert` が設定されていない要素を返します。
 *
 * @param container 走査対象の親要素
 * @returns Tab 移動可能な子孫要素の配列
 */
export const getTabbableElements = (container: HTMLElement): HTMLElement[] => {
  if (!container || typeof container.querySelectorAll !== 'function') {
    return [];
  }
  const elements = Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR));
  return elements.filter((el) => {
    if (getElementTabIndex(el) < 0) {
      return false;
    }
    if (isElementDisabled(el)) {
      return false;
    }
    if (el.tagName.toLowerCase() === 'input' && (el as HTMLInputElement).type === 'hidden') {
      return false;
    }
    if (isHiddenOrInert(el, container)) {
      return false;
    }
    return true;
  });
};

interface TrapEntry {
  container: HTMLElement;
  lastFocusedInside: HTMLElement | null;
  destroyed: boolean;
}

const trapStack: TrapEntry[] = [];

function getTopmostTrap(): TrapEntry | null {
  for (let i = trapStack.length - 1; i >= 0; i--) {
    if (!trapStack[i].destroyed) {
      return trapStack[i];
    }
  }
  return null;
}

function resolveTarget(target: FocusTarget): HTMLElement | null | undefined {
  if (typeof target === 'function') {
    return target();
  }
  return target;
}

function handleDocumentKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Tab' || event.isComposing) {
    return;
  }
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  const activeTrap = getTopmostTrap();
  if (!activeTrap) {
    return;
  }

  const container = activeTrap.container;
  const tabbables = getTabbableElements(container);

  if (tabbables.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = tabbables[0];
  const last = tabbables[tabbables.length - 1];

  const doc = container.ownerDocument ?? document;
  const activeEl = doc.activeElement as HTMLElement | null;
  const target = event.target as HTMLElement | null;
  const currentFocus =
    activeEl && (container === activeEl || container.contains(activeEl)) ? activeEl : target;

  const isShiftTab = event.shiftKey;

  if (isShiftTab) {
    const isFirst =
      currentFocus != null && (first === currentFocus || first.contains(currentFocus));
    const isContainer = currentFocus === container;
    if (isFirst || isContainer) {
      event.preventDefault();
      last.focus();
    }
  } else {
    const isLast = currentFocus != null && (last === currentFocus || last.contains(currentFocus));
    if (isLast) {
      event.preventDefault();
      first.focus();
    }
  }
}

function isHTMLElement(target: unknown): target is HTMLElement {
  if (typeof HTMLElement !== 'undefined') {
    return target instanceof HTMLElement;
  }
  return (
    typeof target === 'object' &&
    target !== null &&
    (target as { nodeType?: unknown }).nodeType === 1
  );
}

function handleDocumentFocusIn(event: FocusEvent) {
  const activeTrap = getTopmostTrap();
  if (!activeTrap) {
    return;
  }

  const container = activeTrap.container;
  const target = event.target as Node | null;
  if (!target) {
    return;
  }

  if (container === target || container.contains(target)) {
    if (isHTMLElement(target)) {
      activeTrap.lastFocusedInside = target;
    }
    return;
  }

  // target is outside the active container
  if (
    activeTrap.lastFocusedInside?.isConnected &&
    (container === activeTrap.lastFocusedInside || container.contains(activeTrap.lastFocusedInside))
  ) {
    activeTrap.lastFocusedInside.focus();
    return;
  }

  const tabbables = getTabbableElements(container);
  if (tabbables.length > 0) {
    tabbables[0].focus();
    return;
  }

  container.focus();
}

function addGlobalTrapListeners() {
  document.addEventListener('keydown', handleDocumentKeyDown, true);
  document.addEventListener('focusin', handleDocumentFocusIn, true);
}

function removeGlobalTrapListeners() {
  document.removeEventListener('keydown', handleDocumentKeyDown, true);
  document.removeEventListener('focusin', handleDocumentFocusIn, true);
}

/**
 * コンテナ要素に対するフォーカススコープを作成します。
 *
 * 初期フォーカス移動、Tab キーによるコンテナ内循環トラップ、コンテナ外へのフォーカス移動時の引き戻し、
 * および `destroy()` によるフォーカスの復帰を管理します。
 *
 * SSR 環境（`isBrowser` が false）では何も行わない no-op スコープを返します。
 *
 * @param container フォーカススコープの対象コンテナ要素
 * @param options 初期フォーカス、復帰先、トラップの有効化設定
 * @returns スコープの破棄を行う `FocusScope` オブジェクト
 */
export const createFocusScope = (
  container: HTMLElement,
  options?: FocusScopeOptions,
): FocusScope => {
  if (!isBrowser) {
    return {
      destroy: () => {},
    };
  }

  let destroyed = false;
  const doc = container.ownerDocument ?? document;
  const previouslyFocusedElement = doc.activeElement as HTMLElement | null;

  const isFocusAlreadyInside =
    previouslyFocusedElement != null &&
    (container === previouslyFocusedElement || container.contains(previouslyFocusedElement));

  if (options?.initialFocus !== false && !isFocusAlreadyInside) {
    let target: HTMLElement | null | undefined;
    if (options?.initialFocus !== undefined) {
      target = resolveTarget(options.initialFocus);
    }
    if (target != null) {
      target.focus();
    } else {
      const tabbables = getTabbableElements(container);
      if (tabbables.length > 0) {
        tabbables[0].focus();
      } else {
        container.focus();
      }
    }
  }

  const trap = options?.trap ?? false;
  let entry: TrapEntry | null = null;
  if (trap) {
    entry = {
      container,
      lastFocusedInside: null,
      destroyed: false,
    };
    trapStack.push(entry);
    if (trapStack.length === 1) {
      addGlobalTrapListeners();
    }
  }

  return {
    destroy: () => {
      if (destroyed) {
        return;
      }
      destroyed = true;

      if (entry) {
        entry.destroyed = true;
      }

      if (options?.restoreFocus !== false) {
        const restoreTarget =
          options?.restoreFocus !== undefined
            ? resolveTarget(options.restoreFocus)
            : previouslyFocusedElement;

        if (restoreTarget?.isConnected) {
          restoreTarget.focus();
        }
      }

      if (entry) {
        const index = trapStack.indexOf(entry);
        if (index !== -1) {
          trapStack.splice(index, 1);
          if (trapStack.length === 0) {
            removeGlobalTrapListeners();
          }
        }
      }
    },
  };
};
