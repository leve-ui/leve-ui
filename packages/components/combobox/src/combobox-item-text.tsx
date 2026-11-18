import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { comboboxItemContextId } from './combobox-context';

export type ComboboxItemTextProps = PropsOf<'span'>;

/**
 * 項目の文字列です。項目を選ぶと、この文字列が Input に入ります（Item の `textValue` が優先）。
 */
export const ComboboxItemText = component$<ComboboxItemTextProps>((props) => {
  useContext(comboboxItemContextId);

  return (
    <span {...props} data-leve-combobox-item-text="">
      <Slot />
    </span>
  );
});
