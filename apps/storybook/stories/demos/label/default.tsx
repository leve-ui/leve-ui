import { component$, useStyles$ } from '@builder.io/qwik';
import { Label } from '@leve-ui/label';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="label-default-field">
      <Label.Root for="email" class="label-default">
        Email
      </Label.Root>
      <input id="email" type="email" placeholder="you@example.com" class="label-default-input" />
    </div>
  );
});
