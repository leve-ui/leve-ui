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
    <div class="label-field">
      <Label.Root for="email" class="label">
        Email
      </Label.Root>
      <input id="email" type="email" />
    </div>
  );
});
