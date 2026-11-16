import { component$, type PropsOf, Slot, useComputed$, useContextProvider } from '@builder.io/qwik';
import { dataAttr, fieldsetContextId, useFieldsetContext } from '@leve-ui/utils';

export type FieldsetRootProps = PropsOf<'fieldset'>;

/**
 * 関連するフォームコントロールをまとめ、1 つのラベル（Legend）を付けます。
 *
 * 該当する APG パターンはないため、ネイティブの `<fieldset>` / `<legend>` を使います
 * （暗黙の `role="group"` と、Legend によるアクセシブルネームが付きます）。
 * `disabled` を渡すと、中のフォームコントロールがすべて無効になります。ネイティブの要素だけでなく、
 * leve-ui のフォームコントロール（Checkbox、Switch、Radio Group、Toggle、Toggle Group、Field）も
 * Context を通じて無効になります。入れ子の Fieldset では、祖先が無効なら子孫も無効です。
 */
export const FieldsetRoot = component$<FieldsetRootProps>((props) => {
  const parent = useFieldsetContext();
  const parentDisabled = useComputed$(() => Boolean(parent?.disabled.value));
  const disabled = useComputed$(() => Boolean(props.disabled) || parentDisabled.value);

  useContextProvider(fieldsetContextId, { disabled, parentDisabled });

  return (
    <fieldset {...props} data-leve-fieldset="" data-disabled={dataAttr(disabled.value)}>
      <Slot />
    </fieldset>
  );
});
