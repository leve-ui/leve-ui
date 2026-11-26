import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { Slider } from '@leve-ui/slider';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription class="slider-with-field">
      <Field.Label class="slider-with-field-label">Brightness</Field.Label>
      <Slider.Root defaultValue={[70]} class="slider-with-field-root">
        <Slider.Track class="slider-with-field-track">
          <Slider.Range class="slider-with-field-range" />
          <Slider.Thumb class="slider-with-field-thumb" />
        </Slider.Track>
      </Slider.Root>
      <Field.Description class="slider-with-field-description">
        Adjust the display brightness level.
      </Field.Description>
    </Field.Root>
  );
});
