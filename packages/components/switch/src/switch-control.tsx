import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr, useFieldControl } from '@leve-ui/utils';
import { switchContextId } from './switch-context';

export type SwitchControlProps = PropsOf<'button'>;

/**
 * スイッチ本体のボタン要素です。
 *
 * WAI-ARIA APG の Switch パターンに準拠し、`type="button"`、`role="switch"`、`aria-checked` を出力します。
 * アクセシブルネームは `Switch.Label`、`Field.Label`、または `aria-label` / `aria-labelledby` で指定してください。
 * 各パーツの要素 ID を上書きする場合は `Switch.Root` の `ids` プロパティを使用します。
 * ラベルテキストは状態によって変化させず、状態の伝達には `aria-checked` を使用してください。
 */
export const SwitchControl = component$<SwitchControlProps>(({ onClick$, ...props }) => {
  const context = useContext(switchContextId);
  const control = useFieldControl(props);

  return (
    <button
      {...props}
      type="button"
      role="switch"
      id={context.ids.control}
      aria-checked={context.checked.value ? 'true' : 'false'}
      aria-describedby={control.value.describedBy}
      aria-invalid={control.value.invalid ? 'true' : undefined}
      aria-required={context.required.value ? 'true' : undefined}
      disabled={context.disabled.value}
      onClick$={[context.toggle$, onClick$]}
      data-leve-switch-control=""
      data-state={context.checked.value ? 'checked' : 'unchecked'}
      data-disabled={dataAttr(context.disabled.value)}
      data-invalid={dataAttr(control.value.invalid)}
    >
      <Slot />
    </button>
  );
});
