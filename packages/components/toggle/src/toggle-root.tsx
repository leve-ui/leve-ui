import { $, component$, type PropsOf, type QRL, type Signal, Slot } from '@builder.io/qwik';
import { dataAttr, useControllableState } from '@leve-ui/utils';

export type ToggleRootProps = PropsOf<'button'> & {
  /** 非制御モードの初期値。既定値は false */
  defaultPressed?: boolean;
  /** 制御モード。押下状態の Signal */
  'bind:pressed'?: Signal<boolean>;
  /** ユーザー操作で押下状態が変わったときに呼ばれる */
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
    ...props
  }) => {
    const [pressed, setPressed$] = useControllableState({
      value: bindPressed,
      defaultValue: defaultPressed ?? false,
      onChange$: onPressedChange$,
    });

    const toggle$ = $(() => {
      if (disabled) return;
      setPressed$(!pressed.value);
    });

    return (
      <button
        {...props}
        type="button"
        disabled={disabled}
        aria-pressed={pressed.value ? 'true' : 'false'}
        data-leve-toggle=""
        data-state={pressed.value ? 'on' : 'off'}
        data-disabled={dataAttr(disabled)}
        onClick$={[toggle$, onClick$]}
      >
        <Slot />
      </button>
    );
  },
);
