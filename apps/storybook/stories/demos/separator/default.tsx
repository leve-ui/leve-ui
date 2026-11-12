import { component$, useStyles$ } from '@builder.io/qwik';
import { Separator } from '@leve-ui/separator';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="separator-default-card">
      <p class="separator-default-title">leve-ui</p>
      <p class="separator-default-text">Headless UI for Qwik.</p>
      <Separator.Root class="separator-default" />
      <div class="separator-default-links">
        <span>Docs</span>
        <span>GitHub</span>
        <span>npm</span>
      </div>
    </div>
  );
});
