import {
  $,
  component$,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
  useSignal,
} from '@builder.io/qwik';
import {
  type ToastData,
  type Toaster,
  type ToastOptions,
  type ToastPlacement,
  type ToastSwipeDirection,
  toastProviderContextId,
} from './toast-context';

export type ToastProviderProps = {
  /**
   * How long a toast stays, in ms. A toast with an Action stays until it is closed.
   * @default 5000
   */
  duration?: number;
  /**
   * Where the Region is placed. Output as `data-placement` on the Region and the toasts.
   * @default 'bottom-end'
   */
  placement?: ToastPlacement;
  /**
   * The direction to swipe a toast away. Defaults to the nearest edge of the placement.
   */
  swipeDirection?: ToastSwipeDirection;
  /**
   * How far a toast must be swiped to close it, in px.
   * @default 50
   */
  swipeThreshold?: number;
  /**
   * The keys that move focus to the Region: `KeyboardEvent.code` values, and `altKey`,
   * `ctrlKey`, `metaKey` or `shiftKey` for modifiers.
   * @default ['F8']
   */
  hotkey?: string[];
};

const SWIPE_DIRECTIONS: Record<ToastPlacement, ToastSwipeDirection> = {
  'top-start': 'left',
  top: 'up',
  'top-end': 'right',
  'bottom-start': 'left',
  bottom: 'down',
  'bottom-end': 'right',
};

/**
 * Toast の状態を持つ Provider です。DOM を出力しません。アプリのルートなど、通知を出すコンポーネントと
 * `Toast.Region` の両方を包む位置に置きます。中のコンポーネントは `useToaster()` で通知を追加します。
 *
 * 通知の一覧はモジュールの変数ではなく Context の signal に持ちます。リクエストごとに分かれ、
 * サーバーで追加した通知もシリアライズされてクライアントに引き継がれます（`adr/0037`）。
 */
export const ToastProvider = component$<ToastProviderProps>((props) => {
  const toasts = useSignal<ToastData[]>([]);
  const count = useSignal(0);
  const heights = useSignal<Record<string, number>>({});
  const hovered = useSignal(false);
  const focused = useSignal(false);
  const windowBlurred = useSignal(false);
  const swiping = useSignal(false);

  const duration = useComputed$(() => props.duration ?? 5000);
  const placement = useComputed$(() => props.placement ?? 'bottom-end');
  const swipeDirection = useComputed$(
    () => props.swipeDirection ?? SWIPE_DIRECTIONS[props.placement ?? 'bottom-end'],
  );
  const swipeThreshold = useComputed$(() => props.swipeThreshold ?? 50);
  const hotkey = useComputed$(() => props.hotkey ?? ['F8']);

  const add$ = $((options: ToastOptions) => {
    // The id is made when the toast is added, so the server and the client never disagree on it
    count.value += 1;
    const id = `leve-toast-${count.value}`;
    toasts.value = [...toasts.value, { type: 'foreground', ...options, id, open: true }];
    return id;
  });
  const update$ = $((id: string, options: ToastOptions) => {
    toasts.value = toasts.value.map((toast) =>
      toast.id === id ? { ...toast, ...options } : toast,
    );
  });
  const dismiss$ = $((id?: string) => {
    toasts.value = toasts.value.map((toast) =>
      (id === undefined || toast.id === id) && toast.open ? { ...toast, open: false } : toast,
    );
  });
  const remove$ = $((id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
    const { [id]: _removed, ...rest } = heights.value;
    heights.value = rest;
  });

  useContextProvider(toastProviderContextId, {
    toasts,
    add$,
    update$,
    dismiss$,
    remove$,
    duration,
    placement,
    swipeDirection,
    swipeThreshold,
    hotkey,
    heights,
    hovered,
    focused,
    windowBlurred,
    swiping,
  });

  return <Slot />;
});

/**
 * `Toast.Provider` の中で、通知の一覧と、追加・変更・閉じる関数を返します。
 *
 * @example
 * const toaster = Toast.useToaster();
 * <button onClick$={() => toaster.add$({ title: 'Saved' })}>Save</button>
 */
export const useToaster = <T = unknown>(): Toaster<T> => {
  const { toasts, add$, update$, dismiss$ } = useContext(toastProviderContextId);
  return { toasts, add$, update$, dismiss$ } as unknown as Toaster<T>;
};
