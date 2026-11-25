import { $, component$, type PropsOf, useContext, useSignal } from '@builder.io/qwik';
import { dataAttr, useFormReset } from '@leve-ui/utils';
import { radioGroupContextId } from './radio-group-context';

export type RadioGroupHiddenInputProps = PropsOf<'input'> & {
  /** The `id` of the form element to associate the input with. */
  form?: string;
};

/**
 * フォーム送信用の隠しラジオ入力要素です。
 *
 * `<form>` の送信や FormData にラジオグループの選択値を含める場合に使用します。
 * `name` や `form` などの属性を指定してください。
 *
 * この要素は絶対配置（position: absolute）されるため、利用側で RadioGroup.Root に
 * `position: relative` を指定してください。
 */
export const RadioGroupHiddenInput = component$<RadioGroupHiddenInputProps>((props) => {
  const context = useContext(radioGroupContextId);
  const inputRef = useSignal<HTMLInputElement>();

  useFormReset(
    inputRef,
    $(async () => {
      await context.reset$();
      if (inputRef.value) {
        inputRef.value.value = context.value.value ?? '';
        inputRef.value.checked = context.value.value !== null;
      }
    }),
  );

  const isChecked = context.value.value !== null;

  return (
    <input
      {...props}
      ref={inputRef}
      type="radio"
      value={context.value.value ?? ''}
      checked={isChecked}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
      data-leve-radio-group-hidden-input=""
      data-state={isChecked ? 'checked' : 'unchecked'}
      data-disabled={dataAttr(context.disabled.value)}
    />
  );
});
