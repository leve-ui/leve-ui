import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { progressContextId } from './progress-context';

export type ProgressValueTextProps = PropsOf<'span'>;

/** 現在の値を表示します。Root の `valueText`、省略時は割合（例: `"30%"`）を表示します */
export const ProgressValueText = component$<ProgressValueTextProps>((props) => {
  const context = useContext(progressContextId);

  return (
    <span
      {...props}
      data-leve-progress-value-text=""
      data-state={context.state.value}
      data-value={context.value.value ?? undefined}
      data-min={context.min.value}
      data-max={context.max.value}
    >
      {context.valueText.value}
    </span>
  );
});
