import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { comboboxContextId } from './combobox-context';

export type ComboboxHiddenInputProps = PropsOf<'input'>;

/**
 * フォーム送信用の隠し入力欄です（`adr/0026`）。選択中の項目の `value` を送ります。
 * `name` や `form` を指定してください。絶対配置になるため、Root に `position: relative` を指定してください。
 */
export const ComboboxHiddenInput = component$<ComboboxHiddenInputProps>((props) => {
  const context = useContext(comboboxContextId);

  return (
    <input
      {...props}
      type="text"
      value={context.value.value ?? ''}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0, width: 0 }}
      data-leve-combobox-hidden-input=""
    />
  );
});
