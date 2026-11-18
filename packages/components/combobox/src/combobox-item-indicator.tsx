import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { comboboxItemContextId } from './combobox-context';

export type ComboboxItemIndicatorProps = PropsOf<'span'>;

/**
 * 選択中の項目の印です。選択されていない間は `hidden` になります。`aria-selected` が状態を伝えるため、
 * 支援技術からは隠します。
 */
export const ComboboxItemIndicator = component$<ComboboxItemIndicatorProps>((props) => {
  const item = useContext(comboboxItemContextId);

  return (
    <span
      {...props}
      hidden={!item.selected.value}
      aria-hidden="true"
      data-leve-combobox-item-indicator=""
      data-state={item.selected.value ? 'checked' : 'unchecked'}
    >
      <Slot />
    </span>
  );
});
