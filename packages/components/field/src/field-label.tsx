import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { dataAttr, useFieldContext } from '@leve-ui/utils';

export type FieldLabelProps = PropsOf<'label'>;

/**
 * フォームコントロールのラベルです。
 *
 * 該当する APG パターンはないため、ネイティブの `<label>` を使用します。
 * Field の中ではコントロールの ID と自動的に関連付けられます。
 */
export const FieldLabel = component$<FieldLabelProps>((props) => {
  const field = useFieldContext();

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: コントロールとの関連付けは Field Context の for 属性で行う
    <label
      {...props}
      id={field ? field.ids.label : props.id}
      for={field ? field.ids.control : props.for}
      data-leve-field-label=""
      data-invalid={dataAttr(field?.invalid.value)}
      data-disabled={dataAttr(field?.disabled.value)}
      data-required={dataAttr(field?.required.value)}
    >
      <Slot />
    </label>
  );
});
