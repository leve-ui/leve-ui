import { component$, type PropsOf, Slot, useComputed$, useContextProvider } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { fieldsetContextId } from './fieldset-context';

export type FieldsetRootProps = PropsOf<'fieldset'>;

/**
 * 関連するフォームコントロールをまとめ、1 つのラベル（Legend）を付けます。
 *
 * 該当する APG パターンはないため、ネイティブの `<fieldset>` / `<legend>` を使います
 * （暗黙の `role="group"` と、Legend によるアクセシブルネームが付きます）。
 * `disabled` を渡すと、中のフォームコントロールがすべて無効になります。
 */
export const FieldsetRoot = component$<FieldsetRootProps>((props) => {
  const disabled = useComputed$(() => !!props.disabled);

  useContextProvider(fieldsetContextId, { disabled });

  return (
    <fieldset {...props} data-leve-fieldset="" data-disabled={dataAttr(disabled.value)}>
      <Slot />
    </fieldset>
  );
});
