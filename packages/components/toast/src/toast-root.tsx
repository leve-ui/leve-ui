import {
  $,
  component$,
  type PropsOf,
  type Signal,
  Slot,
  sync$,
  useComputed$,
  useContext,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { announce, dataAttr, withCssVars } from '@leve-ui/utils';
import { type ToastData, toastContextId, toastProviderContextId } from './toast-context';

export type ToastRootProps = PropsOf<'li'> & {
  /** The toast to render, from `useToaster().toasts`. */
  toast: ToastData;
};

/** Where the pointer went down, kept on the element by a synchronous handler */
type SwipeElement = HTMLElement & { leveSwipeStart?: number[] | null };

type Swipe = { state: 'move' | 'cancel' | 'end'; x: number; y: number };

/** Stores the height of a toast for the stacking CSS variables */
function measureHeight(element: HTMLElement, heights: Signal<Record<string, number>>, id: string) {
  const height = element.offsetHeight;
  if (heights.value[id] !== height) heights.value = { ...heights.value, [id]: height };
}

/** How far the pointer must move before it counts as a swipe, in px */
const SWIPE_START = 2;

/**
 * 通知 1 件（`<li>`）です。`useToaster().toasts` の 1 件を `toast` に渡します。
 *
 * - 追加されると、タイトルと説明を `@leve-ui/utils` の `announce()` で読み上げます。動的に追加した
 *   ライブリージョンは読まれないことがあるため、通知そのものには `role="status"` を付けません。
 *   `foreground` は assertive、`background` は polite で伝えます。
 * - `duration` が過ぎると閉じます。Region にポインタやフォーカスがある間、ウィンドウが非アクティブの間、
 *   スワイプ中は止まります。`Toast.Action` を含む通知は自動では閉じません（操作する前に消えないように）。
 * - フォーカスがあるときに Escape で閉じ、次の通知（なければ Region）にフォーカスを移します。
 * - スワイプで閉じます（`data-swipe` と `--leve-toast-swipe-*` を出力し、動きは CSS で当てます）。
 * - 閉じると `data-state="closed"` になり、CSS のアニメーションが終わってから一覧から消えます。
 * - 重ねて表示するための `--leve-toast-index`（新しい順、0 が最前）、`--leve-toast-count`、
 *   `--leve-toast-front-offset`（手前の通知の高さの合計）などを出力します。
 */
export const ToastRoot = component$<ToastRootProps>(
  ({
    toast,
    onKeyDown$,
    onPointerDown$,
    onPointerMove$,
    onPointerUp$,
    onPointerCancel$,
    ...props
  }) => {
    const context = useContext(toastProviderContextId);
    const ref = useSignal<HTMLElement>();
    const id = toast.id;
    useContextProvider(toastContextId, { id });

    const swipe = useSignal<Swipe | null>(null);
    const remaining = useSignal<number | null>(null);

    // Toasts that are closing do not count: the others move into their place
    const stack = useComputed$(() => {
      const open = context.toasts.value.filter((item) => item.open);
      const position = context.toasts.value.findIndex((item) => item.id === id);
      const newer = context.toasts.value
        .slice(position + 1)
        .filter((item) => item.open)
        .map((item) => item.id);
      const heights = context.heights.value;
      const front = open.at(-1);
      return {
        index: newer.length,
        count: open.length,
        frontOffset: newer.reduce((sum, newerId) => sum + (heights[newerId] ?? 0), 0),
        height: heights[id] ?? 0,
        frontHeight: front ? (heights[front.id] ?? 0) : 0,
      };
    });

    // biome-ignore lint/correctness/noQwikUseVisibleTask: announcing and measuring the height need the DOM, also for a toast added on the server
    useVisibleTask$(
      ({ cleanup }) => {
        const element = ref.value;
        if (!element) return;
        if (toast.open) {
          const text = [
            element.querySelector('[data-leve-toast-title]')?.textContent,
            element.querySelector('[data-leve-toast-description]')?.textContent,
          ]
            .map((part) => part?.trim())
            .filter(Boolean)
            .join('. ');
          if (text) {
            announce(text, {
              politeness: toast.type === 'background' ? 'polite' : 'assertive',
            });
          }
        }
        if (typeof ResizeObserver === 'undefined') return;
        measureHeight(element, context.heights, id);
        const observer = new ResizeObserver(() => measureHeight(element, context.heights, id));
        observer.observe(element);
        cleanup(() => observer.disconnect());
      },
      { strategy: 'document-ready' },
    );

    // biome-ignore lint/correctness/noQwikUseVisibleTask: the auto-dismiss timer runs only in the browser and pauses with the Region
    useVisibleTask$(
      ({ track, cleanup }) => {
        const open = track(() => toast.open);
        const paused = track(
          () =>
            context.hovered.value ||
            context.focused.value ||
            context.windowBlurred.value ||
            context.swiping.value,
        );
        const duration = track(() => toast.duration ?? context.duration.value);
        const element = ref.value;
        if (!open || paused || !element || !Number.isFinite(duration)) return;
        // A toast with an action must not disappear before the user reaches it
        if (element.querySelector('[data-leve-toast-action]')) return;
        const start = Date.now();
        const wait = remaining.value ?? duration;
        const timer = setTimeout(() => context.dismiss$(id), wait);
        cleanup(() => {
          clearTimeout(timer);
          remaining.value = Math.max(0, wait - (Date.now() - start));
        });
      },
      { strategy: 'document-ready' },
    );

    // biome-ignore lint/correctness/noQwikUseVisibleTask: removing the toast waits for its exit animation in the DOM
    useVisibleTask$(
      ({ track }) => {
        const open = track(() => toast.open);
        const element = ref.value;
        if (open) return;
        if (!element || typeof requestAnimationFrame === 'undefined' || !element.getAnimations) {
          context.remove$(id);
          return;
        }
        // Wait a frame so the closed styles have started their transitions or animations
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            Promise.allSettled(
              element.getAnimations({ subtree: true }).map((animation) => animation.finished),
            ).then(() => context.remove$(id));
          });
        });
      },
      { strategy: 'document-ready' },
    );

    const keyDown$ = $((event: KeyboardEvent, element: HTMLElement) => {
      if (event.key !== 'Escape') return;
      // Focus moves on to the next toast, or the Region when none is left
      const toasts = Array.from(
        element.parentElement?.querySelectorAll<HTMLElement>(
          '[data-leve-toast][data-state="open"]',
        ) ?? [],
      );
      const others = toasts.filter((item) => item !== element);
      const next = others[toasts.indexOf(element)] ?? others.at(-1);
      const region = element.closest<HTMLElement>('[data-leve-toast-region]');
      (next ?? region)?.focus();
      return context.dismiss$(id);
    });

    // Synchronous: the moves that follow must not miss where the pointer went down while the
    // handlers of the move load
    const pointerDown$ = sync$((event: PointerEvent, element: HTMLElement) => {
      const target = event.target as Element | null;
      // Buttons keep their clicks: a captured pointer would send the click to the toast
      const start =
        event.button !== 0 || target?.closest?.('button') ? null : [event.clientX, event.clientY];
      (element as SwipeElement).leveSwipeStart = start;
    });
    const pointerMove$ = $((event: PointerEvent, element: HTMLElement) => {
      const start = (element as SwipeElement).leveSwipeStart;
      if (!start) return;
      const direction = context.swipeDirection.value;
      const horizontal = direction === 'left' || direction === 'right';
      const sign = direction === 'right' || direction === 'down' ? 1 : -1;
      const delta = (horizontal ? event.clientX - start[0] : event.clientY - start[1]) * sign;
      if (!swipe.value && Math.abs(delta) < SWIPE_START) return;
      if (!swipe.value) {
        element.setPointerCapture?.(event.pointerId);
        context.swiping.value = true;
      }
      // Only toward the swipe direction
      const move = Math.max(0, delta) * sign;
      swipe.value = { state: 'move', x: horizontal ? move : 0, y: horizontal ? 0 : move };
    });
    const pointerUp$ = $((_event: PointerEvent, element: HTMLElement) => {
      const current = swipe.value;
      (element as SwipeElement).leveSwipeStart = null;
      if (!current) return;
      context.swiping.value = false;
      const distance = Math.abs(current.x || current.y);
      if (distance >= context.swipeThreshold.value) {
        swipe.value = { ...current, state: 'end' };
        return context.dismiss$(id);
      }
      swipe.value = { state: 'cancel', x: 0, y: 0 };
    });

    const s = stack.value;
    const current = swipe.value;
    const expanded = context.hovered.value || context.focused.value;

    return (
      <li
        {...props}
        ref={ref}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a toast is focusable so it can be read and closed with Escape (F8 moves into the Region, then Tab)
        tabIndex={0}
        style={withCssVars(props.style, {
          '--leve-toast-index': String(s.index),
          '--leve-toast-count': String(s.count),
          '--leve-toast-front-offset': `${s.frontOffset}px`,
          '--leve-toast-height': `${s.height}px`,
          '--leve-toast-front-height': `${s.frontHeight}px`,
          '--leve-toast-swipe-move-x': current?.state === 'move' ? `${current.x}px` : undefined,
          '--leve-toast-swipe-move-y': current?.state === 'move' ? `${current.y}px` : undefined,
          '--leve-toast-swipe-end-x': current?.state === 'end' ? `${current.x}px` : undefined,
          '--leve-toast-swipe-end-y': current?.state === 'end' ? `${current.y}px` : undefined,
        })}
        onKeyDown$={[keyDown$, onKeyDown$]}
        onPointerDown$={[pointerDown$, onPointerDown$]}
        onPointerMove$={[pointerMove$, onPointerMove$]}
        onPointerUp$={[pointerUp$, onPointerUp$]}
        onPointerCancel$={[pointerUp$, onPointerCancel$]}
        data-leve-toast=""
        data-state={toast.open ? 'open' : 'closed'}
        data-type={toast.type}
        data-placement={context.placement.value}
        data-front={dataAttr(s.index === 0)}
        data-expanded={dataAttr(expanded)}
        data-swipe={current?.state}
        data-swipe-direction={context.swipeDirection.value}
      >
        <Slot />
      </li>
    );
  },
);
