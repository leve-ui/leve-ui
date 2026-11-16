import {
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
import { type PopoverIds, popoverContextId } from './popover-context';

export type PopoverRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. */
  ids?: Partial<PopoverIds>;
  /**
   * Whether the popover is open initially (uncontrolled). It opens when the page resumes.
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the popover opens or closes by a user interaction. */
  onOpenChange$?: QRL<(open: boolean) => void>;
};

/**
 * ポップオーバー（ボタンの隣に開く小さなパネル）のルート要素です。開閉状態を持ち、Context を提供します。
 *
 * 該当する APG パターンはなく、ボタンに結び付いた非モーダルのダイアログとして作っています。
 * Content は `popover="manual"` で最前面（top layer）に出し（`adr/0029`）、Floating UI で
 * Trigger の隣に置きます（`adr/0030`）。
 */
export const PopoverRoot = component$<PopoverRootProps>(
  ({ ids: propIds, defaultOpen = false, 'bind:open': bindOpen, onOpenChange$, ...props }) => {
    const [open, setOpen$] = useControllableState({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });
    const anchor = useSignal<Element>();

    const base = useId();
    const ids: PopoverIds = {
      trigger: propIds?.trigger ?? `${base}-trigger`,
      content: propIds?.content ?? `${base}-content`,
      title: propIds?.title ?? `${base}-title`,
      description: propIds?.description ?? `${base}-description`,
    };

    useContextProvider(popoverContextId, { ids, open, setOpen$, anchor });

    return (
      <div {...props} data-leve-popover="" data-state={open.value ? 'open' : 'closed'}>
        <Slot />
      </div>
    );
  },
);
