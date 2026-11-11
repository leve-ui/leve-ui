import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { css } from 'styled-system/css';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div
      class={css({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bg: 'bg.canvas',
        color: 'fg',
        transition: 'background-color 0.2s ease, color 0.2s ease',
      })}
    >
      <Header />

      <main class={css({ flex: 1 })}>
        <Slot />
      </main>

      <Footer />
    </div>
  );
});
