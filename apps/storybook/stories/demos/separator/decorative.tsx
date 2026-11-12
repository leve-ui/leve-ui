import { component$, useStyles$ } from '@builder.io/qwik';
import { Separator } from '@leve-ui/separator';
import styles from './decorative.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="separator-decorative-card">
      <p class="separator-decorative-title">leve-ui</p>
      <p class="separator-decorative-text">Headless UI for Qwik.</p>
      {/* Purely visual: hidden from assistive technology */}
      <Separator.Root decorative class="separator-decorative" />
      <div class="separator-decorative-links">
        <span>Docs</span>
        <span>GitHub</span>
        <span>npm</span>
      </div>
    </div>
  );
});
