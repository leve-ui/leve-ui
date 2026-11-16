import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { radioGroupContextId } from './radio-group-context';

export type RadioGroupLabelProps = PropsOf<'span'>;

/**
 * ラジオグループのラベル要素です。
 *
 * Root 要素の `aria-labelledby` とこの要素の `id` が自動的に関連付けられます。
 * ID を変える場合は Root の `ids.label` を使ってください（この要素に `id` を渡した場合は、
 * Root の `aria-labelledby` も同じ ID にする必要があります）。
 * グループ全体が無効化されている場合は `data-disabled` が付与されます。
 */
export const RadioGroupLabel = component$<RadioGroupLabelProps>((props) => {
  const context = useContext(radioGroupContextId);

  return (
    <span
      {...props}
      id={props.id ?? context.ids.label}
      data-leve-radio-group-label=""
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </span>
  );
});
