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
} from '@builder.io/qwik';
import { dataAttr, useControllableState, useFieldContext, useFieldControl } from '@leve-ui/utils';
import { type RatingGroupIds, ratingGroupContextId } from './rating-group-context';

export type RatingGroupRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Inside a Field, the Field's IDs are used instead. */
  ids?: Partial<RatingGroupIds>;
  /**
   * The total number of rating items.
   * @default 5
   */
  count?: number;
  /**
   * The initial rating value (uncontrolled).
   * @default 0
   */
  defaultValue?: number;
  /** A signal with the current rating value (controlled). */
  'bind:value'?: Signal<number>;
  /** Called when the committed rating value changes. */
  onValueChange$?: QRL<(value: number) => void>;
  /** Called when the hovered rating preview value changes, or `null` when pointer leaves. */
  onHoverChange$?: QRL<(value: number | null) => void>;
  /**
   * Allows selecting half-star increments (e.g. `2.5`).
   * @default false
   */
  allowHalf?: boolean;
  /**
   * Allows clearing the rating back to `0` by clicking the currently selected value.
   * @default false
   */
  allowClear?: boolean;
  /**
   * Disables all rating items and prevents interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Makes the rating group read-only while keeping items focusable.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the rating group as required for form submission.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the rating group as invalid.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Root container for a star/icon rating control.
 *
 * Follows the WAI-ARIA APG Rating Radio Group pattern with `role="radiogroup"`,
 * roving tabindex, half-star support, hover preview, RTL awareness, and
 * integration with `Field` and native `<form>` via `RatingGroup.HiddenInput`.
 */
export const RatingGroupRoot = component$<RatingGroupRootProps>((props) => {
  const {
    ids: propIds,
    count: _count,
    defaultValue = 0,
    'bind:value': bindValue,
    onValueChange$,
    onHoverChange$,
    allowHalf: _allowHalf,
    allowClear: _allowClear,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    invalid: _invalid,
    onPointerLeave$,
    ...restProps
  } = props;

  const [value, setValue$, reset$] = useControllableState<number>({
    value: bindValue,
    defaultValue: defaultValue ?? 0,
    onChange$: onValueChange$,
  });

  const hoverValue = useSignal<number | null>(null);

  const field = useFieldContext();
  const control = useFieldControl(props);
  const ids: RatingGroupIds = {
    root: field ? field.ids.control : (props.id ?? propIds?.root ?? control.value.id),
  };

  const countSignal = useComputed$(() => Math.max(1, Math.floor(props.count ?? 5)));
  const allowHalfSignal = useComputed$(() => Boolean(props.allowHalf));
  const allowClearSignal = useComputed$(() => Boolean(props.allowClear));
  const disabledSignal = useComputed$(() => control.value.disabled);
  const readOnlySignal = useComputed$(() => control.value.readOnly);
  const requiredSignal = useComputed$(() => control.value.required);

  const setRating$ = $(async (next: number) => {
    if (disabledSignal.value || readOnlySignal.value) return;
    await setValue$(next);
  });

  const setHover$ = $(async (next: number | null) => {
    if (disabledSignal.value || readOnlySignal.value) {
      if (hoverValue.value !== null) {
        hoverValue.value = null;
      }
      return;
    }
    if (hoverValue.value !== next) {
      hoverValue.value = next;
      if (onHoverChange$) {
        await onHoverChange$(next);
      }
    }
  });

  const internalPointerLeave$ = $(async () => {
    await setHover$(null);
  });

  useContextProvider(ratingGroupContextId, {
    ids,
    count: countSignal,
    value,
    hoverValue,
    setRating$,
    setHover$,
    reset$,
    allowHalf: allowHalfSignal,
    allowClear: allowClearSignal,
    disabled: disabledSignal,
    readOnly: readOnlySignal,
    required: requiredSignal,
  });

  const ariaLabelledby =
    props['aria-labelledby'] ?? (props['aria-label'] ? undefined : control.value.labelId);

  return (
    <div
      {...restProps}
      id={ids.root}
      role="radiogroup"
      aria-labelledby={ariaLabelledby}
      aria-describedby={control.value.describedBy}
      aria-invalid={control.value.invalid ? 'true' : undefined}
      aria-required={requiredSignal.value ? 'true' : undefined}
      aria-disabled={disabledSignal.value ? 'true' : undefined}
      aria-readonly={readOnlySignal.value ? 'true' : undefined}
      onPointerLeave$={[internalPointerLeave$, onPointerLeave$]}
      data-leve-rating-group=""
      data-disabled={dataAttr(disabledSignal.value)}
      data-readonly={dataAttr(readOnlySignal.value)}
      data-invalid={dataAttr(control.value.invalid)}
    >
      <Slot />
    </div>
  );
});
