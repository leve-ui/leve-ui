import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { dataAttr, useFieldContext } from '@leve-ui/utils';

export type FieldDescriptionProps = PropsOf<'div'>;

/**
 * フォームコントロールの説明文です。
 *
 * 該当する APG パターンはないため、ネイティブの `<div>` を使用します。
 * Field の中で使用し、`Field.Root` に `hasDescription` を指定することで
 * コントロールの `aria-describedby` と関連付けられます。
 */
export const FieldDescription = component$<FieldDescriptionProps>((props) => {
  const field = useFieldContext();

  return (
    <div
      {...props}
      id={field ? field.ids.description : props.id}
      data-leve-field-description=""
      data-invalid={dataAttr(field?.invalid.value)}
      data-disabled={dataAttr(field?.disabled.value)}
      data-required={dataAttr(field?.required.value)}
    >
      <Slot />
    </div>
  );
});
