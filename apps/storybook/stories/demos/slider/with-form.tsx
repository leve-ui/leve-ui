import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Slider } from '@leve-ui/slider';
import styles from './with-form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const submitted = useSignal<string | null>(null);

  return (
    <div class="slider-with-form">
      <form
        class="slider-with-form-form"
        preventdefault:submit
        onSubmit$={(_, form) => {
          const data = new FormData(form);
          submitted.value = String(data.get('volume') ?? '');
        }}
        onReset$={() => {
          submitted.value = null;
        }}
      >
        <Slider.Root defaultValue={[35]} class="slider-with-form-root">
          <Slider.Track class="slider-with-form-track">
            <Slider.Range class="slider-with-form-range" />
            <Slider.Thumb class="slider-with-form-thumb" aria-label="Volume" />
          </Slider.Track>
          <Slider.HiddenInput name="volume" />
        </Slider.Root>
        <div class="slider-with-form-actions">
          <button type="submit" class="slider-with-form-submit">
            Submit
          </button>
          <button type="reset" class="slider-with-form-reset">
            Reset
          </button>
        </div>
      </form>
      <output class="slider-with-form-output">
        {submitted.value === null ? 'Not submitted' : `Submitted: ${submitted.value}`}
      </output>
    </div>
  );
});
