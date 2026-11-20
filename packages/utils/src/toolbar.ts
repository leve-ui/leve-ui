import {
  $,
  createContextId,
  getPlatform,
  type QRL,
  type ReadonlySignal,
  type Signal,
  useComputed$,
  useContext,
  useId,
  useTask$,
} from '@builder.io/qwik';

/** An item registered with a Toolbar, used only to pick the initial tab stop during SSR. */
export interface ToolbarItemRegistration {
  id: string;
  disabled: boolean;
}

/**
 * `Toolbar.Root` が子孫に提供する Context の値。
 * Toolbar の中の leve-ui のコントロール（Toolbar.Button / Link、Toggle、Toggle Group）は、
 * これを読んでツールバーのロービングタブインデックスに加わります。
 */
export interface ToolbarContext {
  orientation: ReadonlySignal<'horizontal' | 'vertical'>;
  /**
   * 項目の登録順（描画順）の一覧。キー操作では使わず（DOM から読む。`adr/0035`）、
   * 最初のタブストップを SSR で決めるためだけに使います。
   */
  items: ToolbarItemRegistration[];
  /** 最後にフォーカスされた項目の ID（Tab で戻ったときのタブストップ） */
  activeId: Signal<string | null>;
}

/** Toolbar の状態を共有するための Context ID。 */
export const toolbarContextId = createContextId<ToolbarContext>('leve-ui.toolbar');

/** 囲んでいる Toolbar の Context を取得します。Toolbar の外では `null` を返します。 */
export const useToolbarContext = (): ToolbarContext | null => {
  return useContext(toolbarContextId, null);
};

/** `useToolbarItem` の戻り値。 */
export interface ToolbarItemState {
  /** Toolbar の中にあるかどうか */
  inToolbar: boolean;
  /** 要素の `data-leve-toolbar-item` に設定する値。Toolbar の外では `undefined`（属性を出さない） */
  itemId: string | undefined;
  /** 要素に設定する `tabIndex`。Toolbar の外では `undefined` */
  tabIndex: ReadonlySignal<number | undefined>;
  /** 要素の `onFocus$` に加えるハンドラー（最後にフォーカスした項目を覚える） */
  onFocus$: QRL<() => void>;
}

// Items may register out of DOM order (client rendering, items added later); sort them
// by the DOM of this toolbar only (adr/0035). Exported so Qwik can extract the useTask$ QRL.
export function sortToolbarItems(
  el: Element | null | undefined,
  items: ToolbarItemRegistration[],
): void {
  const root = el?.closest('[data-leve-toolbar]');
  if (root && items.length > 1) {
    const order = Array.from(root.querySelectorAll('[data-leve-toolbar-item]'))
      .filter((node) => node.closest('[data-leve-toolbar]') === root)
      .map((node) => node.getAttribute('data-leve-toolbar-item'));
    const rank = new Map(order.map((value, index) => [value, index]));
    items.sort((a, b) => (rank.get(a.id) ?? order.length) - (rank.get(b.id) ?? order.length));
  }
}

/**
 * Toolbar の中のコントロールを、ツールバーのロービングタブインデックスに加えます。
 *
 * - Toolbar の中では項目を登録し、タブストップの項目だけ `tabIndex` を `0`、ほかを `-1` にします。
 *   タブストップは最後にフォーカスされた項目、なければ最初の有効な項目です。
 * - 要素には `data-leve-toolbar-item={item.itemId}` を付けてください。Toolbar はキー操作でこの属性の
 *   要素を探し、登録を DOM の順に並べ替えるためにも使います。
 * - Toolbar の外では何もせず、`tabIndex` は `undefined` です。
 *
 * @param disabled コントロールが無効かどうか（無効な項目はタブストップにならない）
 * @param ref コントロールの要素の ref（省略時は `data-leve-toolbar-item` から要素を探します）
 */
export const useToolbarItem = (
  disabled: ReadonlySignal<boolean>,
  ref?: Signal<Element | undefined>,
): ToolbarItemState => {
  const toolbar = useContext(toolbarContextId, null);
  const id = useId();

  useTask$(({ track, cleanup }) => {
    if (!toolbar) return;
    const isDisabled = track(() => disabled.value);
    const element = track(() => ref?.value);
    const existing = toolbar.items.find((item) => item.id === id);
    if (existing) existing.disabled = isDisabled;
    else toolbar.items.push({ id, disabled: isDisabled });

    if (element) {
      sortToolbarItems(element, toolbar.items);
    } else if (!getPlatform().isServer) {
      queueMicrotask(() => {
        if (typeof document === 'undefined') return;
        sortToolbarItems(document.querySelector(`[data-leve-toolbar-item="${id}"]`), toolbar.items);
      });
    }

    if (!getPlatform().isServer) {
      cleanup(() => {
        const index = toolbar.items.findIndex((item) => item.id === id);
        if (index !== -1) toolbar.items.splice(index, 1);
      });
    }
  });

  const tabIndex = useComputed$(() => {
    if (!toolbar) return undefined;
    if (disabled.value) return -1;
    const active = toolbar.activeId.value;
    const activeEnabled =
      active !== null && toolbar.items.some((item) => item.id === active && !item.disabled);
    const stop = activeEnabled ? active : toolbar.items.find((item) => !item.disabled)?.id;
    return stop === id ? 0 : -1;
  });

  const onFocus$ = $(() => {
    if (toolbar) toolbar.activeId.value = id;
  });

  return { inToolbar: toolbar !== null, itemId: toolbar ? id : undefined, tabIndex, onFocus$ };
};
