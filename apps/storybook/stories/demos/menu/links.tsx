import {
  $,
  component$,
  type PropsOf,
  type QRL,
  Slot,
  sync$,
  useSignal,
  useStyles$,
} from '@builder.io/qwik';
import { Menu } from '@leve-ui/menu';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './links.css?inline';

type ClientLinkProps = PropsOf<'a'> & {
  onNavigate$?: QRL<(href: string) => void>;
};

// Example of a router link component (such as Qwik City's <Link>) that spreads props onto <a>
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

export default component$(() => {
  useStyles$(styles);
  const visited = useSignal('None');
  const navigate$ = $((href: string) => {
    visited.value = href;
  });

  return (
    <div class="menu-links">
      <Menu.Root>
        <Menu.Trigger class="menu-links-trigger">
          Navigation
          <LuChevronDown class="menu-links-chevron" aria-hidden="true" />
        </Menu.Trigger>
        <Menu.Content sideOffset={4} class="menu-links-content">
          <Menu.Item as={ClientLink} href="/docs" onNavigate$={navigate$} class="menu-links-item">
            Documentation
          </Menu.Item>
          <Menu.Item
            as={ClientLink}
            href="/components"
            onNavigate$={navigate$}
            class="menu-links-item"
          >
            Components
          </Menu.Item>
          <Menu.Item
            as={ClientLink}
            href="/changelog"
            onNavigate$={navigate$}
            class="menu-links-item"
          >
            Changelog
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
      <p class="menu-links-status">Navigated to: {visited.value}</p>
    </div>
  );
});
