import { component$, useStyles$ } from '@builder.io/qwik';
import { RatingGroup } from '@leve-ui/rating-group';
import { LuStar } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <RatingGroup.Root
      aria-label="Disabled rating"
      defaultValue={3}
      disabled
      class="rating-group-disabled"
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <RatingGroup.Item key={index} index={index} class="rating-group-disabled-item">
          <LuStar aria-hidden="true" class="rating-group-disabled-icon" />
        </RatingGroup.Item>
      ))}
    </RatingGroup.Root>
  );
});
