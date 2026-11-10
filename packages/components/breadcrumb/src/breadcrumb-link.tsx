import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';

export type BreadcrumbLinkProps = PropsOf<'a'> & {
  /** 現在のページを表すリンクのとき `true` にします（`aria-current="page"` を出力します） */
  current?: boolean;
};

/** パンくずのリンクです */
export const BreadcrumbLink = component$<BreadcrumbLinkProps>(({ current = false, ...props }) => {
  return (
    <a
      {...props}
      aria-current={current ? 'page' : props['aria-current']}
      data-leve-breadcrumb-link=""
      data-current={dataAttr(current)}
    >
      <Slot />
    </a>
  );
});
