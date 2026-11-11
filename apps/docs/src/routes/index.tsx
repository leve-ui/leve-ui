import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Avatar } from '@leve-ui/core';

export default component$(() => {
  return (
    <main>
      <h1>leve-ui</h1>
      <p>Headless UI components for Qwik.</p>

      <h2>Avatar</h2>
      <Avatar.Root class="avatar">
        <Avatar.Image
          src="https://i.pravatar.cc/80?img=5"
          alt="Sample user"
          width={48}
          height={48}
        />
        <Avatar.Fallback>LU</Avatar.Fallback>
      </Avatar.Root>
    </main>
  );
});

export const head: DocumentHead = {
  title: 'leve-ui',
  meta: [{ name: 'description', content: 'Headless UI components for Qwik' }],
};
