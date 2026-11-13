import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import { dataAttr, useControllableState } from '@leve-ui/utils';
import { type CollapsibleIds, collapsibleContextId } from './collapsible-context';

export type CollapsibleRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. */
  ids?: Partial<CollapsibleIds>;
  /**
   * Whether the content is open initially (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the user opens or closes the content. */
  onOpenChange$?: QRL<(open: boolean) => void>;
  /**
   * Disables the trigger.
   * @default false
   */
  disabled?: boolean;
};

/**
 * 折りたたみ可能なコンテンツ領域とそのトリガーを包括するルート要素です。
 *
 * WAI-ARIA APG の Disclosure (Show/Hide) パターンに準拠しています。
 * 非制御モード（`defaultOpen`）と制御モード（`bind:open` / `onOpenChange$`）の両方に対応しています。
 * 各パーツの要素 ID を上書きする場合は `ids` プロパティを使用します。
 */
export const CollapsibleRoot = component$<CollapsibleRootProps>(
  ({
    ids: propIds,
    defaultOpen = false,
    'bind:open': bindOpen,
    onOpenChange$,
    disabled: rootDisabled,
    ...props
  }) => {
    const [open, setOpen$] = useControllableState({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });

    const base = useId();
    const ids: CollapsibleIds = {
      trigger: propIds?.trigger ?? `${base}-trigger`,
      content: propIds?.content ?? `${base}-content`,
    };

    const disabledSignal = useComputed$(() => !!rootDisabled);

    const toggle$ = $(() => {
      if (disabledSignal.value) return;
      setOpen$(!open.value);
    });

    useContextProvider(collapsibleContextId, {
      ids,
      open,
      disabled: disabledSignal,
      toggle$,
      setOpen$,
    });

    return (
      <div
        {...props}
        data-leve-collapsible=""
        data-state={open.value ? 'open' : 'closed'}
        data-disabled={dataAttr(disabledSignal.value)}
      >
        <Slot />
      </div>
    );
  },
);
