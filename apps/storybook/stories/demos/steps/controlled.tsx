import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Steps } from '@leve-ui/steps';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

const items = [
  { label: 'Plan', description: 'Select a monthly or annual subscription plan.' },
  { label: 'Add-ons', description: 'Customize extra storage and priority support.' },
  { label: 'Summary', description: 'Confirm your plan and complete checkout.' },
];

export default component$(() => {
  useStyles$(styles);
  const step = useSignal(1);

  return (
    <div class="steps-controlled-wrapper">
      <div class="steps-controlled-toolbar">
        <p class="steps-controlled-status">
          Step {step.value + 1} of {items.length}
        </p>
        <button
          type="button"
          class="steps-controlled-reset"
          onClick$={() => {
            step.value = 0;
          }}
        >
          Reset
        </button>
      </div>

      <Steps.Root count={items.length} bind:step={step} class="steps-controlled">
        <Steps.List class="steps-controlled-list">
          {items.map((item, index) => (
            <Steps.Item key={item.label} index={index} class="steps-controlled-item">
              <Steps.Trigger class="steps-controlled-trigger">
                <Steps.Indicator class="steps-controlled-indicator">
                  {step.value > index ? (
                    <LuCheck class="steps-controlled-check" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </Steps.Indicator>
                <span>{item.label}</span>
              </Steps.Trigger>
              {index < items.length - 1 && <Steps.Separator class="steps-controlled-separator" />}
            </Steps.Item>
          ))}
        </Steps.List>

        {items.map((item, index) => (
          <Steps.Content key={item.label} index={index} class="steps-controlled-content">
            {item.description}
          </Steps.Content>
        ))}

        <div class="steps-controlled-actions">
          <Steps.PrevTrigger class="steps-controlled-nav">Previous</Steps.PrevTrigger>
          <Steps.NextTrigger class="steps-controlled-nav">Next</Steps.NextTrigger>
        </div>
      </Steps.Root>
    </div>
  );
});
