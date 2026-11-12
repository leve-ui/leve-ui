import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';
import styles from './horizontal.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <RadioGroup.Root
      orientation="horizontal"
      defaultValue="card"
      class="radio-group-horizontal-root"
    >
      <RadioGroup.Label class="radio-group-horizontal-label">Payment method</RadioGroup.Label>
      <RadioGroup.Item value="card" class="radio-group-horizontal-item">
        <RadioGroup.Indicator class="radio-group-horizontal-indicator" />
        Card
      </RadioGroup.Item>
      <RadioGroup.Item value="paypal" class="radio-group-horizontal-item">
        <RadioGroup.Indicator class="radio-group-horizontal-indicator" />
        PayPal
      </RadioGroup.Item>
      <RadioGroup.Item value="bank" class="radio-group-horizontal-item">
        <RadioGroup.Indicator class="radio-group-horizontal-indicator" />
        Bank transfer
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
});
