import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { Select } from '@leve-ui/select';
import { LuCheck, LuChevronDown } from '@qwikest/icons/lucide';
import styles from './field.css?inline';

const COUNTRIES = [
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
];

export default component$(() => {
  useStyles$(styles);
  const country = useSignal<string | null>(null);
  const submitted = useSignal(false);
  const result = useSignal<string | null>(null);
  const isInvalid = submitted.value && country.value === null;

  return (
    <form
      class="select-field-form"
      noValidate
      preventdefault:submit
      onSubmit$={(_event, form) => {
        submitted.value = true;
        if (country.value === null) return;
        const data = new FormData(form);
        result.value = String(data.get('country') ?? '');
      }}
      onReset$={() => {
        submitted.value = false;
        result.value = null;
      }}
    >
      <Field.Root hasDescription invalid={isInvalid} required class="select-field">
        <Field.Label class="select-field-label">Country</Field.Label>
        {/* position: relative keeps HiddenInput anchored inside Root */}
        <Select.Root bind:value={country} class="select-field-root">
          <Select.Trigger class="select-field-trigger">
            <Select.Value placeholder="Choose a country" class="select-field-value" />
            <LuChevronDown aria-hidden="true" class="select-field-icon" />
          </Select.Trigger>
          <Select.HiddenInput name="country" />
          <Select.Content sideOffset={4} class="select-field-content">
            <Select.List>
              {COUNTRIES.map((item) => (
                <Select.Item key={item.value} value={item.value} class="select-field-item">
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator class="select-field-indicator">
                    <LuCheck aria-hidden="true" class="select-field-icon" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Content>
        </Select.Root>
        <Field.Description class="select-field-description">
          Used for shipping and tax calculation.
        </Field.Description>
        {isInvalid && (
          <Field.ErrorMessage class="select-field-error">
            Please select a country.
          </Field.ErrorMessage>
        )}
      </Field.Root>
      <div class="select-field-actions">
        <button type="submit" class="select-field-button">
          Submit
        </button>
        <button
          type="reset"
          class="select-field-button"
          onClick$={() => {
            country.value = null;
          }}
        >
          Reset
        </button>
      </div>
      {result.value !== null && <p class="select-field-status">Submitted: {result.value}</p>}
    </form>
  );
});
