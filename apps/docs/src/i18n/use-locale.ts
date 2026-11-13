import { useLocation } from '@builder.io/qwik-city';
import { getLocale } from './locales';

/** The locale of the current page. */
export const useLocale = () => getLocale(useLocation().url.pathname);
