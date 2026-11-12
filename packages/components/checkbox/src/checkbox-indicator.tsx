import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { checkboxContextId, getCheckboxDataState } from './checkbox-context';

export type CheckboxIndicatorProps = PropsOf<'span'>;

/**
 * チェックボックスのチェックマークなどのアイコンを表示する要素です。
 *
 * スクリーンリーダーから隠すため、`aria-hidden="true"` が付与されます。
 * 常に描画され、アイコンの表示/非表示の切り替えは利用者が `[data-state]` 属性セレクタを用いて CSS で行います。
 */
export const CheckboxIndicator = component$<CheckboxIndicatorProps>((props) => {
  const context = useContext(checkboxContextId);

  const state = getCheckboxDataState(context.checked.value);

  return (
    <span
      {...props}
      aria-hidden="true"
      data-leve-checkbox-indicator=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </span>
  );
});
