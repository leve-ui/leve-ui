import { $, component$, type PropsOf, useContext, useSignal } from '@builder.io/qwik';
import { dataAttr, useFormReset } from '@leve-ui/utils';
import { sliderContextId } from './slider-context';

export type SliderHiddenInputProps = PropsOf<'input'> & {
  /**
   * Zero-based index of the thumb value to bind to this input.
   * @default 0
   */
  index?: number;
  /** The `id` of the form element to associate the input with. */
  form?: string;
};

/**
 * Visually hidden `<input type="number">` for native `<form>` submission and reset.
 *
 * Positioned absolutely (`adr/0026`) so native `required` validation and `FormData`
 * work seamlessly. Give `Slider.Root` `position: relative` when using this part.
 */
export const SliderHiddenInput = component$<SliderHiddenInputProps>((props) => {
  const { index = 0, ...restProps } = props;
  const context = useContext(sliderContextId);
  const inputRef = useSignal<HTMLInputElement>();

  useFormReset(
    inputRef,
    $(async () => {
      await context.reset$();
      if (inputRef.value) {
        inputRef.value.value = String(context.values.value[index] ?? context.min.value);
      }
    }),
  );

  const val = context.values.value[index] ?? context.min.value;

  return (
    <input
      {...restProps}
      ref={inputRef}
      type="number"
      value={String(val)}
      min={context.min.value}
      max={context.max.value}
      step={context.step.value}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
      data-leve-slider-hidden-input=""
      data-index={index}
      data-disabled={dataAttr(context.disabled.value)}
    />
  );
});
