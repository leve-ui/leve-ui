import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <RadioGroup.Root disabled defaultValue="opt1" class="radio-group-disabled-root">
      <RadioGroup.Label class="radio-group-disabled-label">Disabled group</RadioGroup.Label>
      <RadioGroup.Item value="opt1" class="radio-group-disabled-item">
        <RadioGroup.Indicator class="radio-group-disabled-indicator" />
        Option 1
      </RadioGroup.Item>
      <RadioGroup.Item value="opt2" class="radio-group-disabled-item">
        <RadioGroup.Indicator class="radio-group-disabled-indicator" />
        Option 2
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
});
