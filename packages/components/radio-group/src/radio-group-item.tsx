import {
  $,
  component$,
  type PropsOf,
  type Signal,
  Slot,
  sync$,
  useComputed$,
  useContext,
  useContextProvider,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { dataAttr, moveRovingFocus } from '@leve-ui/utils';
import { radioGroupContextId, radioGroupItemContextId } from './radio-group-context';

export type RadioGroupItemProps = PropsOf<'button'> & {
  /** このラジオボタンの値（必須） */
  value: string;
  /** このラジオボタンを無効化するかどうか */
  disabled?: boolean;
};

/**
 * ラジオグループ内の個別のラジオボタン要素です。
 *
 * `type="button"`、`role="radio"`、`aria-checked` を出力し、
 * ロービングタブインデックスにより矢印キーでの移動と自動選択を処理します。
 */
export const RadioGroupItem = component$<RadioGroupItemProps>((props) => {
  const { value, onClick$, onKeyDown$, ...restProps } = props;
  const context = useContext(radioGroupContextId);
  const internalRef = useSignal<HTMLButtonElement>();
  const buttonRef = (props.ref as Signal<HTMLButtonElement | undefined> | undefined) ?? internalRef;

  const isDisabledSignal = useComputed$(
    () => Boolean(props.disabled) || Boolean(context.disabled.value),
  );
  const isCheckedSignal = useComputed$(() => context.value.value === value);

  useTask$(({ track }) => {
    track(() => props.disabled);
    track(() => context.disabled.value);
    track(() => isDisabledSignal.value);
    track(() => buttonRef.value);

    const disabled = Boolean(props.disabled) || Boolean(context.disabled.value);
    const existing = context.items.find((item) => item.value === value);
    if (!existing) {
      context.items.push({ value, disabled });
    } else {
      existing.disabled = disabled;
    }

    if (typeof document !== 'undefined' && context.items.length > 1) {
      context.items.sort((a, b) => {
        const elA = document.querySelector(`[data-leve-radio-group-item][value="${a.value}"]`);
        const elB = document.querySelector(`[data-leve-radio-group-item][value="${b.value}"]`);
        if (elA && elB) {
          return elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        }
        return 0;
      });
    }
  });

  useContextProvider(radioGroupItemContextId, {
    checked: isCheckedSignal,
    disabled: isDisabledSignal,
  });

  const isChecked = isCheckedSignal.value;
  const isDisabled = isDisabledSignal.value;

  const tabIndexSignal = useComputed$(() => {
    if (isDisabledSignal.value) return -1;

    const selectedValue = context.value.value;

    // 1. If this item is the selected item, it gets 0 (since it is enabled).
    if (selectedValue === value) {
      return 0;
    }

    // 2. If another registered item is enabled and selected, this item cannot be the tab stop.
    const hasOtherEnabledSelected =
      selectedValue !== null &&
      context.items.some((item) => item.value === selectedValue && !item.disabled);
    if (hasOtherEnabledSelected) {
      return -1;
    }

    // 3. Check if the selected item is registered and disabled.
    const selectedItem =
      selectedValue !== null
        ? context.items.find((item) => item.value === selectedValue)
        : undefined;
    const isSelectedDisabled = selectedItem ? selectedItem.disabled : false;

    // 4. If selectedValue is null, or known to be disabled:
    if (selectedValue === null || isSelectedDisabled) {
      const firstEnabled = context.items.find((item) => !item.disabled)?.value ?? value;
      return firstEnabled === value ? 0 : -1;
    }

    // 5. If selectedValue is not registered in context.items yet:
    const matchingRegistered = context.items.some((item) => item.value === selectedValue);
    if (!matchingRegistered) {
      const currentIndex = context.items.findIndex((item) => item.value === value);
      const hasItemsAfter = currentIndex !== -1 && currentIndex < context.items.length - 1;
      if (hasItemsAfter) {
        const firstEnabled = context.items.find((item) => !item.disabled)?.value ?? value;
        return firstEnabled === value ? 0 : -1;
      }
    }

    return -1;
  });

  const preventKeyEvents = sync$((event: KeyboardEvent) => {
    const key = event.key;
    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Enter'
    ) {
      event.preventDefault();
    }
  });

  const internalKeyDown$ = $(async (event: KeyboardEvent, element: HTMLButtonElement) => {
    const key = event.key;
    if (key !== 'ArrowUp' && key !== 'ArrowDown' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
      return;
    }

    const currentButton =
      element ??
      (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-leve-radio-group-item]');
    const root = currentButton?.closest('[data-leve-radio-group]') as HTMLElement | null;
    if (!root || !currentButton) return;

    const allItems = Array.from(
      root.querySelectorAll<HTMLElement>('[data-leve-radio-group-item]'),
    ).filter((el) => el.closest('[data-leve-radio-group]') === root);

    const nextItem = moveRovingFocus(event, allItems, {
      orientation: 'both',
      loop: context.loop.value,
    });

    if (nextItem) {
      const nextValue = nextItem.getAttribute('value');
      if (nextValue !== null) {
        await context.select$(nextValue);
      }
    }
  });

  const internalClick$ = $(async () => {
    if (isDisabled) return;
    await context.select$(value);
  });

  return (
    // biome-ignore lint/a11y/useSemanticElements: APG Radio Group パターンに従い、button に role="radio" を付与するため
    <button
      {...restProps}
      ref={buttonRef}
      type="button"
      role="radio"
      aria-checked={isChecked ? 'true' : 'false'}
      value={value}
      tabIndex={tabIndexSignal.value}
      disabled={isDisabled}
      onClick$={[internalClick$, onClick$]}
      onKeyDown$={[preventKeyEvents, internalKeyDown$, onKeyDown$]}
      data-leve-radio-group-item=""
      data-state={isChecked ? 'checked' : 'unchecked'}
      data-disabled={dataAttr(isDisabled)}
      data-orientation={context.orientation.value}
    >
      <Slot />
    </button>
  );
});
