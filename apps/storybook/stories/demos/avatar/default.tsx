import { component$, useStyles$ } from '@builder.io/qwik';
import { Avatar } from '@leve-ui/avatar';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Avatar.Root class="avatar-default">
      <Avatar.Image
        src="https://i.pravatar.cc/96?img=5"
        alt="Sample user"
        width={48}
        height={48}
        class="avatar-default-image"
      />
      <Avatar.Fallback class="avatar-default-fallback">LU</Avatar.Fallback>
    </Avatar.Root>
  );
});
