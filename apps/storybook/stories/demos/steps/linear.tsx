import { component$, useStyles$ } from '@builder.io/qwik';
import { Steps } from '@leve-ui/steps';
import styles from './linear.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Steps.Root count={3} linear class="steps-linear">
      <Steps.List class="steps-linear-list">
        <Steps.Item index={0} class="steps-linear-item">
          <Steps.Trigger class="steps-linear-trigger">
            <Steps.Indicator class="steps-linear-indicator">1</Steps.Indicator>
            <span>Shipping</span>
          </Steps.Trigger>
          <Steps.Separator class="steps-linear-separator" />
        </Steps.Item>
        <Steps.Item index={1} class="steps-linear-item">
          <Steps.Trigger class="steps-linear-trigger">
            <Steps.Indicator class="steps-linear-indicator">2</Steps.Indicator>
            <span>Payment</span>
          </Steps.Trigger>
          <Steps.Separator class="steps-linear-separator" />
        </Steps.Item>
        <Steps.Item index={2} class="steps-linear-item">
          <Steps.Trigger class="steps-linear-trigger">
            <Steps.Indicator class="steps-linear-indicator">3</Steps.Indicator>
            <span>Confirmation</span>
          </Steps.Trigger>
        </Steps.Item>
      </Steps.List>

      <Steps.Content index={0} class="steps-linear-content">
        Choose your shipping address and delivery speed.
      </Steps.Content>
      <Steps.Content index={1} class="steps-linear-content">
        Enter your payment method and billing details.
      </Steps.Content>
      <Steps.Content index={2} class="steps-linear-content">
        Review your order details and place your order.
      </Steps.Content>

      <div class="steps-linear-actions">
        <Steps.PrevTrigger class="steps-linear-nav">Previous</Steps.PrevTrigger>
        <Steps.NextTrigger class="steps-linear-nav">Next</Steps.NextTrigger>
      </div>
    </Steps.Root>
  );
});
