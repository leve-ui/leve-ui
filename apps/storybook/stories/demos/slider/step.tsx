import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Slider } from '@leve-ui/slider';
import styles from './step.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal([0.5]);

  return (
    <div class="slider-step">
      <div class="slider-step-header">
        <span>Opacity</span>
        <span class="slider-step-value">{value.value[0]}</span>
      </div>
      <Slider.Root bind:value={value} min={0} max={1} step={0.1} largeStep={0.2}>
        <Slider.Track class="slider-step-track">
          <Slider.Range class="slider-step-range" />
          <Slider.Thumb class="slider-step-thumb" aria-label="Opacity" />
        </Slider.Track>
      </Slider.Root>
    </div>
  );
});
