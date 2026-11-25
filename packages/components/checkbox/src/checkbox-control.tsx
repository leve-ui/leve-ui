import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr, useFieldControl } from '@leve-ui/utils';
import {
  checkboxContextId,
  checkboxGroupContextId,
  getCheckboxDataState,
} from './checkbox-context';

export type CheckboxControlProps = PropsOf<'button'>;

/**
 * チェックボックス本体のボタン要素です。
 *
 * WAI-ARIA APG の Checkbox パターンに準拠し、`type="button"`、`role="checkbox"`、`aria-checked` を出力します。
 * ネイティブのボタンなので、Space キー・Enter キー・クリックで切り替わります（Switch と同じ）。
 * アクセシブルネームは `Checkbox.Label`、`Field.Label`、または `aria-label` / `aria-labelledby` で指定してください。
 * 各パーツの要素 ID を上書きする場合は `Checkbox.Root` の `ids` プロパティを使用します。
 */
export const CheckboxControl = component$<CheckboxControlProps>(({ onClick$, ...props }) => {
  const context = useContext(checkboxContextId);
  const group = useContext(checkboxGroupContextId, null);
  const control = useFieldControl(props);

  const state = getCheckboxDataState(context.checked.value);

  const ariaChecked =
    context.checked.value === 'indeterminate' ? 'mixed' : context.checked.value ? 'true' : 'false';

  const isInvalid = context.invalid.value || control.value.invalid;
  // Suppress Field's aria-describedby inside a Group so it isn't duplicated on every item
  const ariaDescribedBy = group !== null ? props['aria-describedby'] : control.value.describedBy;

  return (
    // biome-ignore lint/a11y/useSemanticElements: APG Checkbox パターンに従いカスタムスタイル適用可能な button[role="checkbox"] を使用するため
    <button
      {...props}
      type="button"
      role="checkbox"
      id={context.ids.control}
      aria-checked={ariaChecked}
      aria-describedby={ariaDescribedBy}
      aria-invalid={isInvalid ? 'true' : undefined}
      aria-readonly={context.readOnly.value ? 'true' : undefined}
      aria-required={context.required.value ? 'true' : undefined}
      disabled={context.disabled.value}
      onClick$={[context.toggle$, onClick$]}
      data-leve-checkbox-control=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(isInvalid)}
    >
      <Slot />
    </button>
  );
});
