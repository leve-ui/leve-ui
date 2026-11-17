import {
  $,
  component$,
  type PropsOf,
  Slot,
  useContext,
  useOnDocument,
  useOnWindow,
  useSignal,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { toastProviderContextId } from './toast-context';

export type ToastRegionProps = PropsOf<'section'> & {
  /**
   * The name of the region. `{hotkey}` is replaced with the hotkey, e.g. `F8`.
   * @default 'Notifications ({hotkey})'
   */
  label?: string;
};

const MODIFIERS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const;

/** Whether an event's related target is outside the Region */
function isOutside(element: HTMLElement, target: EventTarget | null) {
  return !target || !element.contains(target as Node);
}

/**
 * 通知を並べるランドマーク（`<section aria-label>`）です。中に `Toast.List` を置きます。
 *
 * - ホットキー（既定は F8）でこの領域にフォーカスします。Tab で中の通知に移れます。
 * - ポインタが載っているか、中にフォーカスがある間は `data-expanded` を出力し（重ねた通知を広げる
 *   スタイル用）、通知が自動で閉じるのを止めます。ウィンドウが非アクティブの間も止めます。
 */
export const ToastRegion = component$<ToastRegionProps>(
  ({ label, onPointerOver$, onPointerOut$, onFocusIn$, onFocusOut$, ...props }) => {
    const context = useContext(toastProviderContextId);
    const ref = useSignal<HTMLElement>();
    const hotkeyLabel = context.hotkey.value
      .map((key) => key.replace(/^Key|^Digit|Key$/g, ''))
      .join('+');

    useOnDocument(
      'keydown',
      $((event: KeyboardEvent) => {
        const keys = context.hotkey.value;
        if (keys.length === 0) return;
        const matches = keys.every((key) =>
          (MODIFIERS as readonly string[]).includes(key)
            ? event[key as (typeof MODIFIERS)[number]]
            : event.code === key,
        );
        if (matches) ref.value?.focus();
      }),
    );
    useOnWindow(
      'blur',
      $(() => {
        context.windowBlurred.value = true;
      }),
    );
    useOnWindow(
      'focus',
      $(() => {
        context.windowBlurred.value = false;
      }),
    );

    const pointerOver$ = $(() => {
      context.hovered.value = true;
    });
    const pointerOut$ = $((event: PointerEvent, element: HTMLElement) => {
      // A touch ends with pointerout too; the stack stays expanded only while a mouse is over it
      if (isOutside(element, event.relatedTarget) || event.pointerType === 'touch') {
        context.hovered.value = false;
      }
    });
    const focusIn$ = $(() => {
      context.focused.value = true;
    });
    const focusOut$ = $((event: FocusEvent, element: HTMLElement) => {
      if (isOutside(element, event.relatedTarget)) context.focused.value = false;
    });

    const expanded = context.hovered.value || context.focused.value;

    return (
      <section
        {...props}
        ref={ref}
        tabIndex={-1}
        aria-label={(label ?? 'Notifications ({hotkey})').replace('{hotkey}', hotkeyLabel)}
        onPointerOver$={[pointerOver$, onPointerOver$]}
        onPointerOut$={[pointerOut$, onPointerOut$]}
        onFocusIn$={[focusIn$, onFocusIn$]}
        onFocusOut$={[focusOut$, onFocusOut$]}
        data-leve-toast-region=""
        data-placement={context.placement.value}
        data-expanded={dataAttr(expanded)}
      >
        <Slot />
      </section>
    );
  },
);
