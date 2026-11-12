import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';
import styles from './disabled-item.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <RadioGroup.Root class="radio-group-disabled-item-root">
      <RadioGroup.Label class="radio-group-disabled-item-label">Shipping method</RadioGroup.Label>
      <RadioGroup.Item value="standard" class="radio-group-disabled-item-item">
        <RadioGroup.Indicator class="radio-group-disabled-item-indicator" />
        Standard (3-5 days)
      </RadioGroup.Item>
      <RadioGroup.Item value="express" disabled class="radio-group-disabled-item-item">
        <RadioGroup.Indicator class="radio-group-disabled-item-indicator" />
        Express (Unavailable)
      </RadioGroup.Item>
      <RadioGroup.Item value="overnight" class="radio-group-disabled-item-item">
        <RadioGroup.Indicator class="radio-group-disabled-item-indicator" />
        Overnight
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
});
