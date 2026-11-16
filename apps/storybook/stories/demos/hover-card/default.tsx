import { component$, useStyles$ } from '@builder.io/qwik';
import { HoverCard } from '@leve-ui/hover-card';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <p class="hover-card-default">
      Reviewed by{' '}
      <HoverCard.Root>
        <HoverCard.Trigger href="#ada" class="hover-card-default-trigger">
          @ada
        </HoverCard.Trigger>
        {/* A preview only: the profile page has the same information */}
        <HoverCard.Content sideOffset={8} class="hover-card-default-content">
          {/* Only inline elements (span) inside: the card is in a <p> */}
          <span class="hover-card-default-avatar" aria-hidden="true">
            AL
          </span>
          <span class="hover-card-default-body">
            <span class="hover-card-default-name">Ada Lovelace</span>
            <span class="hover-card-default-bio">Writes the first programs. Joined in 1843.</span>
            <a href="#ada" class="hover-card-default-link">
              View profile
            </a>
          </span>
          <HoverCard.Arrow class="hover-card-default-arrow" />
        </HoverCard.Content>
      </HoverCard.Root>{' '}
      yesterday.
    </p>
  );
});
