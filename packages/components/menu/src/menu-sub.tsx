import {
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { useControllableState } from '@leve-ui/utils';
import { menuContextId, menuSubContextId } from './menu-context';

export type MenuSubProps = PropsOf<'div'> & {
  /**
   * Whether the submenu is open initially (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the submenu opens or closes by a user interaction. */
  onOpenChange$?: QRL<(open: boolean) => void>;
};

/**
 * サブメニューです。`Menu.SubTrigger` と `Menu.SubContent` を中に置きます。
 * 親のメニューが閉じると、サブメニューも閉じます。
 */
export const MenuSub = component$<MenuSubProps>(
  ({ defaultOpen = false, 'bind:open': bindOpen, onOpenChange$, ...props }) => {
    const menu = useContext(menuContextId);
    const [open, setOpen$] = useControllableState({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });
    const focusOnOpen = useSignal(true);
    const base = useId();
    const ids = { trigger: `${base}-sub-trigger`, content: `${base}-sub-content` };

    useContextProvider(menuSubContextId, { ids, open, setOpen$, focusOnOpen });

    // Closes with the whole menu
    useTask$(({ track }) => {
      if (!track(() => menu.open.value) && open.value) setOpen$(false);
    });

    return (
      <div {...props} data-leve-menu-sub="" data-state={open.value ? 'open' : 'closed'}>
        <Slot />
      </div>
    );
  },
);
