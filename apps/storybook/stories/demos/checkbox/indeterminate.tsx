import { $, component$, useComputed$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import { Checkbox, type CheckboxCheckedState } from '@leve-ui/checkbox';

const styles = `
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .checkbox-group-children {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 24px;
  }

  .checkbox-root {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .checkbox-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-count {
    font-size: 12px;
    color: #6b7280;
  }

  .checkbox-control {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: #ffffff;
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease;
  }

  /* Checked and Indeterminate state */
  .checkbox-control[data-state="checked"],
  .checkbox-control[data-state="indeterminate"] {
    background-color: #2563eb;
    border-color: #2563eb;
  }

  /* Focus indicator */
  .checkbox-control:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .checkbox-indicator {
    display: none;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #ffffff;
  }

  .checkbox-indicator[data-state="checked"],
  .checkbox-indicator[data-state="indeterminate"] {
    display: flex;
  }

  .checkbox-icon-check,
  .checkbox-icon-indeterminate {
    display: none;
    width: 14px;
    height: 14px;
  }

  .checkbox-indicator[data-state="checked"] .checkbox-icon-check {
    display: block;
  }

  .checkbox-indicator[data-state="indeterminate"] .checkbox-icon-indeterminate {
    display: block;
  }
`;

export default component$(() => {
  useStyles$(styles);

  const child1 = useSignal(true);
  const child2 = useSignal(false);
  const child3 = useSignal(false);
  const parent = useSignal<CheckboxCheckedState>('indeterminate');

  // Synchronize parent state based on child values
  useTask$(({ track }) => {
    const c1 = track(() => child1.value);
    const c2 = track(() => child2.value);
    const c3 = track(() => child3.value);
    const all = c1 && c2 && c3;
    const none = !c1 && !c2 && !c3;
    if (all) {
      parent.value = true;
    } else if (none) {
      parent.value = false;
    } else {
      parent.value = 'indeterminate';
    }
  });

  const selectedCount = useComputed$(() => {
    return [child1.value, child2.value, child3.value].filter(Boolean).length;
  });

  const handleParentChange$ = $((next: CheckboxCheckedState) => {
    const target = next === true;
    child1.value = target;
    child2.value = target;
    child3.value = target;
  });

  return (
    <div class="checkbox-group">
      <Checkbox.Root
        bind:checked={parent}
        onCheckedChange$={handleParentChange$}
        class="checkbox-root"
      >
        <Checkbox.Control class="checkbox-control">
          <Checkbox.Indicator class="checkbox-indicator">
            <svg
              aria-hidden="true"
              class="checkbox-icon-check"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg
              aria-hidden="true"
              class="checkbox-icon-indeterminate"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label class="checkbox-label">Select all ingredients</Checkbox.Label>
        <span class="checkbox-count">({selectedCount.value} of 3 selected)</span>
        <Checkbox.HiddenInput />
      </Checkbox.Root>

      <div class="checkbox-group-children">
        <Checkbox.Root bind:checked={child1} class="checkbox-root">
          <Checkbox.Control class="checkbox-control">
            <Checkbox.Indicator class="checkbox-indicator">
              <svg
                aria-hidden="true"
                class="checkbox-icon-check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-label">Lettuce</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>

        <Checkbox.Root bind:checked={child2} class="checkbox-root">
          <Checkbox.Control class="checkbox-control">
            <Checkbox.Indicator class="checkbox-indicator">
              <svg
                aria-hidden="true"
                class="checkbox-icon-check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-label">Tomato</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>

        <Checkbox.Root bind:checked={child3} class="checkbox-root">
          <Checkbox.Control class="checkbox-control">
            <Checkbox.Indicator class="checkbox-indicator">
              <svg
                aria-hidden="true"
                class="checkbox-icon-check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-label">Cheese</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </div>
    </div>
  );
});
