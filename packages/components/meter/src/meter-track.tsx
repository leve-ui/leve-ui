import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { meterContextId } from './meter-context';

export type MeterTrackProps = PropsOf<'div'>;

/** Indicator を入れる、値の範囲全体を表す要素です */
export const MeterTrack = component$<MeterTrackProps>((props) => {
  const context = useContext(meterContextId);

  return (
    <div
      {...props}
      data-leve-meter-track=""
      data-value={context.value.value}
      data-min={context.min.value}
      data-max={context.max.value}
    >
      <Slot />
    </div>
  );
});
