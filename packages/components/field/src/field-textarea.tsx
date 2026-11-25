import {
  $,
  component$,
  type PropsOf,
  type Signal,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { dataAttr, useFieldControl } from '@leve-ui/utils';

export type FieldTextareaProps = PropsOf<'textarea'> & {
  /** A signal synced two-way with the textarea value. */
  'bind:value'?: Signal<string>;
  /**
   * Marks the control as invalid (`aria-invalid="true"`, `data-invalid`). Inside a
   * Field, the control is also invalid while the Field is.
   * @default false
   */
  invalid?: boolean;
  /**
   * Automatically adjusts the textarea height to fit its content as the user types.
   * @default false
   */
  autoresize?: boolean;
};

// Functional DOM height adjustment required for autoresize
function resizeTextarea(el: HTMLTextAreaElement) {
  el.style.height = 'auto';
  let borderHeight = 0;
  const style = el.ownerDocument.defaultView?.getComputedStyle?.(el);
  if (style?.boxSizing === 'border-box') {
    borderHeight =
      Number.parseFloat(style.borderTopWidth || '0') +
      Number.parseFloat(style.borderBottomWidth || '0');
  }
  el.style.height = `${el.scrollHeight + borderHeight}px`;
}

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
    const internalRef = useSignal<HTMLTextAreaElement>();
    const textareaRef =
      (props.ref as Signal<HTMLTextAreaElement | undefined> | undefined) ?? internalRef;

    // Read by useFieldControl / handled internally; not attributes of the element
    const { invalid: _invalid, autoresize: _autoresize, onInput$, ...elementProps } = props;

    const handleAutoResize$ = $((_event: InputEvent, el: HTMLTextAreaElement) => {
      if (props.autoresize) {
        resizeTextarea(el);
      }
    });

    // biome-ignore lint/correctness/noQwikUseVisibleTask: Functional DOM measurement (scrollHeight) required to size autoresize textarea on mount and programmatic bind:value updates
    useVisibleTask$(
      ({ track }) => {
        const enabled = track(() => Boolean(props.autoresize));
        track(() => bindValue?.value);
        const el = textareaRef.value;
        if (enabled && el) {
          resizeTextarea(el);
        }
      },
      { strategy: 'document-ready' },
    );

    const commonProps = {
      ...elementProps,
      ref: textareaRef,
      id: control.value.id,
      'aria-describedby': control.value.describedBy,
      'aria-invalid': control.value.invalid ? ('true' as const) : undefined,
      disabled: control.value.disabled,
      required: control.value.required,
      readOnly: control.value.readOnly,
      onInput$: [handleAutoResize$, onInput$],
      'data-leve-field-textarea': '',
      'data-invalid': dataAttr(control.value.invalid),
      'data-disabled': dataAttr(control.value.disabled),
      'data-required': dataAttr(control.value.required),
      'data-readonly': dataAttr(control.value.readOnly),
    };

    if (bindValue !== undefined) {
      return <textarea {...commonProps} bind:value={bindValue} />;
    }
    return <textarea {...commonProps} />;
  },
);
