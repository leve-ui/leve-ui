import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@leve-ui/checkbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './group.css?inline';

export default component$(() => {
  useStyles$(styles);
  const selected = useSignal<string[]>(['qwik']);

  return (
    <div class="checkbox-group-wrapper">
      <Checkbox.Group
        aria-label="Frameworks (up to 2)"
        name="frameworks"
        defaultValue={['qwik']}
        maxSelectedValues={2}
        onValueChange$={(values) => {
          selected.value = values;
        }}
        class="checkbox-group-list"
      >
        <Checkbox.Root value="qwik" class="checkbox-group-item">
          <Checkbox.Control class="checkbox-group-control">
            <Checkbox.Indicator class="checkbox-group-indicator">
              <LuCheck class="checkbox-group-icon" aria-hidden="true" />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-group-label">Qwik</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>

        <Checkbox.Root value="react" class="checkbox-group-item">
          <Checkbox.Control class="checkbox-group-control">
            <Checkbox.Indicator class="checkbox-group-indicator">
              <LuCheck class="checkbox-group-icon" aria-hidden="true" />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-group-label">React</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>

        <Checkbox.Root value="svelte" class="checkbox-group-item">
          <Checkbox.Control class="checkbox-group-control">
            <Checkbox.Indicator class="checkbox-group-indicator">
              <LuCheck class="checkbox-group-icon" aria-hidden="true" />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox-group-label">Svelte</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </Checkbox.Group>
      <p class="checkbox-group-status">Selected: {selected.value.join(', ') || 'none'}</p>
    </div>
  );
});
