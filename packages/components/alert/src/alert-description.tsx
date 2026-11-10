import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type AlertDescriptionProps = PropsOf<'div'>;

/** Alert の本文です */
export const AlertDescription = component$<AlertDescriptionProps>((props) => {
  return (
    <div {...props} data-leve-alert-description="">
      <Slot />
    </div>
  );
});
