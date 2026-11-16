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
import { type TooltipIds, tooltipContextId } from './tooltip-context';

export type TooltipRootProps = PropsOf<'span'> & {
  /** Overrides the element IDs of the parts. */
  ids?: Partial<TooltipIds>;
  /**
   * Whether the tooltip is shown initially (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the tooltip is shown or hidden by a user interaction. */
  onOpenChange$?: QRL<(open: boolean) => void>;
  /**
   * The delay in ms before the tooltip opens when the pointer rests on the Trigger. Focus opens it at once.
   * @default 700
   */
  openDelay?: number;
  /**
   * The delay in ms before the tooltip closes when the pointer leaves, so that the pointer can move onto it.
   * @default 300
   */
  closeDelay?: number;
};

/**
 * ツールチップ（要素の補足説明）のルート要素です。インライン要素の `<span>` を描画します。
 *
 * WAI-ARIA APG の Tooltip パターンに準拠します。Trigger にポインタを載せる（`openDelay` 後）か
 * フォーカスすると表示し、離れる（`closeDelay` 後）かフォーカスが外れる、または Escape で隠します。
 * ポインタを Content に移す間は閉じません（WCAG 1.4.13）。
 */
export const TooltipRoot = component$<TooltipRootProps>(
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
    const ids: TooltipIds = {
      trigger: propIds?.trigger ?? `${base}-trigger`,
      content: propIds?.content ?? `${base}-content`,
    };

    const timer = useSignal<number | undefined>();
    const pointerOnTrigger = useSignal(false);
    const pointerOnContent = useSignal(false);
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
        if (pointerOnTrigger.value || pointerOnContent.value) setOpen$(true);
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
        if (!(pointerOnTrigger.value || pointerOnContent.value)) setOpen$(false);
      }, closeDelay ?? 300);
    });

    useContextProvider(tooltipContextId, {
      ids,
      open,
      setOpen$,
      show$,
      hide$,
      cancel$,
      pointerOnTrigger,
      pointerOnContent,
    });

    return (
      <span {...props} data-leve-tooltip="" data-state={open.value ? 'open' : 'closed'}>
        <Slot />
      </span>
    );
  },
);
