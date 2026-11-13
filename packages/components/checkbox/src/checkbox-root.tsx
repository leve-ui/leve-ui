import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import { dataAttr, useControllableState, useFieldContext } from '@leve-ui/utils';
import {
  type CheckboxCheckedState,
  type CheckboxIds,
  checkboxContextId,
  getCheckboxDataState,
} from './checkbox-context';

export type CheckboxRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Only used outside a Field. */
  ids?: Partial<CheckboxIds>;
  /**
   * The initial checked state (uncontrolled).
   * @default false
   */
  defaultChecked?: CheckboxCheckedState;
  /** A signal with the checked state (controlled). */
  'bind:checked'?: Signal<CheckboxCheckedState>;
  /** Called when the user changes the checked state. */
  onCheckedChange$?: QRL<(checked: CheckboxCheckedState) => void>;
  /**
   * Disables the checkbox. Inside a Field, the Field's `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the checkbox as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
};

/**
 * 2 つの状態（チェック/未チェック）または不確定状態（indeterminate）を持つチェックボックスコンポーネントのルート要素です。
 *
 * WAI-ARIA APG の Checkbox パターンに準拠しています。
 * Root は状態を保持して Context を提供する非インタラクティブなラッパー（`<div>`）であり、
 * チェックボックス本体は `Control`、アイコン表示は `Indicator`、ラベルは `Label`、フォーム送信用の隠し入力は `HiddenInput`（任意）が担います。
 * 各パーツの要素 ID を上書きする場合は `ids` プロパティを使用します（Field 外でのみ有効）。
 * 非制御モード（`defaultChecked`）と制御モード（`bind:checked` / `onCheckedChange$`）の両方に対応しています。
 */
export const CheckboxRoot = component$<CheckboxRootProps>(
  ({
    ids: propIds,
    defaultChecked = false,
    'bind:checked': bindChecked,
    onCheckedChange$,
    disabled: rootDisabled,
    required: rootRequired,
    ...props
  }) => {
    const [checked, setChecked$] = useControllableState<CheckboxCheckedState>({
      value: bindChecked,
      defaultValue: defaultChecked ?? false,
      onChange$: onCheckedChange$,
    });

    const field = useFieldContext();
    const base = useId();
    const ids: CheckboxIds = field
      ? { control: field.ids.control, label: field.ids.label }
      : {
          control: propIds?.control ?? `${base}-control`,
          label: propIds?.label ?? `${base}-label`,
        };

    const disabledSignal = useComputed$(() => !!rootDisabled || !!field?.disabled.value);
    const requiredSignal = useComputed$(() => !!rootRequired || !!field?.required.value);

    const toggle$ = $(() => {
      if (disabledSignal.value) return;
      const next: CheckboxCheckedState = checked.value === 'indeterminate' ? true : !checked.value;
      setChecked$(next);
    });

    useContextProvider(checkboxContextId, {
      ids,
      checked,
      disabled: disabledSignal,
      required: requiredSignal,
      toggle$,
    });

    const state = getCheckboxDataState(checked.value);

    return (
      <div
        {...props}
        data-leve-checkbox=""
        data-state={state}
        data-disabled={dataAttr(disabledSignal.value)}
      >
        <Slot />
      </div>
    );
  },
);
