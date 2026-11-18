import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { comboboxContextId } from './combobox-context';

export type ComboboxControlProps = PropsOf<'div'>;

/**
 * Input と Trigger を包む要素です。Content はこの要素の下に、この幅を基準に置きます。
 */
export const ComboboxControl = component$<ComboboxControlProps>((props) => {
  const context = useContext(comboboxContextId);

  return (
    <div
      {...props}
      id={context.ids.control}
      data-leve-combobox-control=""
      data-state={context.open.value ? 'open' : 'closed'}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </div>
  );
});
