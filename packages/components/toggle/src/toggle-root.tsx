import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useSignal,
} from '@builder.io/qwik';
import {
  dataAttr,
  useControllableState,
  useInheritedDisabled,
  useToolbarItem,
} from '@leve-ui/utils';

export type ToggleRootProps = PropsOf<'button'> & {
  /**
   * Whether the toggle is pressed initially (uncontrolled).
   * @default false
   */
  defaultPressed?: boolean;
  /** A signal with the pressed state (controlled). */
  'bind:pressed'?: Signal<boolean>;
  /** Called when the user presses or releases the toggle. */
  onPressedChange$?: QRL<(pressed: boolean) => void>;
};

/**
 * 2 つの状態（オン/オフ）を切り替えるボタンです。
 *
 * WAI-ARIA APG の Toggle Button パターンに準拠し、ネイティブの `<button>` と
 * `aria-pressed` 属性を使用します。
 * ボタンのラベル（アクセシブルネーム）は状態によって変化させず、状態の伝達には
 * `aria-pressed` を使用してください（例: 「ミュート」ボタンのラベルを「ミュート解除」に変えるのではなく、
 * ラベルは「ミュート」のまま `aria-pressed` を切り替えます）。
 */
export const ToggleRoot = component$<ToggleRootProps>(
  ({
    disabled,
    defaultPressed = false,
    'bind:pressed': bindPressed,
    onPressedChange$,
    onClick$,
    onFocus$,
    ...props
  }) => {
    const [pressed, setPressed$] = useControllableState({
      value: bindPressed,
      defaultValue: defaultPressed ?? false,
      onChange$: onPressedChange$,
    });

    // Disabled by the prop, or by a surrounding Field or Fieldset
    const inheritedDisabled = useInheritedDisabled();
    const disabledSignal = useComputed$(() => Boolean(disabled) || inheritedDisabled.value);

    // Inside a Toolbar, the toggle joins its roving tabindex
    const internalRef = useSignal<Element>();
    // A ref passed by the consumer is used as it is
    const ref = (props.ref as Signal<Element | undefined> | undefined) ?? internalRef;
    const toolbarItem = useToolbarItem(disabledSignal, ref);

    const toggle$ = $(() => {
      if (disabledSignal.value) return;
      setPressed$(!pressed.value);
    });

    return (
      <button
        {...props}
        type="button"
        disabled={disabledSignal.value}
        aria-pressed={pressed.value ? 'true' : 'false'}
        data-leve-toggle=""
        data-state={pressed.value ? 'on' : 'off'}
        data-disabled={dataAttr(disabledSignal.value)}
        ref={ref}
        data-leve-toolbar-item={toolbarItem.itemId}
        tabIndex={toolbarItem.inToolbar ? toolbarItem.tabIndex.value : props.tabIndex}
        onClick$={[toggle$, onClick$]}
        onFocus$={[toolbarItem.onFocus$, onFocus$]}
      >
        <Slot />
      </button>
    );
  },
);
