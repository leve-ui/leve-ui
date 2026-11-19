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
import { HoverCard } from '@leve-ui/hover-card';
import styles from './custom-trigger.css?inline';

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

export default component$(() => {
  useStyles$(styles);
  const visited = useSignal<string | null>(null);

  return (
    <p class="hover-card-custom-trigger">
      Reviewed by{' '}
      <HoverCard.Root>
        <HoverCard.Trigger
          as={ClientLink}
          href="/users/ada"
          onNavigate$={$((href: string) => {
            visited.value = href;
          })}
          class="hover-card-custom-trigger-trigger"
        >
          @ada
        </HoverCard.Trigger>
        {/* A preview only: the profile page has the same information */}
        <HoverCard.Content sideOffset={8} class="hover-card-custom-trigger-content">
          {/* Only inline elements (span) inside: the card is in a <p> */}
          <span class="hover-card-custom-trigger-avatar" aria-hidden="true">
            AL
          </span>
          <span class="hover-card-custom-trigger-body">
            <span class="hover-card-custom-trigger-name">Ada Lovelace</span>
            <span class="hover-card-custom-trigger-bio">
              Writes the first programs. Joined in 1843.
            </span>
            <a href="#ada" class="hover-card-custom-trigger-link">
              View profile
            </a>
          </span>
          <HoverCard.Arrow class="hover-card-custom-trigger-arrow" />
        </HoverCard.Content>
      </HoverCard.Root>{' '}
      yesterday.
      {visited.value && (
        <span class="hover-card-custom-trigger-status"> Navigated to {visited.value}</span>
      )}
    </p>
  );
});
