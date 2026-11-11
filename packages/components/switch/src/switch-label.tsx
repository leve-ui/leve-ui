import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { switchContextId } from './switch-context';

export type SwitchLabelProps = PropsOf<'label'>;

/**
 * スイッチのラベル要素です。
 *
 * ネイティブの `<label>` を使用し、`for` 属性で `Control` と関連付けられます。
 * ラベルをクリックするとスイッチがトグルします。
 * `Field.Root` の中では同じ ID を描画してしまうため、代わりに `Field.Label` を使用してください。
 * ラベルテキストは状態によって変化させず、状態の伝達には `Control` の `aria-checked` を使用してください。
 */
export const SwitchLabel = component$<SwitchLabelProps>((props) => {
  const context = useContext(switchContextId);

  return (
    <label
      {...props}
      id={context.ids.label}
      for={context.ids.control}
      data-leve-switch-label=""
      data-state={context.checked.value ? 'checked' : 'unchecked'}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </label>
  );
});
