import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { RatingGroup } from '@leve-ui/rating-group';
import { LuStar, LuStarHalf } from '@qwikest/icons/lucide';
import styles from './half-ratings.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal(3.5);

  return (
    <div class="rating-group-half-ratings-wrapper">
      <RatingGroup.Root
        aria-label="Half-star rating"
        allowHalf
        bind:value={value}
        class="rating-group-half-ratings"
      >
        {[1, 2, 3, 4, 5].map((index) => (
          <RatingGroup.Item key={index} index={index} class="rating-group-half-ratings-item">
            <LuStar aria-hidden="true" class="rating-group-half-ratings-star" />
            <LuStarHalf aria-hidden="true" class="rating-group-half-ratings-half" />
          </RatingGroup.Item>
        ))}
      </RatingGroup.Root>
      <span class="rating-group-half-ratings-value">{value.value} stars</span>
    </div>
  );
});
