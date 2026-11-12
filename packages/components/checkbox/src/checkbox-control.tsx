import { component$, type PropsOf, Slot, sync$, useContext } from '@builder.io/qwik';
import { dataAttr, useFieldControl } from '@leve-ui/utils';
import { checkboxContextId, getCheckboxDataState } from './checkbox-context';

export type CheckboxControlProps = PropsOf<'button'>;

/**
 * チェックボックス本体のボタン要素です。
 *
 * WAI-ARIA APG の Checkbox パターンに準拠し、`type="button"`、`role="checkbox"`、`aria-checked` を出力します。
 * Enter キーでのトグルを防ぎ（APG に準拠、Space キーまたはクリックでのみ切り替え）、
 * アクセシブルネームは `Checkbox.Label`、`Field.Label`、または `aria-label` / `aria-labelledby` で指定してください。
 * 各パーツの要素 ID を上書きする場合は `Checkbox.Root` の `ids` プロパティを使用します。
 */
export const CheckboxControl = component$<CheckboxControlProps>(
  ({ onClick$, onKeyDown$, ...props }) => {
    const context = useContext(checkboxContextId);
    const control = useFieldControl(props);

    const preventEnter$ = sync$((e: KeyboardEvent) => {
      if (e.key === 'Enter') e.preventDefault();
    });

    const state = getCheckboxDataState(context.checked.value);

    const ariaChecked =
      context.checked.value === 'indeterminate'
        ? 'mixed'
        : context.checked.value
          ? 'true'
          : 'false';

    return (
      // biome-ignore lint/a11y/useSemanticElements: APG Checkbox パターンに従いカスタムスタイル適用可能な button[role="checkbox"] を使用するため
      <button
        {...props}
        type="button"
        role="checkbox"
        id={context.ids.control}
        aria-checked={ariaChecked}
        aria-describedby={control.value.describedBy}
        aria-invalid={control.value.invalid ? 'true' : undefined}
        aria-required={context.required.value ? 'true' : undefined}
        disabled={context.disabled.value}
        onClick$={[context.toggle$, onClick$]}
        onKeyDown$={[preventEnter$, onKeyDown$]}
        data-leve-checkbox-control=""
        data-state={state}
        data-disabled={dataAttr(context.disabled.value)}
        data-invalid={dataAttr(control.value.invalid)}
      >
        <Slot />
      </button>
    );
  },
);
