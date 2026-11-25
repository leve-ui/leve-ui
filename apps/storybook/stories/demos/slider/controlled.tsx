import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Slider } from '@leve-ui/slider';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal([50]);
  const committed = useSignal([50]);

  return (
    <div class="slider-controlled">
      <div class="slider-controlled-header">
        <span>Volume</span>
        <span class="slider-controlled-value">
          {value.value[0]}% (committed: {committed.value[0]}%)
        </span>
      </div>
      <Slider.Root
        bind:value={value}
        onValueCommit$={(next) => {
          committed.value = next;
        }}
        class="slider-controlled-root"
      >
        <Slider.Track class="slider-controlled-track">
          <Slider.Range class="slider-controlled-range" />
          <Slider.Thumb class="slider-controlled-thumb" aria-label="Volume" />
        </Slider.Track>
      </Slider.Root>
    </div>
  );
});
