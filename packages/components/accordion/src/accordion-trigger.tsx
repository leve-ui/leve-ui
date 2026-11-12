import { $, component$, type PropsOf, Slot, sync$, useContext } from '@builder.io/qwik';
import { dataAttr, getRovingIndex } from '@leve-ui/utils';
import { accordionContextId, accordionItemContextId } from './accordion-context';

export type AccordionTriggerProps = PropsOf<'button'>;

/**
 * キーボードイベントによるスクロール等のブラウザ既定挙動を同期的に抑止します。
 */
export const syncKeyDown$ = sync$((event: KeyboardEvent, target: HTMLElement) => {
  const el = target || (event.currentTarget as HTMLElement);
  const orientation = el?.getAttribute('data-orientation');
  const isHorizontal = orientation === 'horizontal';
  const key = event.key;
  const isHorizontalKey = isHorizontal && (key === 'ArrowRight' || key === 'ArrowLeft');
  const isVerticalKey = !isHorizontal && (key === 'ArrowDown' || key === 'ArrowUp');
  if (isHorizontalKey || isVerticalKey || key === 'Home' || key === 'End') {
    event.preventDefault();
  }
});

/**
 * コンテンツ領域の表示・非表示を切り替えるトリガーボタンです。
 *
 * WAI-ARIA APG の Accordion パターンに準拠し、`type="button"`、
 * `aria-expanded`、および Content 要素を指す `aria-controls` を出力します。
 * 非折りたたみ可能な単一選択モード（`single` かつ `collapsible=false`）で開いている項目には
 * `aria-disabled="true"` を付与します。
 */
export const AccordionTrigger = component$<AccordionTriggerProps>(
  ({ onClick$, onKeyDown$, ...props }) => {
    const rootContext = useContext(accordionContextId);
    const itemContext = useContext(accordionItemContextId);

    const isNonCollapsibleOpen =
      itemContext.open.value &&
      rootContext.type.value === 'single' &&
      !rootContext.collapsible.value;
    const ariaDisabled = !itemContext.disabled.value && isNonCollapsibleOpen ? 'true' : undefined;

    const handleClick$ = $(async () => {
      if (itemContext.disabled.value) return;
      await rootContext.toggleItem$(itemContext.value);
    });

    const handleKeyDown$ = $(async (event: KeyboardEvent, currentTarget: HTMLElement) => {
      const key = event.key;
      const orientation = rootContext.orientation.value;
      const isHorizontal = orientation === 'horizontal';
      const isHorizontalKey = isHorizontal && (key === 'ArrowRight' || key === 'ArrowLeft');
      const isVerticalKey = !isHorizontal && (key === 'ArrowDown' || key === 'ArrowUp');
      const isNavKey = isHorizontalKey || isVerticalKey || key === 'Home' || key === 'End';

      if (!isNavKey) return;

      const target = (currentTarget || event.currentTarget) as HTMLButtonElement | null;
      if (!target) return;
      const root = target.closest('[data-leve-accordion]');
      if (!root) return;

      const allTriggers = Array.from(
        root.querySelectorAll<HTMLButtonElement>('[data-leve-accordion-trigger]'),
      ).filter((el) => el.closest('[data-leve-accordion]') === root);

      const currentIndex = allTriggers.indexOf(target);
      if (currentIndex === -1) return;

      const isFocusable = allTriggers.map((el) => !el.disabled);

      const computedDir =
        typeof window !== 'undefined' && typeof window.getComputedStyle === 'function'
          ? (window.getComputedStyle(target).direction as 'ltr' | 'rtl')
          : 'ltr';
      const dir: 'ltr' | 'rtl' = computedDir === 'rtl' ? 'rtl' : 'ltr';

      const nextIndex = getRovingIndex(key, currentIndex, isFocusable, {
        orientation,
        loop: rootContext.loop.value,
        dir,
      });

      if (nextIndex !== null && allTriggers[nextIndex]) {
        allTriggers[nextIndex].focus();
      }
    });

    return (
      <button
        {...props}
        type="button"
        id={itemContext.ids.trigger}
        aria-expanded={itemContext.open.value ? 'true' : 'false'}
        aria-controls={itemContext.ids.content}
        aria-disabled={ariaDisabled}
        disabled={itemContext.disabled.value}
        onClick$={[handleClick$, onClick$]}
        onKeyDown$={[syncKeyDown$, handleKeyDown$, onKeyDown$]}
        data-leve-accordion-trigger=""
        data-state={itemContext.open.value ? 'open' : 'closed'}
        data-disabled={dataAttr(itemContext.disabled.value)}
        data-orientation={rootContext.orientation.value}
      >
        <Slot />
      </button>
    );
  },
);
