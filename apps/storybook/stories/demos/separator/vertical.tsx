import { component$, useStyles$ } from '@builder.io/qwik';
import { Separator } from '@leve-ui/separator';

const styles = `
  .separator {
    background: #d1d5db;
  }

  .separator[data-orientation='horizontal'] {
    height: 1px;
    margin: 8px 0;
  }

  .separator[data-orientation='vertical'] {
    width: 1px;
    align-self: stretch;
  }

  .separator-row {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 24px;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="separator-row">
      <span>Left</span>
      <Separator.Root orientation="vertical" class="separator" />
      <span>Right</span>
    </div>
  );
});
