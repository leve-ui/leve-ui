import { component$, type PropsOf, type Signal } from '@builder.io/qwik';
import { dataAttr, useFieldControl } from '@leve-ui/utils';

export type FieldInputProps = PropsOf<'input'> & {
  /** A signal synced two-way with the input value. */
  'bind:value'?: Signal<string>;
  /** A signal synced two-way with the checked state (for checkbox and radio inputs). */
  'bind:checked'?: Signal<boolean>;
};

/**
 * 1 行のテキスト入力フォームコントロールです。
 *
 * 該当する APG パターンはないため、ネイティブの `<input>` を使用します。
 * Field の中ではラベル、説明文、エラーメッセージと自動的に関連付けられます。
 * Field の外でも単体で使用できます。
 */
export const FieldInput = component$<FieldInputProps>(
  ({ 'bind:value': bindValue, 'bind:checked': bindChecked, ...props }) => {
    const control = useFieldControl(props);
    const commonProps = {
      ...props,
      id: control.value.id,
      'aria-describedby': control.value.describedBy,
      'aria-invalid': control.value.invalid ? ('true' as const) : undefined,
      disabled: control.value.disabled,
      required: control.value.required,
      'data-leve-field-input': '',
      'data-invalid': dataAttr(control.value.invalid),
      'data-disabled': dataAttr(control.value.disabled),
      'data-required': dataAttr(control.value.required),
    };

    if (bindChecked !== undefined) {
      return <input {...commonProps} bind:checked={bindChecked} />;
    }
    if (bindValue !== undefined) {
      return <input {...commonProps} bind:value={bindValue} />;
    }
    return <input {...commonProps} />;
  },
);
