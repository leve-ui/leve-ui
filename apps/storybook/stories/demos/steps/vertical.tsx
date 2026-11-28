import { component$, useStyles$ } from '@builder.io/qwik';
import { Steps } from '@leve-ui/steps';
import styles from './vertical.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Steps.Root count={3} orientation="vertical" class="steps-vertical">
      <Steps.List class="steps-vertical-list">
        <Steps.Item index={0} class="steps-vertical-item">
          <Steps.Trigger class="steps-vertical-trigger">
            <Steps.Indicator class="steps-vertical-indicator">1</Steps.Indicator>
            <span>Order Placed</span>
          </Steps.Trigger>
          <Steps.Separator class="steps-vertical-separator" />
        </Steps.Item>
        <Steps.Item index={1} class="steps-vertical-item">
          <Steps.Trigger class="steps-vertical-trigger">
            <Steps.Indicator class="steps-vertical-indicator">2</Steps.Indicator>
            <span>In Transit</span>
          </Steps.Trigger>
          <Steps.Separator class="steps-vertical-separator" />
        </Steps.Item>
        <Steps.Item index={2} class="steps-vertical-item">
          <Steps.Trigger class="steps-vertical-trigger">
            <Steps.Indicator class="steps-vertical-indicator">3</Steps.Indicator>
            <span>Delivered</span>
          </Steps.Trigger>
        </Steps.Item>
      </Steps.List>

      <div class="steps-vertical-panel">
        <Steps.Content index={0} class="steps-vertical-content">
          Your order has been received and is being prepared.
        </Steps.Content>
        <Steps.Content index={1} class="steps-vertical-content">
          Your package is on the way to your destination.
        </Steps.Content>
        <Steps.Content index={2} class="steps-vertical-content">
          Your package has arrived at the delivery address.
        </Steps.Content>

        <div class="steps-vertical-actions">
          <Steps.PrevTrigger class="steps-vertical-nav">Previous</Steps.PrevTrigger>
          <Steps.NextTrigger class="steps-vertical-nav">Next</Steps.NextTrigger>
        </div>
      </div>
    </Steps.Root>
  );
});
