import { component$, type PropsOf, type Signal, Slot } from '@builder.io/qwik';
import { dataAttr, useFieldControl } from '@leve-ui/utils';

export type FieldSelectProps = PropsOf<'select'> & {
  /** A signal synced two-way with the select value. */
  'bind:value'?: Signal<string>;
  /**
   * Marks the control as invalid (`aria-invalid="true"`, `data-invalid`). Inside a
   * Field, the control is also invalid while the Field is.
   * @default false
   */
  invalid?: boolean;
};

/**
 * ネイティブの `<select>` 要素を使用したフォームコントロールです。
 *
 * 該当する APG パターンはないため、ネイティブの `<select>` を使用します。
 * Field の中ではラベル、説明文、エラーメッセージと自動的に関連付けられます。
 * Field の外でも単体で使用できます。
 */
export const FieldSelect = component$<FieldSelectProps>(({ 'bind:value': bindValue, ...props }) => {
  const control = useFieldControl(props);
  // Read by useFieldControl; not an attribute of the element
  const { invalid: _invalid, ...elementProps } = props;
  const commonProps = {
    ...elementProps,
    id: control.value.id,
    'aria-describedby': control.value.describedBy,
    'aria-invalid': control.value.invalid ? ('true' as const) : undefined,
    disabled: control.value.disabled,
    required: control.value.required,
    'data-leve-field-select': '',
    'data-invalid': dataAttr(control.value.invalid),
    'data-disabled': dataAttr(control.value.disabled),
    'data-required': dataAttr(control.value.required),
    'data-readonly': dataAttr(control.value.readOnly),
  };

  if (bindValue !== undefined) {
    return (
      <select {...commonProps} bind:value={bindValue}>
        <Slot />
      </select>
    );
  }
  return (
    <select {...commonProps}>
      <Slot />
    </select>
  );
});
