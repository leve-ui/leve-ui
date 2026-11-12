import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { radioGroupItemContextId } from './radio-group-context';

export type RadioGroupIndicatorProps = PropsOf<'span'>;

/**
 * 選択状態を示すインジケーター要素です。
 *
 * 親の `RadioGroup.Item` の内部で使用され、親のチェック状態および無効状態を
 * `data-state` と `data-disabled` 属性として反映します。
 * スクリーンリーダーからは隠すため `aria-hidden="true"` が常に付与されます。
 */
export const RadioGroupIndicator = component$<RadioGroupIndicatorProps>((props) => {
  const itemContext = useContext(radioGroupItemContextId);

  return (
    <span
      {...props}
      aria-hidden="true"
      data-leve-radio-group-indicator=""
      data-state={itemContext.checked.value ? 'checked' : 'unchecked'}
      data-disabled={dataAttr(itemContext.disabled.value)}
    >
      <Slot />
    </span>
  );
});
