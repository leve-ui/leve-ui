import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { switchContextId } from './switch-context';

export type SwitchThumbProps = PropsOf<'span'>;

/**
 * スイッチのつまみ（Thumb）を表す装飾要素です。
 *
 * スクリーンリーダーから隠すため、`aria-hidden="true"` が付与されます。
 */
export const SwitchThumb = component$<SwitchThumbProps>((props) => {
  const context = useContext(switchContextId);

  return (
    <span
      {...props}
      aria-hidden="true"
      data-leve-switch-thumb=""
      data-state={context.checked.value ? 'checked' : 'unchecked'}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </span>
  );
});
