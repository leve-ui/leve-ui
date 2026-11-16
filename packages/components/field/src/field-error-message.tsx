import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { dataAttr, useFieldContext } from '@leve-ui/utils';

export type FieldErrorMessageProps = PropsOf<'div'>;

/**
 * フォームコントロールのエラーメッセージです。
 *
 * 該当する APG パターンはないため、ネイティブの `<div>` を使用します。
 * `Field.Root` が `invalid` の場合のみ描画されます。
 *
 * 表示されたときにスクリーンリーダーが読み上げるよう、`role="alert"` を出力します
 * （WCAG 4.1.3 Status Messages）。要素ごと挿入されるため、挿入後に内容が変わることを
 * 前提とする `aria-live` ではなく、挿入時に読み上げられる `alert` を使います。
 * 割り込まずに読み上げたい場合は `role="status"` を渡して上書きできます。
 */
export const FieldErrorMessage = component$<FieldErrorMessageProps>((props) => {
  const field = useFieldContext();

  if (field && !field.invalid.value) {
    return null;
  }

  return (
    <div
      role="alert"
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
