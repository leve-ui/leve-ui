import {
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import { useControllableState } from '@leve-ui/utils';
import { type DialogIds, dialogContextId } from './dialog-context';

export type DialogRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. */
  ids?: Partial<DialogIds>;
  /**
   * Whether the dialog is open initially (uncontrolled). The dialog opens when the page resumes,
   * since `showModal()` runs on the client.
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the dialog opens or closes by a user interaction. */
  onOpenChange$?: QRL<(open: boolean) => void>;
};

/**
 * モーダルダイアログのルート要素です。開閉状態を持ち、子パーツに Context を提供します。
 *
 * WAI-ARIA APG の Dialog (Modal) パターンに準拠します。Content はネイティブの `<dialog>` を
 * `showModal()` で開き、最前面（top layer）に描画します（`adr/0029`）。
 * 非制御モード（`defaultOpen`）と制御モード（`bind:open` / `onOpenChange$`）の両方に対応しています。
 */
export const DialogRoot = component$<DialogRootProps>(
  ({ ids: propIds, defaultOpen = false, 'bind:open': bindOpen, onOpenChange$, ...props }) => {
    const [open, setOpen$] = useControllableState({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });

    const base = useId();
    const ids: DialogIds = {
      trigger: propIds?.trigger ?? `${base}-trigger`,
      content: propIds?.content ?? `${base}-content`,
      title: propIds?.title ?? `${base}-title`,
      description: propIds?.description ?? `${base}-description`,
    };

    useContextProvider(dialogContextId, { ids, open, setOpen$ });

    return (
      <div {...props} data-leve-dialog="" data-state={open.value ? 'open' : 'closed'}>
        <Slot />
      </div>
    );
  },
);
