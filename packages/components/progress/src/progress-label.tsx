import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { progressContextId } from './progress-context';

export type ProgressLabelProps = PropsOf<'span'>;

/** Progress のラベルです。Root のアクセシブルネームになります。`id` を変える場合は、Root にも同じ値の `aria-labelledby` を渡してください */
export const ProgressLabel = component$<ProgressLabelProps>((props) => {
  const context = useContext(progressContextId);

  return (
    <span
      {...props}
      id={props.id ?? context.labelId}
      data-leve-progress-label=""
      data-state={context.state.value}
      data-value={context.value.value ?? undefined}
      data-min={context.min.value}
      data-max={context.max.value}
    >
      <Slot />
    </span>
  );
});
