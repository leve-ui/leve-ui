import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { comboboxContextId } from './combobox-context';

export type ComboboxEmptyProps = PropsOf<'div'>;

/**
 * 候補がないときの表示です。`List` の外（Content の中）に置き、表示するかどうかは利用者が
 * 絞り込みの結果で決めます（ライブラリは項目の数を描画の前に知らないため）。
 */
export const ComboboxEmpty = component$<ComboboxEmptyProps>((props) => {
  useContext(comboboxContextId);

  return (
    <div {...props} data-leve-combobox-empty="">
      <Slot />
    </div>
  );
});
