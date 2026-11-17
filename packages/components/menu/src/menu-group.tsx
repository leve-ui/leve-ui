import { component$, type PropsOf, Slot, useContextProvider, useId } from '@builder.io/qwik';
import { menuGroupContextId } from './menu-context';

export type MenuGroupProps = PropsOf<'div'>;

/** 項目のまとまりです。`role="group"` を出力し、中の `Menu.GroupLabel` で名前を付けます。 */
export const MenuGroup = component$<MenuGroupProps>((props) => {
  const labelId = `${useId()}-label`;
  useContextProvider(menuGroupContextId, { labelId });

  return (
    // biome-ignore lint/a11y/useSemanticElements: a <fieldset> is for form controls; the APG Menu uses role="group" for groups of menu items
    <div
      aria-labelledby={props['aria-label'] ? undefined : labelId}
      {...props}
      role="group"
      data-leve-menu-group=""
    >
      <Slot />
    </div>
  );
});
