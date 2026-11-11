import { component$, type PropsOf, Slot, useComputed$ } from '@builder.io/qwik';
import { dataAttr, type FieldIds, useFieldProvider } from '@leve-ui/utils';

export type FieldRootProps = PropsOf<'div'> & {
  /** adr/0024: IDs are overridden only here */
  ids?: Partial<FieldIds>;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Set to true when Field.Description is used */
  hasDescription?: boolean;
};

/**
 * フォームコントロールにラベル、説明文、エラーメッセージを関連付けるコンテナです。
 *
 * 該当する APG パターンはないため、ネイティブのフォームセマンティクスを使用します。
 * `Field.Description` を使用する場合は `hasDescription` を指定してください（`adr/0024`）。
 * 各パーツの要素 ID を上書きする場合は `ids` プロパティを使用します。
 */
export const FieldRoot = component$<FieldRootProps>(
  ({ ids, invalid, disabled, required, hasDescription, ...props }) => {
    const invalidSignal = useComputed$(() => !!invalid);
    const disabledSignal = useComputed$(() => !!disabled);
    const requiredSignal = useComputed$(() => !!required);
    const hasDescriptionSignal = useComputed$(() => !!hasDescription);

    const context = useFieldProvider({
      ids,
      invalid: invalidSignal,
      disabled: disabledSignal,
      required: requiredSignal,
      hasDescription: hasDescriptionSignal,
    });

    return (
      <div
        {...props}
        data-leve-field=""
        data-invalid={dataAttr(context.invalid.value)}
        data-disabled={dataAttr(context.disabled.value)}
        data-required={dataAttr(context.required.value)}
      >
        <Slot />
      </div>
    );
  },
);
