import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { meterContextId } from './meter-context';

export type MeterLabelProps = PropsOf<'span'>;

/** Meter のラベルです。Root のアクセシブルネームになります。`id` を変える場合は、Root にも同じ値の `aria-labelledby` を渡してください */
export const MeterLabel = component$<MeterLabelProps>((props) => {
  const context = useContext(meterContextId);

  return (
    <span
      {...props}
      id={props.id ?? context.labelId}
      data-leve-meter-label=""
      data-value={context.value.value}
      data-min={context.min.value}
      data-max={context.max.value}
    >
      <Slot />
    </span>
  );
});
