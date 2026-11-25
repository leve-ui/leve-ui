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
} from '@builder.io/qwik';
import {
  dataAttr,
  useControllableState,
  useFieldContext,
  useInheritedDisabled,
} from '@leve-ui/utils';
import { type PasswordInputIds, passwordInputContextId } from './password-input-context';

export type PasswordInputRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Only used outside a Field. */
  ids?: Partial<PasswordInputIds>;
  /**
   * The initial visibility state of the password (uncontrolled).
   * @default false
   */
  defaultVisible?: boolean;
  /** A signal with the visibility state (controlled). */
  'bind:visible'?: Signal<boolean>;
  /** Called when the visibility state changes. */
  onVisibleChange$?: QRL<(visible: boolean) => void>;
  /**
   * Disables the password input and its visibility trigger. Inside a Field, the Field's `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the password input as read-only. Inside a Field, the Field's `readOnly` also applies.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the password input as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the password input as invalid. Inside a Field, the Field's `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Root container for the PasswordInput component.
 *
 * Manages password visibility state (`visible`), wires Field context when inside
 * `Field.Root`, and provides `PasswordInputContext` to `Input`, `VisibilityTrigger`,
 * and `Indicator`. Uses a native `<input>` and `<button type="button">` without custom
 * ARIA roles.
 */
export const PasswordInputRoot = component$<PasswordInputRootProps>(
  ({
    ids: propIds,
    defaultVisible = false,
    'bind:visible': bindVisible,
    onVisibleChange$,
    disabled: rootDisabled,
    readOnly: rootReadOnly,
    required: rootRequired,
    invalid: rootInvalid,
    ...restProps
  }) => {
    const [visible, setVisible$] = useControllableState({
      value: bindVisible,
      defaultValue: defaultVisible ?? false,
      onChange$: onVisibleChange$,
    });

    const field = useFieldContext();
    const base = useId();
    const ids: PasswordInputIds = field
      ? { input: field.ids.control }
      : { input: propIds?.input ?? `${base}-input` };

    const inheritedDisabled = useInheritedDisabled();
    const disabledSignal = useComputed$(() => !!rootDisabled || inheritedDisabled.value);
    const readOnlySignal = useComputed$(() => !!rootReadOnly || !!field?.readOnly.value);
    const requiredSignal = useComputed$(() => !!rootRequired || !!field?.required.value);
    const invalidSignal = useComputed$(() => !!rootInvalid || !!field?.invalid.value);

    const toggle$ = $(() => {
      if (disabledSignal.value) return;
      setVisible$(!visible.value);
    });

    useContextProvider(passwordInputContextId, {
      ids,
      visible,
      disabled: disabledSignal,
      readOnly: readOnlySignal,
      required: requiredSignal,
      invalid: invalidSignal,
      toggle$,
    });

    return (
      <div
        {...restProps}
        data-leve-password-input=""
        data-state={visible.value ? 'visible' : 'hidden'}
        data-disabled={dataAttr(disabledSignal.value)}
        data-readonly={dataAttr(readOnlySignal.value)}
        data-invalid={dataAttr(invalidSignal.value)}
      >
        <Slot />
      </div>
    );
  },
);
