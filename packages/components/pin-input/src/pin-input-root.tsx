import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
} from '@builder.io/qwik';
import { dataAttr, useControllableState, useFieldContext, useFieldControl } from '@leve-ui/utils';
import { type PinInputIds, type PinInputType, pinInputContextId } from './pin-input-context';

export type PinInputRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Inside a Field, the first input ID comes from the Field. */
  ids?: Partial<PinInputIds>;
  /** Total number of digit inputs, used for accessible labels (e.g. "Digit 1 of 6") and completion detection. */
  length?: number;
  /**
   * The initial PIN value array (uncontrolled).
   * @default []
   */
  defaultValue?: string[];
  /** A signal with the PIN value array (controlled). */
  'bind:value'?: Signal<string[]>;
  /** Called when the PIN value array changes. */
  onValueChange$?: QRL<(value: string[]) => void>;
  /** Called with the joined PIN string when all slots become filled. */
  onComplete$?: QRL<(value: string) => void>;
  /**
   * The type of characters allowed in the PIN inputs.
   * @default 'numeric'
   */
  type?: PinInputType;
  /**
   * Whether to mask the input characters (renders `type="password"`).
   * @default false
   */
  mask?: boolean;
  /**
   * Whether to set `autocomplete="one-time-code"` on the first input.
   * @default true
   */
  otp?: boolean;
  /**
   * The placeholder character shown in empty inputs.
   * @default '○'
   */
  placeholder?: string;
  /**
   * Disables all PIN inputs. Inside a Field or Fieldset, the inherited `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks all PIN inputs as read-only. Inside a Field, the Field's `readOnly` also applies.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the PIN input as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the PIN input as invalid. Inside a Field, the Field's `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Root container for the PinInput component.
 *
 * Renders `<div role="group">`, manages the character array state (controlled or uncontrolled),
 * integrates with `Field` via `useFieldControl`, and coordinates focus, paste, and completion.
 */
export const PinInputRoot = component$<PinInputRootProps>((props) => {
  const {
    ids: propIds,
    length: _length,
    defaultValue = [],
    'bind:value': bindValue,
    onValueChange$,
    onComplete$,
    type: _type,
    mask: _mask,
    otp: _otp,
    placeholder: _placeholder,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    invalid: _invalid,
    ...restProps
  } = props;

  const internalRef = useSignal<HTMLElement>();
  const rootRef = (props.ref as Signal<HTMLElement | undefined> | undefined) ?? internalRef;

  const [values, setControllableValues$, reset$] = useControllableState<string[]>({
    value: bindValue,
    defaultValue: defaultValue ?? [],
    onChange$: onValueChange$,
  });

  const field = useFieldContext();
  const control = useFieldControl(props);
  const base = useId();
  const ids: PinInputIds = {
    root: props.id ?? propIds?.root ?? `${base}-root`,
    input: field ? field.ids.control : (propIds?.input ?? `${base}-input`),
  };

  const detectedLength = useSignal<number | undefined>(undefined);
  const lengthSignal = useComputed$(() => props.length);
  const typeSignal = useComputed$<PinInputType>(() => props.type ?? 'numeric');
  const maskSignal = useComputed$(() => Boolean(props.mask));
  const otpSignal = useComputed$(() => props.otp ?? true);
  const placeholderSignal = useComputed$(() => props.placeholder ?? '○');

  const disabledSignal = useComputed$(() => control.value.disabled);
  const readOnlySignal = useComputed$(() => control.value.readOnly);
  const requiredSignal = useComputed$(() => control.value.required);
  const invalidSignal = useComputed$(() => control.value.invalid);

  const isCompleteSignal = useComputed$(() => {
    const expected = props.length ?? detectedLength.value;
    if (expected !== undefined) {
      return (
        expected > 0 &&
        values.value.length >= expected &&
        values.value.slice(0, expected).every((v) => v.length > 0)
      );
    }
    return values.value.length > 0 && values.value.every((v) => v.length > 0);
  });

  const setValues$ = $(async (next: string[], totalSlots?: number) => {
    if (totalSlots !== undefined && totalSlots > 0) {
      detectedLength.value = totalSlots;
    }
    const normalized = [...next];
    const targetLen = props.length ?? totalSlots ?? normalized.length;
    for (let i = 0; i < targetLen; i++) {
      if (normalized[i] === undefined) {
        normalized[i] = '';
      }
    }

    const current = values.value;
    const isSame =
      current.length === normalized.length &&
      current.every((item, idx) => item === normalized[idx]);
    if (isSame) return;

    await setControllableValues$(normalized);

    if (
      targetLen > 0 &&
      normalized.length >= targetLen &&
      normalized.slice(0, targetLen).every((v) => v.length > 0)
    ) {
      await onComplete$?.(normalized.slice(0, targetLen).join(''));
    }
  });

  const setSlot$ = $(async (index: number, char: string, totalSlots?: number) => {
    const next = [...values.value];
    next[index] = char;
    await setValues$(next, totalSlots);
  });

  useContextProvider(pinInputContextId, {
    ids,
    rootRef,
    values,
    length: lengthSignal,
    type: typeSignal,
    mask: maskSignal,
    otp: otpSignal,
    placeholder: placeholderSignal,
    disabled: disabledSignal,
    readOnly: readOnlySignal,
    required: requiredSignal,
    invalid: invalidSignal,
    isComplete: isCompleteSignal,
    hasField: field !== null,
    setValues$,
    setSlot$,
    reset$,
  });

  const ariaLabelledby =
    props['aria-labelledby'] ?? (props['aria-label'] ? undefined : control.value.labelId);

  return (
    // biome-ignore lint/a11y/useSemanticElements: PinInput.Root uses <div role="group"> per specification rather than <fieldset>
    <div
      {...restProps}
      ref={rootRef}
      id={ids.root}
      role="group"
      aria-labelledby={ariaLabelledby}
      aria-describedby={control.value.describedBy}
      data-leve-pin-input=""
      data-state={isCompleteSignal.value ? 'complete' : 'incomplete'}
      data-disabled={dataAttr(disabledSignal.value)}
      data-readonly={dataAttr(readOnlySignal.value)}
      data-invalid={dataAttr(invalidSignal.value)}
    >
      <Slot />
    </div>
  );
});
