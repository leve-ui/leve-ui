import {
  $,
  component$,
  Fragment,
  type PropsOf,
  type QRL,
  Slot,
  sync$,
  useSignal,
  useStyles$,
} from '@builder.io/qwik';
import { Breadcrumb } from '@leve-ui/breadcrumb';
import { LuChevronRight } from '@qwikest/icons/lucide';
import styles from './custom-link.css?inline';

type ClientLinkProps = PropsOf<'a'> & {
  onNavigate$?: QRL<(href: string) => void>;
};

// Example of a router link component (such as Qwik City's <Link>) that spreads received props onto <a>
const ClientLink = component$<ClientLinkProps>(({ onNavigate$, onClick$, ...props }) => {
  const preventDefault$ = sync$((event: MouseEvent) => {
    event.preventDefault();
  });
  const handleClick$ = $(() => {
    if (props.href) {
      onNavigate$?.(props.href);
    }
  });

  return (
    <a {...props} onClick$={[preventDefault$, handleClick$, onClick$]}>
      <Slot />
    </a>
  );
});

const ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/components', label: 'Components' },
  { href: '/components/breadcrumb', label: 'Breadcrumb' },
];

export default component$(() => {
  useStyles$(styles);
  const currentPath = useSignal('/components/breadcrumb');

  return (
    <Breadcrumb.Root class="breadcrumb-custom-link">
      <Breadcrumb.List class="breadcrumb-custom-link-list">
        {ITEMS.map((item, index) => (
          <Fragment key={item.href}>
            {index > 0 && (
              <Breadcrumb.Separator class="breadcrumb-custom-link-separator">
                <LuChevronRight class="breadcrumb-custom-link-separator-icon" aria-hidden="true" />
              </Breadcrumb.Separator>
            )}
            <Breadcrumb.Item>
              <Breadcrumb.Link
                as={ClientLink}
                href={item.href}
                current={currentPath.value === item.href}
                onNavigate$={$((href: string) => {
                  currentPath.value = href;
                })}
                class="breadcrumb-custom-link-link"
              >
                {item.label}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
});
