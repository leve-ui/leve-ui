import { component$, useStyles$ } from '@builder.io/qwik';
import { Fieldset } from '@leve-ui/fieldset';

const styles = `
  .fieldset {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 12px;
  }

  .fieldset[data-disabled] {
    opacity: 0.5;
  }

  .fieldset-legend {
    font-weight: 600;
    padding: 0 4px;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Fieldset.Root class="fieldset">
      <Fieldset.Legend class="fieldset-legend">Shipping method</Fieldset.Legend>
      <label>
        <input type="radio" name="shipping" value="standard" /> Standard
      </label>
      <label>
        <input type="radio" name="shipping" value="express" /> Express
      </label>
    </Fieldset.Root>
  );
});
