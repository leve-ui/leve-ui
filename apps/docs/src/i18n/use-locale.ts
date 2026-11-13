import { useLocation } from '@builder.io/qwik-city';
import { getLocale } from './locales';

/** The locale of the current page. Translate UI strings with `t(locale, '...')` (./translate.ts). */
export const useLocale = () => getLocale(useLocation().url.pathname);
