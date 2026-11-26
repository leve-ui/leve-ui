import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { dataAttr, valueToPercent, withCssVars } from '@leve-ui/utils';
import { sliderContextId } from './slider-context';

export type SliderRangeProps = PropsOf<'div'>;

/**
 * Visual highlight representing the active value range on the track.
 *
 * Exposes `--leve-slider-range-start` and `--leve-slider-range-size` CSS
 * custom properties so consumers can position and size the range bar.
 */
export const SliderRange = component$<SliderRangeProps>((props) => {
  const context = useContext(sliderContextId);
  const values = context.values.value;
  const min = context.min.value;
  const max = context.max.value;

  const isMultiThumb = values.length > 1;
  const startPercent = isMultiThumb ? valueToPercent(values[0] ?? min, min, max) : 0;
  const endPercent = valueToPercent(values[values.length - 1] ?? min, min, max);
  const sizePercent = Math.max(0, endPercent - startPercent);

  return (
    <div
      {...props}
      // Expose range geometry via CSS custom properties only (exception per component-architecture.md)
      style={withCssVars(props.style, {
        '--leve-slider-range-start': `${startPercent}%`,
        '--leve-slider-range-size': `${sizePercent}%`,
      })}
      data-leve-slider-range=""
      data-orientation={context.orientation.value}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
    />
  );
});
