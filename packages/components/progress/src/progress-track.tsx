import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { progressContextId } from './progress-context';

export type ProgressTrackProps = PropsOf<'div'>;

/** Indicator を入れる、値の範囲全体を表す要素です */
export const ProgressTrack = component$<ProgressTrackProps>((props) => {
  const context = useContext(progressContextId);

  return (
    <div
      {...props}
      data-leve-progress-track=""
      data-state={context.state.value}
      data-value={context.value.value ?? undefined}
      data-min={context.min.value}
      data-max={context.max.value}
    >
      <Slot />
    </div>
  );
});
