import { component$, useStyles$ } from '@builder.io/qwik';
import { Slider } from '@leve-ui/slider';
import styles from './vertical.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Slider.Root defaultValue={[60]} orientation="vertical" class="slider-vertical">
      <Slider.Track class="slider-vertical-track">
        <Slider.Range class="slider-vertical-range" />
        <Slider.Thumb class="slider-vertical-thumb" aria-label="Gain" />
      </Slider.Track>
    </Slider.Root>
  );
});
