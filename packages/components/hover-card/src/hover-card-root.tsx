import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useContextProvider,
  useId,
  useSignal,
} from '@builder.io/qwik';
import { useControllableState } from '@leve-ui/utils';
import { type HoverCardIds, hoverCardContextId } from './hover-card-context';

export type HoverCardRootProps = PropsOf<'span'> & {
  /** Overrides the element IDs of the parts. */
  ids?: Partial<HoverCardIds>;
  /**
   * Whether the card is shown initially (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the card is shown or hidden by a user interaction. */
  onOpenChange$?: QRL<(open: boolean) => void>;
  /**
   * The delay in ms before the card opens when the pointer rests on the Trigger or the Trigger is focused.
   * @default 700
   */
  openDelay?: number;
  /**
   * The delay in ms before the card closes when the pointer leaves, so that the pointer can move onto it.
   * @default 300
   */
  closeDelay?: number;
};

/**
 * ホバーカード（リンク先のプレビュー）のルート要素です。インライン要素の `<span>` を描画します。
 *
 * 該当する APG パターンはありません。Trigger のリンクにポインタを載せるかフォーカスすると
 * `openDelay` 後に表示し、離れる（`closeDelay` 後）かフォーカスが外れる、または Escape で隠します。
 * ポインタを Content に移す間は閉じません（WCAG 1.4.13）。
 */
export const HoverCardRoot = component$<HoverCardRootProps>(
  ({
    ids: propIds,
    defaultOpen = false,
    'bind:open': bindOpen,
    onOpenChange$,
    openDelay,
    closeDelay,
    ...props
  }) => {
    const [open, setOpen$] = useControllableState({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });

    const base = useId();
    const ids: HoverCardIds = {
      trigger: propIds?.trigger ?? `${base}-trigger`,
      content: propIds?.content ?? `${base}-content`,
    };

    const timer = useSignal<number | undefined>();
    const pointerOnTrigger = useSignal(false);
    const pointerOnContent = useSignal(false);
    const focused = useSignal(false);
    const cancel$ = $(() => {
      if (timer.value !== undefined) clearTimeout(timer.value);
      timer.value = undefined;
    });
    const show$ = $(async (immediate: boolean) => {
      await cancel$();
      if (immediate) {
        await setOpen$(true);
        return;
      }
      timer.value = window.setTimeout(() => {
        timer.value = undefined;
        if (pointerOnTrigger.value || pointerOnContent.value || focused.value) setOpen$(true);
      }, openDelay ?? 700);
    });
    const hide$ = $(async (immediate: boolean) => {
      await cancel$();
      if (immediate) {
        await setOpen$(false);
        return;
      }
      timer.value = window.setTimeout(() => {
        timer.value = undefined;
        if (!(pointerOnTrigger.value || pointerOnContent.value) && !focused.value) setOpen$(false);
      }, closeDelay ?? 300);
    });

    useContextProvider(hoverCardContextId, {
      ids,
      open,
      setOpen$,
      show$,
      hide$,
      cancel$,
      pointerOnTrigger,
      pointerOnContent,
      focused,
    });

    return (
      <span {...props} data-leve-hover-card="" data-state={open.value ? 'open' : 'closed'}>
        <Slot />
      </span>
    );
  },
);
