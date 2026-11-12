import { component$, useStyles$ } from '@builder.io/qwik';
import { Avatar } from '@leve-ui/avatar';
import styles from './fallback.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Avatar.Root class="avatar-fallback">
      <Avatar.Image src="/not-found.png" alt="Broken image" class="avatar-fallback-image" />
      <Avatar.Fallback class="avatar-fallback-fallback">LU</Avatar.Fallback>
    </Avatar.Root>
  );
});
