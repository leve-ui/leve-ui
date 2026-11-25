import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { RatingGroup } from '@leve-ui/rating-group';
import { LuStar } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal(2);

  return (
    <div class="rating-group-controlled-wrapper">
      <RatingGroup.Root
        aria-label="Controlled rating"
        bind:value={value}
        allowClear
        class="rating-group-controlled"
      >
        {[1, 2, 3, 4, 5].map((index) => (
          <RatingGroup.Item key={index} index={index} class="rating-group-controlled-item">
            <LuStar aria-hidden="true" class="rating-group-controlled-icon" />
          </RatingGroup.Item>
        ))}
      </RatingGroup.Root>
      <div class="rating-group-controlled-controls">
        <span class="rating-group-controlled-value">Rating: {value.value} / 5</span>
        <button
          type="button"
          class="rating-group-controlled-button"
          onClick$={() => {
            value.value = 0;
          }}
        >
          Clear
        </button>
        <button
          type="button"
          class="rating-group-controlled-button"
          onClick$={() => {
            value.value = 5;
          }}
        >
          Set 5
        </button>
      </div>
    </div>
  );
});
