import { component$, useStyles$ } from '@builder.io/qwik';
import { Slider } from '@leve-ui/slider';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Slider.Root defaultValue={[40]} class="slider-default">
      <Slider.Track class="slider-default-track">
        <Slider.Range class="slider-default-range" />
        <Slider.Thumb class="slider-default-thumb" aria-label="Volume" />
      </Slider.Track>
    </Slider.Root>
  );
});
