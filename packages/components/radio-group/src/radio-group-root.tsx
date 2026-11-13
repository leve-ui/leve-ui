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
  useStore,
} from '@builder.io/qwik';
import { dataAttr, useControllableState } from '@leve-ui/utils';
import {
  type RadioGroupIds,
  type RadioGroupItemRegistration,
  radioGroupContextId,
} from './radio-group-context';

export type RadioGroupRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. */
  ids?: Partial<RadioGroupIds>;
  /**
   * The value selected initially (uncontrolled).
   * @default null
   */
  defaultValue?: string | null;
  /** A signal with the selected value (controlled). */
  'bind:value'?: Signal<string | null>;
  /** Called when the user selects a value. */
  onValueChange$?: QRL<(value: string) => void>;
  /**
   * The orientation of the group.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Whether arrow keys wrap from the last item to the first and vice versa.
   * @default true
   */
  loop?: boolean;
  /**
   * Disables all radio buttons.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the group as required.
   * @default false
   */
  required?: boolean;
};

/**
 * 相互に排他的な選択肢のグループを提供するルート要素です。
 *
 * WAI-ARIA APG の Radio Group パターン（ロービング tabIndex 版）に準拠しています。
 * グループ全体を `role="radiogroup"` で表し、上下左右の矢印キーによるロービングタブインデックスと
 * 自動選択をサポートします。
 *
 * アクセシブルネームとして `RadioGroup.Label` を置くか、`aria-label` / `aria-labelledby` を指定してください。
 * 各パーツの要素 ID を上書きする場合は `ids` プロパティを使用します。
 * 非制御モード（`defaultValue`）と制御モード（`bind:value` / `onValueChange$`）の両方に対応しています。
 */
export const RadioGroupRoot = component$<RadioGroupRootProps>((props) => {
  const {
    ids: propIds,
    defaultValue = null,
    'bind:value': bindValue,
    onValueChange$,
    orientation: _orientation,
    loop: _loop,
    disabled: _disabled,
    required: _required,
    ...restProps
  } = props;

  const handleValueChange$ = onValueChange$
    ? $(async (val: string | null) => {
        if (val !== null) {
          await onValueChange$(val);
        }
      })
    : undefined;

  const [value, setValue$] = useControllableState<string | null>({
    value: bindValue,
    defaultValue: defaultValue ?? null,
    onChange$: handleValueChange$,
  });

  const base = useId();
  const labelId = propIds?.label ?? `${base}-label`;
  const rootId = `${base}-root`;
  const ids: RadioGroupIds = { label: labelId, root: rootId };

  const disabledSignal = useComputed$(() => Boolean(props.disabled));
  const requiredSignal = useComputed$(() => Boolean(props.required));
  const orientationSignal = useComputed$(() => props.orientation ?? 'vertical');
  const loopSignal = useComputed$(() => props.loop ?? true);

  const select$ = $(async (val: string) => {
    if (disabledSignal.value) return;
    await setValue$(val);
  });

  const items = useStore<RadioGroupItemRegistration[]>([]);

  useContextProvider(radioGroupContextId, {
    ids,
    value,
    select$,
    disabled: disabledSignal,
    required: requiredSignal,
    orientation: orientationSignal,
    loop: loopSignal,
    items,
  });

  const ariaLabelledby = props['aria-labelledby'] ?? (props['aria-label'] ? undefined : ids.label);

  return (
    <div
      {...restProps}
      id={ids.root}
      role="radiogroup"
      aria-labelledby={ariaLabelledby}
      aria-orientation={orientationSignal.value}
      aria-required={requiredSignal.value ? 'true' : undefined}
      aria-disabled={disabledSignal.value ? 'true' : undefined}
      data-leve-radio-group=""
      data-orientation={orientationSignal.value}
      data-disabled={dataAttr(disabledSignal.value)}
    >
      <Slot />
    </div>
  );
});
