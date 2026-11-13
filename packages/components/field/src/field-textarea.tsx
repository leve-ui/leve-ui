import { component$, type PropsOf, type Signal } from '@builder.io/qwik';
import { dataAttr, useFieldControl } from '@leve-ui/utils';

export type FieldTextareaProps = PropsOf<'textarea'> & {
  /** A signal synced two-way with the textarea value. */
  'bind:value'?: Signal<string>;
};

/**
 * 複数行のテキスト入力フォームコントロールです。
 *
 * 該当する APG パターンはないため、ネイティブの `<textarea>` を使用します。
 * Field の中ではラベル、説明文、エラーメッセージと自動的に関連付けられます。
 * Field の外でも単体で使用できます。
 */
export const FieldTextarea = component$<FieldTextareaProps>(
  ({ 'bind:value': bindValue, ...props }) => {
    const control = useFieldControl(props);
    const commonProps = {
      ...props,
      id: control.value.id,
      'aria-describedby': control.value.describedBy,
      'aria-invalid': control.value.invalid ? ('true' as const) : undefined,
      disabled: control.value.disabled,
      required: control.value.required,
      'data-leve-field-textarea': '',
      'data-invalid': dataAttr(control.value.invalid),
      'data-disabled': dataAttr(control.value.disabled),
      'data-required': dataAttr(control.value.required),
    };

    if (bindValue !== undefined) {
      return <textarea {...commonProps} bind:value={bindValue} />;
    }
    return <textarea {...commonProps} />;
  },
);
