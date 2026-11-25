import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import {
  dataAttr,
  useControllableState,
  useFieldContext,
  useInheritedDisabled,
} from '@leve-ui/utils';
import {
  type CheckboxCheckedState,
  type CheckboxIds,
  checkboxContextId,
  checkboxGroupContextId,
  getCheckboxDataState,
} from './checkbox-context';

export type CheckboxRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Only used outside a Field (or inside a Group). */
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
   * Disables the checkbox. Inside a Field, Fieldset, or Group, the inherited `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the checkbox as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the checkbox as read-only. Inside a Field or Group, the inherited `readOnly` also applies.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the checkbox as invalid. Inside a Field or Group, the inherited `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
  /** The `name` attribute for `Checkbox.HiddenInput`. Falls back to the surrounding `Checkbox.Group`'s `name`. */
  name?: string;
  /** The value used to match against the surrounding `Checkbox.Group`'s `value` array and for `Checkbox.HiddenInput`. */
  value?: string;
};

/**
 * 2 つの状態（チェック/未チェック）または不確定状態（indeterminate）を持つチェックボックスコンポーネントのルート要素です。
 *
 * WAI-ARIA APG の Checkbox パターンに準拠しています。
 * Root は状態を保持して Context を提供する非インタラクティブなラッパー（`<div>`）であり、
 * チェックボックス本体は `Control`、アイコン表示は `Indicator`、ラベルは `Label`、フォーム送信用の隠し入力は `HiddenInput`（任意）が担います。
 * 各パーツの要素 ID を上書きする場合は `ids` プロパティを使用します（Field 外、または Group 内で有効）。
 * 非制御モード（`defaultChecked`）と制御モード（`bind:checked` / `onCheckedChange$`）の両方に対応しています。
 */
export const CheckboxRoot = component$<CheckboxRootProps>((props) => {
  const {
    ids: propIds,
    defaultChecked = false,
    'bind:checked': bindChecked,
    onCheckedChange$,
    disabled: _rootDisabled,
    required: _rootRequired,
    readOnly: _rootReadOnly,
    invalid: _rootInvalid,
    name: _propName,
    value: propValue,
    ...restProps
  } = props;

  const [standaloneChecked, setStandaloneChecked$, standaloneReset$] =
    useControllableState<CheckboxCheckedState>({
      value: bindChecked,
      defaultValue: defaultChecked ?? false,
      onChange$: onCheckedChange$,
    });

  const group = useContext(checkboxGroupContextId, null);
  const isInGroup = group !== null && propValue !== undefined;

  const field = useFieldContext();
  const base = useId();
  // Inside a Group, never use field.ids so multiple checkboxes don't get duplicate IDs
  const ids: CheckboxIds =
    field && group === null
      ? { control: field.ids.control, label: field.ids.label }
      : {
          control: propIds?.control ?? `${base}-control`,
          label: propIds?.label ?? `${base}-label`,
        };

  const checked = useComputed$<CheckboxCheckedState>(() =>
    isInGroup ? group.value.value.includes(propValue) : standaloneChecked.value,
  );

  const maxReached = useComputed$(
    () =>
      isInGroup &&
      !checked.value &&
      group.maxSelectedValues.value !== undefined &&
      group.value.value.length >= group.maxSelectedValues.value,
  );

  // Disabled by the Root, Group, surrounding Field/Fieldset, or maxSelectedValues limit
  const inheritedDisabled = useInheritedDisabled();
  const disabledSignal = useComputed$(
    () =>
      Boolean(props.disabled) ||
      Boolean(group?.disabled.value) ||
      inheritedDisabled.value ||
      maxReached.value,
  );
  const requiredSignal = useComputed$(
    () => Boolean(props.required) || Boolean(field?.required.value),
  );
  const readOnlySignal = useComputed$(
    () =>
      Boolean(props.readOnly) || Boolean(group?.readOnly.value) || Boolean(field?.readOnly.value),
  );
  const invalidSignal = useComputed$(
    () => Boolean(props.invalid) || Boolean(group?.invalid.value) || Boolean(field?.invalid.value),
  );
  const nameSignal = useComputed$(() => props.name ?? group?.name.value);
  const valueSignal = useComputed$(() => props.value);

  const toggle$ = $(async () => {
    if (disabledSignal.value || readOnlySignal.value) return;
    if (isInGroup) {
      await group.toggleValue$(propValue);
      return;
    }
    const next: CheckboxCheckedState =
      standaloneChecked.value === 'indeterminate' ? true : !standaloneChecked.value;
    await setStandaloneChecked$(next);
  });

  const reset$ = $(async () => {
    if (isInGroup) {
      await group.reset$();
      return;
    }
    await standaloneReset$();
  });

  useContextProvider(checkboxContextId, {
    ids,
    checked,
    disabled: disabledSignal,
    required: requiredSignal,
    readOnly: readOnlySignal,
    invalid: invalidSignal,
    name: nameSignal,
    value: valueSignal,
    toggle$,
    reset$,
  });

  const state = getCheckboxDataState(checked.value);

  return (
    <div
      {...restProps}
      data-leve-checkbox=""
      data-state={state}
      data-disabled={dataAttr(disabledSignal.value)}
      data-readonly={dataAttr(readOnlySignal.value)}
      data-invalid={dataAttr(invalidSignal.value)}
    >
      <Slot />
    </div>
  );
});
