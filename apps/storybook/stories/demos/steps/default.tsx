import { component$, useStyles$ } from '@builder.io/qwik';
import { Steps } from '@leve-ui/steps';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Steps.Root count={3} class="steps-default">
      <Steps.List class="steps-default-list">
        <Steps.Item index={0} class="steps-default-item">
          <Steps.Trigger class="steps-default-trigger">
            <Steps.Indicator class="steps-default-indicator">1</Steps.Indicator>
            <span>Account</span>
          </Steps.Trigger>
          <Steps.Separator class="steps-default-separator" />
        </Steps.Item>
        <Steps.Item index={1} class="steps-default-item">
          <Steps.Trigger class="steps-default-trigger">
            <Steps.Indicator class="steps-default-indicator">2</Steps.Indicator>
            <span>Profile</span>
          </Steps.Trigger>
          <Steps.Separator class="steps-default-separator" />
        </Steps.Item>
        <Steps.Item index={2} class="steps-default-item">
          <Steps.Trigger class="steps-default-trigger">
            <Steps.Indicator class="steps-default-indicator">3</Steps.Indicator>
            <span>Review</span>
          </Steps.Trigger>
        </Steps.Item>
      </Steps.List>

      <Steps.Content index={0} class="steps-default-content">
        Enter your email and password to create an account.
      </Steps.Content>
      <Steps.Content index={1} class="steps-default-content">
        Add your display name and profile details.
      </Steps.Content>
      <Steps.Content index={2} class="steps-default-content">
        Confirm your information before submitting.
      </Steps.Content>

      <div class="steps-default-actions">
        <Steps.PrevTrigger class="steps-default-nav">Previous</Steps.PrevTrigger>
        <Steps.NextTrigger class="steps-default-nav">Next</Steps.NextTrigger>
      </div>
    </Steps.Root>
  );
});
