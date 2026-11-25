import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { dataAttr, useControllableState, useFieldContext, useFieldControl } from '@leve-ui/utils';
import { clampNumber, formatNumber, parseNumber, stepNumber } from './number-format';
import { type NumberInputIds, numberInputContextId } from './number-input-context';

export type NumberInputRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Only used outside a Field. */
  ids?: Partial<NumberInputIds>;
  /**
   * The initial numeric value (uncontrolled).
   * @default null
   */
  defaultValue?: number | null;
  /** A signal with the numeric value (controlled). */
  'bind:value'?: Signal<number | null>;
  /** Called when the numeric value changes. */
  onValueChange$?: QRL<(value: number | null) => void>;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /**
   * Amount to increment or decrement on ArrowUp / ArrowDown or trigger click.
   * @default 1
   */
  step?: number;
  /**
   * Amount to increment or decrement on PageUp / PageDown.
   * @default step * 10
   */
  largeStep?: number;
  /**
   * BCP 47 locale tag used by `Intl.NumberFormat` for formatting and parsing.
   * @default 'en-US'
   */
  locale?: string;
  /** Formatting options passed to `Intl.NumberFormat`. */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * Whether to clamp out-of-range typed values to `[min, max]` on blur or Enter.
   * @default true
   */
  clampValueOnBlur?: boolean;
  /**
   * Disables the input and trigger buttons. Inside a Field or Fieldset, inherited `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the number input as read-only. Inside a Field, the Field's `readOnly` also applies.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the number input as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the number input as invalid. Inside a Field, the Field's `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Root container for the NumberInput component.
 *
 * Manages numeric value state, locale-aware formatting/parsing, stepping, and
 * Field/Fieldset integration, providing `NumberInputContext` to `Input`,
 * `IncrementTrigger`, and `DecrementTrigger`.
 */
export const NumberInputRoot = component$<NumberInputRootProps>((props) => {
  const {
    ids: propIds,
    defaultValue = null,
    'bind:value': bindValue,
    onValueChange$,
    min: propMin,
    max: propMax,
    step: propStep = 1,
    largeStep: propLargeStep,
    locale: propLocale = 'en-US',
    formatOptions: propFormatOptions,
    clampValueOnBlur: propClampValueOnBlur = true,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    invalid: _invalid,
    ...restProps
  } = props;

  const field = useFieldContext();
  const control = useFieldControl(props);

  const ids: NumberInputIds = {
    input: field ? field.ids.control : (propIds?.input ?? control.value.id),
  };

  const [value, setValue$, resetValue$] = useControllableState<number | null>({
    value: bindValue,
    defaultValue: defaultValue ?? null,
    onChange$: onValueChange$,
  });

  const minSignal = useComputed$(() =>
    props.min !== undefined && Number.isFinite(props.min) ? props.min : undefined,
  );
  const maxSignal = useComputed$(() =>
    props.max !== undefined && Number.isFinite(props.max) ? props.max : undefined,
  );
  const stepSignal = useComputed$(() => props.step ?? 1);
  const largeStepSignal = useComputed$(() => props.largeStep ?? stepSignal.value * 10);
  const localeSignal = useComputed$(() => props.locale ?? 'en-US');
  const formatOptionsSignal = useComputed$(() => props.formatOptions);
  const clampSignal = useComputed$(() => props.clampValueOnBlur ?? true);

  const disabledSignal = useComputed$(() => control.value.disabled);
  const readOnlySignal = useComputed$(() => control.value.readOnly);
  const requiredSignal = useComputed$(() => control.value.required);
  const invalidSignal = useComputed$(() => control.value.invalid);

  const formattedValue = useComputed$(() =>
    formatNumber(value.value, localeSignal.value, formatOptionsSignal.value),
  );

  const inputText = useSignal(formatNumber(value.value, propLocale, propFormatOptions));

  // Keep inputText in sync when value, locale, or formatOptions change externally
  useTask$(({ track }) => {
    const v = track(() => value.value);
    const loc = track(() => localeSignal.value);
    const opts = track(() => formatOptionsSignal.value);
    inputText.value = formatNumber(v, loc, opts);
  });

  const atMin = useComputed$(
    () => value.value !== null && minSignal.value !== undefined && value.value <= minSignal.value,
  );

  const atMax = useComputed$(
    () => value.value !== null && maxSignal.value !== undefined && value.value >= maxSignal.value,
  );

  const commitValue$ = $(async (next: number | null) => {
    await setValue$(next);
    inputText.value = formatNumber(next, localeSignal.value, formatOptionsSignal.value);
  });

  const stepBy$ = $(async (delta: number) => {
    if (disabledSignal.value || readOnlySignal.value) return;
    const parsedFromInput = parseNumber(
      inputText.value,
      localeSignal.value,
      formatOptionsSignal.value,
    );
    const base = parsedFromInput ?? value.value ?? 0;
    const next = clampNumber(stepNumber(base, delta), minSignal.value, maxSignal.value);
    await commitValue$(next);
  });

  const increment$ = $(async (amount?: number) => {
    await stepBy$(amount ?? stepSignal.value);
  });

  const decrement$ = $(async (amount?: number) => {
    await stepBy$(-(amount ?? stepSignal.value));
  });

  const commit$ = $(async () => {
    const trimmed = inputText.value.trim();
    if (!trimmed) {
      await commitValue$(null);
      return;
    }

    const parsed = parseNumber(trimmed, localeSignal.value, formatOptionsSignal.value);
    if (parsed === null) {
      // Revert invalid text to the last committed value
      inputText.value = formatNumber(value.value, localeSignal.value, formatOptionsSignal.value);
      return;
    }

    const next = clampSignal.value ? clampNumber(parsed, minSignal.value, maxSignal.value) : parsed;
    await commitValue$(next);
  });

  const setToMin$ = $(async () => {
    if (disabledSignal.value || readOnlySignal.value) return;
    if (minSignal.value === undefined) return;
    await commitValue$(minSignal.value);
  });

  const setToMax$ = $(async () => {
    if (disabledSignal.value || readOnlySignal.value) return;
    if (maxSignal.value === undefined) return;
    await commitValue$(maxSignal.value);
  });

  const reset$ = $(async () => {
    await resetValue$();
    inputText.value = formatNumber(value.value, localeSignal.value, formatOptionsSignal.value);
  });

  useContextProvider(numberInputContextId, {
    ids,
    hasPropInputId: propIds?.input !== undefined,
    isInField: field !== null,
    value,
    inputText,
    formattedValue,
    min: minSignal,
    max: maxSignal,
    step: stepSignal,
    largeStep: largeStepSignal,
    disabled: disabledSignal,
    readOnly: readOnlySignal,
    required: requiredSignal,
    invalid: invalidSignal,
    atMin,
    atMax,
    increment$,
    decrement$,
    commit$,
    setToMin$,
    setToMax$,
    reset$,
  });

  return (
    <div
      {...restProps}
      data-leve-number-input=""
      data-state={value.value === null ? 'empty' : 'filled'}
      data-disabled={dataAttr(disabledSignal.value)}
      data-readonly={dataAttr(readOnlySignal.value)}
      data-invalid={dataAttr(invalidSignal.value)}
    >
      <Slot />
    </div>
  );
});
