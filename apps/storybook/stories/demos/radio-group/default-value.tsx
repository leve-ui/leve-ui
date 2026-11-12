import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';
import styles from './default-value.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <RadioGroup.Root defaultValue="starter" class="radio-group-default-value-root">
      <RadioGroup.Label class="radio-group-default-value-label">Plan</RadioGroup.Label>
      <RadioGroup.Item value="free" class="radio-group-default-value-item">
        <RadioGroup.Indicator class="radio-group-default-value-indicator" />
        Free
      </RadioGroup.Item>
      <RadioGroup.Item value="starter" class="radio-group-default-value-item">
        <RadioGroup.Indicator class="radio-group-default-value-indicator" />
        Starter
      </RadioGroup.Item>
      <RadioGroup.Item value="pro" class="radio-group-default-value-item">
        <RadioGroup.Indicator class="radio-group-default-value-indicator" />
        Pro
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
});
