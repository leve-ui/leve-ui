import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <RadioGroup.Root class="radio-group-default-root">
      <RadioGroup.Label class="radio-group-default-label">Plan</RadioGroup.Label>
      <RadioGroup.Item value="free" class="radio-group-default-item">
        <RadioGroup.Indicator class="radio-group-default-indicator" />
        Free
      </RadioGroup.Item>
      <RadioGroup.Item value="starter" class="radio-group-default-item">
        <RadioGroup.Indicator class="radio-group-default-indicator" />
        Starter
      </RadioGroup.Item>
      <RadioGroup.Item value="pro" class="radio-group-default-item">
        <RadioGroup.Indicator class="radio-group-default-indicator" />
        Pro
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
});
