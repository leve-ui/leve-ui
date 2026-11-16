import {
  component$,
  type PropsOf,
  type Signal,
  Slot,
  useComputed$,
  useSignal,
} from '@builder.io/qwik';
import { dataAttr, useToolbarItem } from '@leve-ui/utils';

export type ToolbarButtonProps = PropsOf<'button'>;

/** ツールバーのボタンです。ネイティブの `<button type="button">` を使います。 */
export const ToolbarButton = component$<ToolbarButtonProps>(({ onFocus$, ...props }) => {
  const disabled = useComputed$(() => Boolean(props.disabled));
  const internalRef = useSignal<Element>();
  // A ref passed by the consumer is used as it is
  const ref = (props.ref as Signal<Element | undefined> | undefined) ?? internalRef;
  const item = useToolbarItem(disabled, ref);

  return (
    <button
      type="button"
      {...props}
      ref={ref}
      tabIndex={item.tabIndex.value}
      onFocus$={[item.onFocus$, onFocus$]}
      data-leve-toolbar-button=""
      data-leve-toolbar-item={item.itemId}
      data-disabled={dataAttr(disabled.value)}
    >
      <Slot />
    </button>
  );
});
