import { component$, useStyles$ } from '@builder.io/qwik';
import { Fieldset } from '@leve-ui/fieldset';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Fieldset.Root disabled class="fieldset-disabled">
      <Fieldset.Legend class="fieldset-disabled-legend">Shipping method</Fieldset.Legend>
      <label class="fieldset-disabled-option">
        <input class="fieldset-disabled-radio" type="radio" name="shipping" value="standard" />{' '}
        Standard
      </label>
      <label class="fieldset-disabled-option">
        <input class="fieldset-disabled-radio" type="radio" name="shipping" value="express" />{' '}
        Express
      </label>
    </Fieldset.Root>
  );
});
