import { component$, useStyles$ } from '@builder.io/qwik';
import { RatingGroup } from '@leve-ui/rating-group';
import { LuStar } from '@qwikest/icons/lucide';
import styles from './read-only.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <RatingGroup.Root
      aria-label="Average customer rating"
      defaultValue={4}
      readOnly
      class="rating-group-read-only"
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <RatingGroup.Item key={index} index={index} class="rating-group-read-only-item">
          <LuStar aria-hidden="true" class="rating-group-read-only-icon" />
        </RatingGroup.Item>
      ))}
    </RatingGroup.Root>
  );
});
