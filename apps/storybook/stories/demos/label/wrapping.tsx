import { component$, useStyles$ } from '@builder.io/qwik';
import { Label } from '@leve-ui/label';

const styles = `
  .label-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 240px;
  }

  .label {
    font-weight: 500;
  }

  .label-inline {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Label.Root class="label-inline">
      <input type="checkbox" />
      Accept terms
    </Label.Root>
  );
});
