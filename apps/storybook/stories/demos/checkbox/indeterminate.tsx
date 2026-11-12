import { $, component$, useComputed$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import { Checkbox, type CheckboxCheckedState } from '@leve-ui/checkbox';
import { LuCheck, LuMinus } from '@qwikest/icons/lucide';
import styles from './indeterminate.css?inline';

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
    <div class="checkbox-indeterminate-group">
      <Checkbox.Root
        bind:checked={parent}
        onCheckedChange$={handleParentChange$}
        class="checkbox-indeterminate-root"
      >
        <Checkbox.Control class="checkbox-indeterminate-control">
          <Checkbox.Indicator class="checkbox-indeterminate-indicator">
            <LuCheck class="checkbox-indeterminate-icon-check" aria-hidden="true" />
            <LuMinus class="checkbox-indeterminate-icon-indeterminate" aria-hidden="true" />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label class="checkbox-indeterminate-label">Select all ingredients</Checkbox.Label>
        <span class="checkbox-indeterminate-count">({selectedCount.value} of 3 selected)</span>
        <Checkbox.HiddenInput />
      </Checkbox.Root>

      <div class="checkbox-indeterminate-group-children">
        <Checkbox.Root bind:checked={child1} class="checkbox-indeterminate-root">
          <Checkbox.Control class="checkbox-indeterminate-control">
            <Checkbox.Indicator class="checkbox-indeterminate-indicator">
              <LuCheck class="checkbox-indeterminate-icon-check" aria-hidden="true" />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-indeterminate-label">Lettuce</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>

        <Checkbox.Root bind:checked={child2} class="checkbox-indeterminate-root">
          <Checkbox.Control class="checkbox-indeterminate-control">
            <Checkbox.Indicator class="checkbox-indeterminate-indicator">
              <LuCheck class="checkbox-indeterminate-icon-check" aria-hidden="true" />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-indeterminate-label">Tomato</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>

        <Checkbox.Root bind:checked={child3} class="checkbox-indeterminate-root">
          <Checkbox.Control class="checkbox-indeterminate-control">
            <Checkbox.Indicator class="checkbox-indeterminate-indicator">
              <LuCheck class="checkbox-indeterminate-icon-check" aria-hidden="true" />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-indeterminate-label">Cheese</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </div>
    </div>
  );
});
