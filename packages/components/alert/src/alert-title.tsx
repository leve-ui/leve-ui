import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type AlertTitleProps = PropsOf<'div'>;

/** Alert の見出しです */
export const AlertTitle = component$<AlertTitleProps>((props) => {
  return (
    <div {...props} data-leve-alert-title="">
      <Slot />
    </div>
  );
});
