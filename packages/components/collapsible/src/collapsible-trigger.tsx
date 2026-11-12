import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { collapsibleContextId } from './collapsible-context';

export type CollapsibleTriggerProps = PropsOf<'button'>;

/**
 * コンテンツ領域の表示・非表示を切り替えるトリガーボタンです。
 *
 * WAI-ARIA APG の Disclosure (Show/Hide) パターンに準拠し、`type="button"`、
 * `aria-expanded`、および Content 要素を指す `aria-controls` を出力します。
 */
export const CollapsibleTrigger = component$<CollapsibleTriggerProps>(({ onClick$, ...props }) => {
  const context = useContext(collapsibleContextId);

  return (
    <button
      {...props}
      type="button"
      id={context.ids.trigger}
      aria-expanded={context.open.value ? 'true' : 'false'}
      aria-controls={context.ids.content}
      disabled={context.disabled.value}
      onClick$={[context.toggle$, onClick$]}
      data-leve-collapsible-trigger=""
      data-state={context.open.value ? 'open' : 'closed'}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </button>
  );
});
