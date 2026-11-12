import { component$, useStyles$ } from '@builder.io/qwik';
import { Label } from '@leve-ui/label';
import styles from './wrapping.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Label.Root class="label-wrapping-inline">
      <input type="checkbox" class="label-wrapping-checkbox" />
      Accept terms
    </Label.Root>
  );
});
