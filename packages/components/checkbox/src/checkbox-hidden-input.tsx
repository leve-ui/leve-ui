import { component$, type PropsOf, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { checkboxContextId, getCheckboxDataState } from './checkbox-context';

export type CheckboxHiddenInputProps = PropsOf<'input'>;

/**
 * フォーム送信用の隠しチェックボックス要素です。
 *
 * `<form>` の送信や FormData にチェックボックスの状態を含める場合に使用します。
 * `name`、`value`、`form` などの属性を指定してください。
 *
 * この要素は絶対配置（position: absolute）されるため、利用側で Checkbox.Root に
 * `position: relative` を指定してください。
 */
export const CheckboxHiddenInput = component$<CheckboxHiddenInputProps>((props) => {
  const context = useContext(checkboxContextId);
  const inputRef = useSignal<HTMLInputElement>();

  // HTMLInputElement.indeterminate は HTML 属性ではなく DOM プロパティでのみ設定可能なため、
  // クライアントで DOM 要素のプロパティを直接同期する必要があります。
  // biome-ignore lint/correctness/noQwikUseVisibleTask: DOM の indeterminate プロパティを同期する必要があるため
  useVisibleTask$(({ track }) => {
    const checked = track(() => context.checked.value);
    if (inputRef.value) {
      inputRef.value.indeterminate = checked === 'indeterminate';
    }
  });

  const state = getCheckboxDataState(context.checked.value);

  return (
    <input
      {...props}
      ref={inputRef}
      type="checkbox"
      checked={context.checked.value === true}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
      data-leve-checkbox-hidden-input=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
    />
  );
});
