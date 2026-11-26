import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Slider } from '@leve-ui/slider';
import styles from './range.css?inline';

export default component$(() => {
  useStyles$(styles);
  const priceRange = useSignal([20, 80]);

  return (
    <div class="slider-range">
      <div class="slider-range-header">
        <span>Price range</span>
        <span class="slider-range-value">
          ${priceRange.value[0]} – ${priceRange.value[1]}
        </span>
      </div>
      <Slider.Root bind:value={priceRange} min={0} max={100} step={5} minStepsBetweenThumbs={2}>
        <Slider.Track class="slider-range-track">
          <Slider.Range class="slider-range-bar" />
          <Slider.Thumb index={0} class="slider-range-thumb" aria-label="Minimum price" />
          <Slider.Thumb index={1} class="slider-range-thumb" aria-label="Maximum price" />
        </Slider.Track>
      </Slider.Root>
    </div>
  );
});
