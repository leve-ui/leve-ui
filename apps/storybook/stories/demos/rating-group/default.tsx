import { component$, useStyles$ } from '@builder.io/qwik';
import { RatingGroup } from '@leve-ui/rating-group';
import { LuStar } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <RatingGroup.Root aria-label="Product rating" defaultValue={3} class="rating-group-default">
      {[1, 2, 3, 4, 5].map((index) => (
        <RatingGroup.Item key={index} index={index} class="rating-group-default-item">
          <LuStar aria-hidden="true" class="rating-group-default-icon" />
        </RatingGroup.Item>
      ))}
    </RatingGroup.Root>
  );
});
