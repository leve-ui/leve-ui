import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { RatingGroup } from '@leve-ui/rating-group';
import { LuStar } from '@qwikest/icons/lucide';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription required class="rating-group-with-field-field">
      <Field.Label class="rating-group-with-field-label">Overall experience</Field.Label>
      <RatingGroup.Root defaultValue={4} class="rating-group-with-field">
        {[1, 2, 3, 4, 5].map((index) => (
          <RatingGroup.Item key={index} index={index} class="rating-group-with-field-item">
            <LuStar aria-hidden="true" class="rating-group-with-field-icon" />
          </RatingGroup.Item>
        ))}
      </RatingGroup.Root>
      <Field.Description class="rating-group-with-field-description">
        Rate your satisfaction from 1 to 5 stars.
      </Field.Description>
    </Field.Root>
  );
});
