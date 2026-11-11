import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { switchContextId } from './switch-context';

export type SwitchHiddenInputProps = PropsOf<'input'>;

/**
 * フォーム送信用の隠しチェックボックス要素です。
 *
 * `<form>` の送信や FormData にスイッチの状態を含める場合に使用します。
 * `name`、`value`、`form` などの属性を指定してください。
 *
 * この要素は絶対配置（position: absolute）されるため、利用側で Switch.Root に
 * `position: relative` を指定してください。
 */
export const SwitchHiddenInput = component$<SwitchHiddenInputProps>((props) => {
  const context = useContext(switchContextId);

  return (
    <input
      {...props}
      type="checkbox"
      checked={context.checked.value}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
      data-leve-switch-hidden-input=""
      data-state={context.checked.value ? 'checked' : 'unchecked'}
      data-disabled={dataAttr(context.disabled.value)}
    />
  );
});
