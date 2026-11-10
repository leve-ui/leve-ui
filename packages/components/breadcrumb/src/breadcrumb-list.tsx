import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type BreadcrumbListProps = PropsOf<'ol'>;

/** パンくずの順序付きリストです */
export const BreadcrumbList = component$<BreadcrumbListProps>((props) => {
  return (
    <ol {...props} data-leve-breadcrumb-list="">
      <Slot />
    </ol>
  );
});
