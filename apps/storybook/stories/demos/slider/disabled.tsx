import { component$, useStyles$ } from '@builder.io/qwik';
import { Slider } from '@leve-ui/slider';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Slider.Root defaultValue={[40]} disabled class="slider-disabled">
      <Slider.Track class="slider-disabled-track">
        <Slider.Range class="slider-disabled-range" />
        <Slider.Thumb class="slider-disabled-thumb" aria-label="Disabled slider" />
      </Slider.Track>
    </Slider.Root>
  );
});
