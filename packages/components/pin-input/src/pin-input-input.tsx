import { $, component$, type PropsOf, sync$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { filterPinChars, isValidPinChar, pinInputContextId } from './pin-input-context';

export type PinInputInputProps = PropsOf<'input'> & {
  /** Zero-based index of this digit input within the group. */
  index: number;
  /**
   * Disables this individual input.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks this individual input as read-only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks this individual input as invalid.
   * @default false
   */
  invalid?: boolean;
};

function getGroupInputs(element: HTMLElement): HTMLInputElement[] {
  const root = element.closest('[data-leve-pin-input]');
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLInputElement>('[data-leve-pin-input-input]')).filter(
    (el) => el.closest('[data-leve-pin-input]') === root,
  );
}

function findNextEnabledInput(
  inputs: HTMLInputElement[],
  startIndex: number,
  delta: 1 | -1,
): HTMLInputElement | undefined {
  for (let i = startIndex + delta; i >= 0 && i < inputs.length; i += delta) {
    if (!inputs[i].disabled) return inputs[i];
  }
  return undefined;
}

const syncKeyDown$ = sync$((event: KeyboardEvent, target: HTMLElement) => {
  const el = target as HTMLInputElement;
  const key = event.key;
  if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
    event.preventDefault();
    return;
  }
  if (!el.disabled && !el.readOnly && (key === 'Backspace' || key === 'Delete')) {
    event.preventDefault();
  }
});

const syncPaste$ = sync$((event: ClipboardEvent, target: HTMLElement) => {
  const el = target as HTMLInputElement;
  if (!el.disabled && !el.readOnly) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text');
    if (pasted) {
      (event as ClipboardEvent & { __levePastedText?: string }).__levePastedText = pasted;
    }
  }
});

/**
 * Individual character input within a `PinInput.Root`.
 *
 * Handles single-character entry, invalid character rejection, focus auto-advance,
 * Backspace/Delete clearing, Arrow/Home/End navigation, and multi-character paste.
 */
export const PinInputInput = component$<PinInputInputProps>((props) => {
  const {
    index,
    disabled: propDisabled,
    readOnly: propReadOnly,
    invalid: propInvalid,
    ...restProps
  } = props;
  const context = useContext(pinInputContextId);

  const char = context.values.value[index] ?? '';
  const isDisabled = context.disabled.value || Boolean(propDisabled);
  const isReadOnly = context.readOnly.value || Boolean(propReadOnly);
  const isInvalid = context.invalid.value || Boolean(propInvalid);

  const resolvedId =
    index === 0
      ? context.hasField
        ? context.ids.input
        : (props.id ?? context.ids.input)
      : props.id;
  const total = context.length.value;
  const defaultAriaLabel = total ? `Digit ${index + 1} of ${total}` : `Digit ${index + 1}`;

  const handleFocus$ = $((event: FocusEvent, target: HTMLInputElement) => {
    const el = target || (event.target as HTMLInputElement);
    if (el.value) {
      el.select();
    }
  });

  const handleInput$ = $(async (event: InputEvent, target: HTMLInputElement) => {
    const el = target || (event.target as HTMLInputElement);
    const currentChar = context.values.value[index] ?? '';
    if (isDisabled || isReadOnly) {
      el.value = currentChar;
      return;
    }

    const raw = el.value;
    const inputs = getGroupInputs(el);
    const totalSlots = context.length.value ?? inputs.length;

    if (raw.length === 0) {
      await context.setSlot$(index, '', totalSlots);
      return;
    }

    // Handle multi-character autofill (e.g. OS SMS one-time-code autofill) when slot was empty
    if (currentChar.length === 0 && raw.length > 1) {
      const validChars = filterPinChars(raw, context.type.value).split('');
      if (validChars.length === 0) {
        el.value = '';
        return;
      }
      const startIndex = validChars.length >= totalSlots ? 0 : index;
      const next = [...context.values.value];
      for (let i = 0; i < totalSlots; i++) {
        if (next[i] === undefined) next[i] = '';
      }
      let lastFilled = startIndex;
      for (let i = 0; i < validChars.length && startIndex + i < totalSlots; i++) {
        next[startIndex + i] = validChars[i];
        lastFilled = startIndex + i;
        if (inputs[startIndex + i]) {
          inputs[startIndex + i].value = validChars[i];
        }
      }
      await context.setValues$(next, totalSlots);
      const nextEmptyIdx = next.findIndex((v, i) => i > lastFilled && !v);
      const focusIdx = nextEmptyIdx !== -1 ? nextEmptyIdx : lastFilled;
      inputs[focusIdx]?.focus();
      return;
    }

    // Extract newly typed single character when typing into an empty or already-filled input
    let candidate = raw;
    if (raw.length > 1) {
      if (currentChar && raw.startsWith(currentChar)) {
        candidate = raw.slice(currentChar.length);
      } else if (currentChar && raw.endsWith(currentChar)) {
        candidate = raw.slice(0, raw.length - currentChar.length);
      } else {
        candidate = raw.slice(-1);
      }
    }

    if (!isValidPinChar(candidate, context.type.value)) {
      el.value = currentChar;
      return;
    }

    el.value = candidate;
    await context.setSlot$(index, candidate, totalSlots);

    const nextInput = findNextEnabledInput(inputs, index, 1);
    nextInput?.focus();
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, target: HTMLInputElement) => {
    const el = target || (event.target as HTMLInputElement);
    const inputs = getGroupInputs(el);
    const totalSlots = context.length.value ?? inputs.length;
    const key = event.key;

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const isRtl =
        typeof getComputedStyle === 'function' && getComputedStyle(el).direction === 'rtl';
      const delta: 1 | -1 = key === 'ArrowLeft' ? (isRtl ? 1 : -1) : isRtl ? -1 : 1;
      findNextEnabledInput(inputs, index, delta)?.focus();
      return;
    }

    if (key === 'Home') {
      inputs.find((item) => !item.disabled)?.focus();
      return;
    }

    if (key === 'End') {
      for (let i = inputs.length - 1; i >= 0; i--) {
        if (!inputs[i].disabled) {
          inputs[i].focus();
          break;
        }
      }
      return;
    }

    if (isDisabled || isReadOnly) return;

    if (key === 'Backspace') {
      const currentChar = context.values.value[index] ?? '';
      if (currentChar !== '') {
        el.value = '';
        await context.setSlot$(index, '', totalSlots);
      } else if (index > 0) {
        const prevInput = findNextEnabledInput(inputs, index, -1);
        const prevIndex = prevInput ? inputs.indexOf(prevInput) : -1;
        if (prevInput && prevIndex !== -1) {
          prevInput.value = '';
          await context.setSlot$(prevIndex, '', totalSlots);
          prevInput.focus();
        }
      }
      return;
    }

    if (key === 'Delete') {
      el.value = '';
      await context.setSlot$(index, '', totalSlots);
    }
  });

  const handlePaste$ = $(async (event: ClipboardEvent, target: HTMLInputElement) => {
    const el = target || (event.target as HTMLInputElement);
    if (isDisabled || isReadOnly) return;

    const syncedText = (event as ClipboardEvent & { __levePastedText?: string }).__levePastedText;
    const pasted = syncedText ?? event.clipboardData?.getData('text') ?? '';
    const filtered = filterPinChars(pasted, context.type.value);
    if (!filtered) return;

    const inputs = getGroupInputs(el);
    const totalSlots = context.length.value ?? inputs.length;
    if (totalSlots <= 0) return;

    const chars = filtered.split('');
    const startIndex = chars.length >= totalSlots ? 0 : index;

    const next = [...context.values.value];
    for (let i = 0; i < totalSlots; i++) {
      if (next[i] === undefined) next[i] = '';
    }

    let lastFilled = startIndex;
    for (let i = 0; i < chars.length && startIndex + i < totalSlots; i++) {
      next[startIndex + i] = chars[i];
      lastFilled = startIndex + i;
      if (inputs[startIndex + i]) {
        inputs[startIndex + i].value = chars[i];
      }
    }

    await context.setValues$(next, totalSlots);

    const nextEmptyIdx = next.findIndex((v, i) => i > lastFilled && !v);
    const focusIdx = nextEmptyIdx !== -1 ? nextEmptyIdx : lastFilled;
    inputs[focusIdx]?.focus();
  });

  return (
    <input
      {...restProps}
      id={resolvedId}
      type={context.mask.value ? 'password' : 'text'}
      inputMode={context.type.value === 'numeric' ? 'numeric' : 'text'}
      autoComplete={context.otp.value && index === 0 ? 'one-time-code' : 'off'}
      value={char}
      placeholder={props.placeholder ?? context.placeholder.value}
      disabled={isDisabled}
      readOnly={isReadOnly}
      aria-label={props['aria-label'] ?? defaultAriaLabel}
      aria-invalid={isInvalid ? 'true' : undefined}
      onFocus$={[handleFocus$, props.onFocus$]}
      onInput$={[handleInput$, props.onInput$]}
      onKeyDown$={[syncKeyDown$, handleKeyDown$, props.onKeyDown$]}
      onPaste$={[syncPaste$, handlePaste$, props.onPaste$]}
      data-leve-pin-input-input=""
      data-state={char ? 'filled' : 'empty'}
      data-disabled={dataAttr(isDisabled)}
      data-readonly={dataAttr(isReadOnly)}
      data-invalid={dataAttr(isInvalid)}
    />
  );
});
