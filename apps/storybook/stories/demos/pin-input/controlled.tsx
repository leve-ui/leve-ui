import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { PinInput } from '@leve-ui/pin-input';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal<string[]>(['', '', '', '']);
  const completed = useSignal('');

  return (
    <div class="pin-input-controlled-wrapper">
      <PinInput.Root
        length={4}
        bind:value={value}
        onComplete$={(pin) => {
          completed.value = pin;
        }}
        aria-label="One-time code"
        class="pin-input-controlled"
      >
        <PinInput.Input index={0} class="pin-input-controlled-input" />
        <PinInput.Input index={1} class="pin-input-controlled-input" />
        <PinInput.Input index={2} class="pin-input-controlled-input" />
        <PinInput.Input index={3} class="pin-input-controlled-input" />
      </PinInput.Root>
      <div class="pin-input-controlled-meta">
        <span>Value: {value.value.join('') || 'empty'}</span>
        {completed.value && <span>Completed: {completed.value}</span>}
        <button
          type="button"
          class="pin-input-controlled-clear"
          onClick$={() => {
            value.value = ['', '', '', ''];
            completed.value = '';
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
});
