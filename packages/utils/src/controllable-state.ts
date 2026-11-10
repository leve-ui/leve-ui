import { $, type QRL, type ReadonlySignal, type Signal, useSignal } from '@builder.io/qwik';

export interface UseControllableStateOptions<T> {
  /** 制御モードの値。`bind:<state>` で渡された Signal（例: `props['bind:open']`） */
  value?: Signal<T>;
  /** 非制御モードの初期値。`default<State>` の値（例: `props.defaultOpen ?? false`） */
  defaultValue: T;
  /** 値が変わったときに呼ぶ。`on<State>Change$`（例: `props.onOpenChange$`） */
  onChange$?: QRL<(value: T) => void>;
}

/**
 * 状態を、制御（`bind:<state>`）と非制御（`default<State>`）の両方で扱えるようにします（`adr/0011`）。
 *
 * - `value` を渡すと制御モードになり、その Signal を直接読み書きします（親の Signal と同期します）。
 * - 渡さないと非制御モードになり、`defaultValue` を初期値とする内部の Signal を使います。
 * - `onChange$` は、返り値の setter で値が実際に変わったとき（＝ユーザー操作によるとき）だけ呼びます。
 *   親が bind した Signal を直接書き換えた場合は呼びません。
 *
 * 状態は Signal として保持するため、SSR の初期値はそのままシリアライズされます。
 * 制御と非制御をマウント後に切り替えることはサポートしません。
 *
 * @example
 * const [open, setOpen$] = useControllableState({
 *   value: props['bind:open'],
 *   defaultValue: props.defaultOpen ?? false,
 *   onChange$: props.onOpenChange$,
 * });
 * // 読む: open.value / 変える: setOpen$(!open.value)
 */
export const useControllableState = <T>({
  value,
  defaultValue,
  onChange$,
}: UseControllableStateOptions<T>): [ReadonlySignal<T>, QRL<(next: T) => Promise<void>>] => {
  const internal = useSignal<T>(defaultValue);
  const state = value ?? internal;

  const setValue$ = $(async (next: T) => {
    if (Object.is(state.value, next)) return;
    state.value = next;
    await onChange$?.(next);
  });

  return [state, setValue$];
};
