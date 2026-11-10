import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { progressContextId } from './progress-context';

export type ProgressIndicatorProps = PropsOf<'div'>;

/** 現在の値を表す要素です。幅などの見た目は `data-state` / `data-value` や利用者側の値で指定してください */
export const ProgressIndicator = component$<ProgressIndicatorProps>((props) => {
  const context = useContext(progressContextId);

  return (
    <div
      {...props}
      data-leve-progress-indicator=""
      data-state={context.state.value}
      data-value={context.value.value ?? undefined}
      data-min={context.min.value}
      data-max={context.max.value}
    />
  );
});
