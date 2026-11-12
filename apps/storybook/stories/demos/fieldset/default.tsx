import { component$, useStyles$ } from '@builder.io/qwik';
import { Fieldset } from '@leve-ui/fieldset';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Fieldset.Root class="fieldset-default">
      <Fieldset.Legend class="fieldset-default-legend">Shipping method</Fieldset.Legend>
      <label class="fieldset-default-option">
        <input class="fieldset-default-radio" type="radio" name="shipping" value="standard" />{' '}
        Standard
      </label>
      <label class="fieldset-default-option">
        <input class="fieldset-default-radio" type="radio" name="shipping" value="express" />{' '}
        Express
      </label>
    </Fieldset.Root>
  );
});
