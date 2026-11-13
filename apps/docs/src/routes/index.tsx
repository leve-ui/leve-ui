import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { css } from 'styled-system/css';
import { SOURCE_LOCALE } from '../i18n/locales';

const HOME = `/${SOURCE_LOCALE}/`;

/**
 * Every page has a locale prefix (adr/0033). The static site cannot redirect at
 * request time, so `/` redirects in the browser; on Cloudflare Pages,
 * public/_redirects redirects it before this page is served.
 */
export default component$(() => (
  <p class={css({ p: '8', textAlign: 'center' })}>
    <a href={HOME}>leve-ui documentation</a>
  </p>
));

export const head: DocumentHead = {
  title: 'leve-ui',
  meta: [{ httpEquiv: 'refresh', content: `0; url=${HOME}` }],
};
