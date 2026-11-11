import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { dataAttr, useFieldContext } from '@leve-ui/utils';

export type FieldErrorMessageProps = PropsOf<'div'>;

/**
 * フォームコントロールのエラーメッセージです。
 *
 * 該当する APG パターンはないため、ネイティブの `<div>` を使用します。
 * `Field.Root` が `invalid` の場合のみ描画されます。
 */
export const FieldErrorMessage = component$<FieldErrorMessageProps>((props) => {
  const field = useFieldContext();

  if (field && !field.invalid.value) {
    return null;
  }

  return (
    <div
      {...props}
      id={field ? field.ids.errorMessage : props.id}
      data-leve-field-error-message=""
      data-invalid={dataAttr(field?.invalid.value)}
      data-disabled={dataAttr(field?.disabled.value)}
      data-required={dataAttr(field?.required.value)}
    >
      <Slot />
    </div>
  );
});
