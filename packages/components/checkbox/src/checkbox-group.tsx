import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr, useControllableState, useFieldControl } from '@leve-ui/utils';
import { checkboxGroupContextId } from './checkbox-context';

export type CheckboxGroupProps = PropsOf<'div'> & {
  /**
   * The initial selected values (uncontrolled).
   * @default []
   */
  defaultValue?: string[];
  /** A signal with the selected values (controlled). */
  'bind:value'?: Signal<string[]>;
  /** Called when the selected values change. */
  onValueChange$?: QRL<(value: string[]) => void>;
  /** Shared `name` attribute passed to descendant `Checkbox.HiddenInput` elements. */
  name?: string;
  /**
   * Disables all checkboxes in the group. Inside a Field or Fieldset, the inherited `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks all checkboxes in the group as read-only. Inside a Field, the Field's `readOnly` also applies.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks all checkboxes in the group as invalid. Inside a Field, the Field's `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
  /** Maximum number of checkboxes that can be selected at once. */
  maxSelectedValues?: number;
};

/**
 * 複数のチェックボックスの選択状態（`string[]`）をまとめて管理するグループコンポーネントです。
 *
 * `role="group"` を持つ `<div>` を描画し、配下の `Checkbox.Root` に選択値配列や
 * `name` / `disabled` / `readOnly` / `invalid` / `maxSelectedValues` を Context 経由で共有します。
 * 非制御モード（`defaultValue`）と制御モード（`bind:value` / `onValueChange$`）の両方に対応しています。
 */
export const CheckboxGroup = component$<CheckboxGroupProps>((props) => {
  const {
    defaultValue = [],
    'bind:value': bindValue,
    onValueChange$,
    name: _name,
    disabled: _disabled,
    readOnly: _readOnly,
    invalid: _invalid,
    maxSelectedValues: _maxSelectedValues,
    ...restProps
  } = props;

  const [value, setValue$, reset$] = useControllableState<string[]>({
    value: bindValue,
    defaultValue: defaultValue ?? [],
    onChange$: onValueChange$,
  });

  const control = useFieldControl(props);
  const disabledSignal = useComputed$(() => control.value.disabled);
  const readOnlySignal = useComputed$(() => control.value.readOnly);
  const invalidSignal = useComputed$(() => control.value.invalid);
  const nameSignal = useComputed$(() => props.name);
  const maxSelectedValuesSignal = useComputed$(() => props.maxSelectedValues);

  const toggleValue$ = $(async (itemValue: string) => {
    if (disabledSignal.value || readOnlySignal.value) return;
    const current = value.value;
    if (current.includes(itemValue)) {
      await setValue$(current.filter((v) => v !== itemValue));
      return;
    }
    if (
      maxSelectedValuesSignal.value !== undefined &&
      current.length >= maxSelectedValuesSignal.value
    ) {
      return;
    }
    await setValue$([...current, itemValue]);
  });

  useContextProvider(checkboxGroupContextId, {
    value,
    name: nameSignal,
    disabled: disabledSignal,
    readOnly: readOnlySignal,
    invalid: invalidSignal,
    maxSelectedValues: maxSelectedValuesSignal,
    toggleValue$,
    reset$,
  });

  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: Checkbox.Group exposes aria-readonly on the group container alongside descendant controls
    // biome-ignore lint/a11y/useSemanticElements: Checkbox.Group renders <div role="group"> as a headless wrapper
    <div
      {...restProps}
      role="group"
      aria-describedby={control.value.describedBy}
      aria-invalid={invalidSignal.value ? 'true' : undefined}
      aria-disabled={disabledSignal.value ? 'true' : undefined}
      aria-readonly={readOnlySignal.value ? 'true' : undefined}
      data-leve-checkbox-group=""
      data-disabled={dataAttr(disabledSignal.value)}
      data-readonly={dataAttr(readOnlySignal.value)}
      data-invalid={dataAttr(invalidSignal.value)}
    >
      <Slot />
    </div>
  );
});
