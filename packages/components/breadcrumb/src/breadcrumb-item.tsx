import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type BreadcrumbItemProps = PropsOf<'li'>;

/** パンくずの 1 項目です。中に Link を置きます */
export const BreadcrumbItem = component$<BreadcrumbItemProps>((props) => {
  return (
    <li {...props} data-leve-breadcrumb-item="">
      <Slot />
    </li>
  );
});
