import { component$, useStyles$ } from '@builder.io/qwik';
import { Avatar } from '@leve-ui/avatar';

const styles = `
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 9999px;
    overflow: hidden;
    background: #e5e7eb;
    font-weight: 600;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Avatar.Root class="avatar">
      <Avatar.Image
        src="https://i.pravatar.cc/96?img=5"
        alt="Sample user"
        width={48}
        height={48}
        class="avatar-image"
      />
      <Avatar.Fallback>LU</Avatar.Fallback>
    </Avatar.Root>
  );
});
