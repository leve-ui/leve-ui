import {
  component$,
  type PropsOf,
  type Signal,
  Slot,
  useComputed$,
  useSignal,
} from '@builder.io/qwik';
import { useToolbarItem } from '@leve-ui/utils';

export type ToolbarLinkProps = PropsOf<'a'>;

/** ツールバーのリンクです。ネイティブの `<a>` を使います。 */
export const ToolbarLink = component$<ToolbarLinkProps>(({ onFocus$, ...props }) => {
  const disabled = useComputed$(() => false);
  const internalRef = useSignal<Element>();
  // A ref passed by the consumer is used as it is
  const ref = (props.ref as Signal<Element | undefined> | undefined) ?? internalRef;
  const item = useToolbarItem(disabled, ref);

  return (
    <a
      {...props}
      ref={ref}
      tabIndex={item.tabIndex.value}
      onFocus$={[item.onFocus$, onFocus$]}
      data-leve-toolbar-link=""
      data-leve-toolbar-item={item.itemId}
    >
      <Slot />
    </a>
  );
});
