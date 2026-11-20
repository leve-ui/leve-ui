import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { css } from 'styled-system/css';
import { LOCALE_STORAGE_KEY, LOCALES, SOURCE_LOCALE } from '../i18n/locales';

const HOME = `/${SOURCE_LOCALE}/`;

// Runs before paint on `/` to route visitors to their saved or browser locale (derived from LOCALES).
const redirectScript = `(function(){try{var locales=${JSON.stringify(LOCALES)};var fallback=${JSON.stringify(SOURCE_LOCALE)};var key=${JSON.stringify(LOCALE_STORAGE_KEY)};var saved=localStorage.getItem(key);if(saved&&locales.indexOf(saved)!==-1){location.replace('/'+saved+'/');return;}var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];for(var i=0;i<langs.length;i++){var l=String(langs[i]||'').trim().toLowerCase();if(!l)continue;if(locales.indexOf(l)!==-1){location.replace('/'+l+'/');return;}var base=l.split('-')[0];if(locales.indexOf(base)!==-1){location.replace('/'+base+'/');return;}}location.replace('/'+fallback+'/');}catch(e){location.replace('/'+${JSON.stringify(SOURCE_LOCALE)}+'/');}})();`;

/**
 * Every page has a locale prefix (adr/0033). The root path detects the user's
 * explicitly saved locale or browser language and redirects accordingly.
 */
export default component$(() => (
  <>
    <script dangerouslySetInnerHTML={redirectScript} />
    <noscript>
      <meta http-equiv="refresh" content={`0; url=${HOME}`} />
    </noscript>
    <p class={css({ p: '8', textAlign: 'center' })}>
      <a href={HOME}>leve-ui documentation</a>
    </p>
  </>
));

export const head: DocumentHead = {
  title: 'leve-ui',
};
