import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { checkboxContextId, getCheckboxDataState } from './checkbox-context';

export type CheckboxLabelProps = PropsOf<'label'>;

/**
 * チェックボックスのラベル要素です。
 *
 * ネイティブの `<label>` を使用し、`for` 属性で `Control` と関連付けられます。
 * ラベルをクリックするとチェックボックスがトグルします。
 * `Field.Root` の中では同じ ID を描画してしまうため、代わりに `Field.Label` を使用してください。
 * ラベルテキストは状態によって変化させず、状態の伝達には `Control` の `aria-checked` を使用してください。
 */
export const CheckboxLabel = component$<CheckboxLabelProps>((props) => {
  const context = useContext(checkboxContextId);

  const state = getCheckboxDataState(context.checked.value);

  return (
    <label
      {...props}
      id={context.ids.label}
      for={context.ids.control}
      data-leve-checkbox-label=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </label>
  );
});
