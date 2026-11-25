import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { RatingGroup } from '@leve-ui/rating-group';
import { LuStar } from '@qwikest/icons/lucide';
import styles from './with-form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const submitted = useSignal<string | null>(null);

  return (
    <div class="rating-group-with-form-wrapper">
      <form
        class="rating-group-with-form-form"
        preventdefault:submit
        onSubmit$={(event) => {
          const form = event.target as HTMLFormElement;
          const formData = new FormData(form);
          submitted.value = (formData.get('rating') as string) || '(none)';
        }}
      >
        <RatingGroup.Root
          aria-label="Service rating"
          defaultValue={3}
          required
          class="rating-group-with-form"
        >
          {[1, 2, 3, 4, 5].map((index) => (
            <RatingGroup.Item key={index} index={index} class="rating-group-with-form-item">
              <LuStar aria-hidden="true" class="rating-group-with-form-icon" />
            </RatingGroup.Item>
          ))}
          <RatingGroup.HiddenInput name="rating" />
        </RatingGroup.Root>
        <div class="rating-group-with-form-actions">
          <button type="submit" class="rating-group-with-form-button">
            Submit
          </button>
          <button type="reset" class="rating-group-with-form-reset">
            Reset
          </button>
        </div>
      </form>
      {submitted.value !== null && (
        <output class="rating-group-with-form-output" data-testid="submitted-rating">
          Submitted: {submitted.value}
        </output>
      )}
    </div>
  );
});
