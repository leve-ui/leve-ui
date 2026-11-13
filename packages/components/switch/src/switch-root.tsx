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
import { type SwitchIds, switchContextId } from './switch-context';

export type SwitchRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Only used outside a Field. */
  ids?: Partial<SwitchIds>;
  /**
   * Whether the switch is on initially (uncontrolled).
   * @default false
   */
  defaultChecked?: boolean;
  /** A signal with the on/off state (controlled). */
  'bind:checked'?: Signal<boolean>;
  /** Called when the user turns the switch on or off. */
  onCheckedChange$?: QRL<(checked: boolean) => void>;
  /**
   * Disables the switch. Inside a Field, the Field's `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the switch as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
};

/**
 * 2 つの状態（オン/オフ）を切り替えるスイッチコンポーネントのルート要素です。
 *
 * WAI-ARIA APG の Switch パターンおよび adr/0026 に準拠しています。
 * Root は状態を保持して Context を提供する非インタラクティブなラッパー（`<div>`）であり、
 * スイッチ本体は `Control`、ラベルは `Label`、フォーム送信用の隠し入力は `HiddenInput`（任意）が担います。
 * 各パーツの要素 ID を上書きする場合は `ids` プロパティを使用します（Field 外でのみ有効）。
 * 非制御モード（`defaultChecked`）と制御モード（`bind:checked` / `onCheckedChange$`）の両方に対応しています。
 */
export const SwitchRoot = component$<SwitchRootProps>(
  ({
    ids: propIds,
    defaultChecked = false,
    'bind:checked': bindChecked,
    onCheckedChange$,
    disabled: rootDisabled,
    required: rootRequired,
    ...props
  }) => {
    const [checked, setChecked$] = useControllableState({
      value: bindChecked,
      defaultValue: defaultChecked ?? false,
      onChange$: onCheckedChange$,
    });

    const field = useFieldContext();
    const base = useId();
    const ids: SwitchIds = field
      ? { control: field.ids.control, label: field.ids.label }
      : {
          control: propIds?.control ?? `${base}-control`,
          label: propIds?.label ?? `${base}-label`,
        };

    const disabledSignal = useComputed$(() => !!rootDisabled || !!field?.disabled.value);
    const requiredSignal = useComputed$(() => !!rootRequired || !!field?.required.value);

    const toggle$ = $(() => {
      if (disabledSignal.value) return;
      setChecked$(!checked.value);
    });

    useContextProvider(switchContextId, {
      ids,
      checked,
      disabled: disabledSignal,
      required: requiredSignal,
      toggle$,
    });

    return (
      <div
        {...props}
        data-leve-switch=""
        data-state={checked.value ? 'checked' : 'unchecked'}
        data-disabled={dataAttr(disabledSignal.value)}
      >
        <Slot />
      </div>
    );
  },
);
