import { component$, type PropsOf, Slot, useComputed$ } from '@builder.io/qwik';
import { dataAttr, type FieldIds, useFieldProvider } from '@leve-ui/utils';

export type FieldRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. IDs can only be overridden here (adr/0024). */
  ids?: Partial<FieldIds>;
  /**
   * Marks the control as invalid (`aria-invalid`) and shows the ErrorMessage.
   * @default false
   */
  invalid?: boolean;
  /**
   * Disables the control.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the control as required.
   * @default false
   */
  required?: boolean;
  /**
   * Set to `true` when a `Field.Description` is rendered, so that the control is
   * described by it (`aria-describedby`).
   * @default false
   */
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
