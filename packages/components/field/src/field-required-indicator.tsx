import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { dataAttr, useFieldContext } from '@leve-ui/utils';

export type FieldRequiredIndicatorProps = PropsOf<'span'>;

/**
 * 必須項目であることを視覚的に示すインジケーターです。
 *
 * `Field.Root` が `required` の場合のみ描画されます。
 * 装飾用の要素であるため `aria-hidden="true"` を付与し、ラベルのアクセシブルネームには含まれません。
 */
export const FieldRequiredIndicator = component$<FieldRequiredIndicatorProps>((props) => {
  const field = useFieldContext();

  if (field && !field.required.value) {
    return null;
  }

  return (
    <span
      {...props}
      aria-hidden="true"
      data-leve-field-required-indicator=""
      data-invalid={dataAttr(field?.invalid.value)}
      data-disabled={dataAttr(field?.disabled.value)}
      data-required={dataAttr(field?.required.value)}
      data-readonly={dataAttr(field?.readOnly.value)}
    >
      <Slot />
    </span>
  );
});
