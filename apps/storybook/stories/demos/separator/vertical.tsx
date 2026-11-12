import { component$, useStyles$ } from '@builder.io/qwik';
import { Separator } from '@leve-ui/separator';
import styles from './vertical.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="separator-vertical-row">
      <span>Docs</span>
      <Separator.Root orientation="vertical" class="separator-vertical" />
      <span>GitHub</span>
    </div>
  );
});
