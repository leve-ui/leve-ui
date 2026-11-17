import { $, component$, type PropsOf, Slot, sync$, useContext } from '@builder.io/qwik';
import { menuContextId } from './menu-context';

export type MenuTriggerProps = PropsOf<'button'>;

/**
 * メニューを開くボタンです。`aria-haspopup="menu"`、`aria-expanded`、`aria-controls` を出力します。
 *
 * クリック、Enter、Space、↓ で開いて最初の項目に、↑ で開いて最後の項目にフォーカスします。
 */
export const MenuTrigger = component$<MenuTriggerProps>(({ onClick$, onKeyDown$, ...props }) => {
  const context = useContext(menuContextId);

  const toggle$ = $(() => {
    context.initialFocus.value = 'first';
    return context.setOpen$(!context.open.value);
  });

  // Arrow keys would scroll the page; Enter / Space already click the button
  const preventScroll$ = sync$((event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') event.preventDefault();
  });
  const keyDown$ = $((event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    context.initialFocus.value = event.key === 'ArrowUp' ? 'last' : 'first';
    return context.setOpen$(true);
  });

  return (
    <button
      {...props}
      type="button"
      id={context.ids.trigger}
      aria-haspopup="menu"
      aria-expanded={context.open.value ? 'true' : 'false'}
      aria-controls={context.ids.content}
      onClick$={[toggle$, onClick$]}
      onKeyDown$={[preventScroll$, keyDown$, onKeyDown$]}
      data-leve-menu-trigger=""
      data-state={context.open.value ? 'open' : 'closed'}
    >
      <Slot />
    </button>
  );
});
