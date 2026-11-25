import { component$, useStyles$ } from '@builder.io/qwik';
import { Slider } from '@leve-ui/slider';
import styles from './read-only.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Slider.Root defaultValue={[65]} readOnly class="slider-read-only">
      <Slider.Track class="slider-read-only-track">
        <Slider.Range class="slider-read-only-range" />
        <Slider.Thumb class="slider-read-only-thumb" aria-label="Read-only slider" />
      </Slider.Track>
    </Slider.Root>
  );
});
