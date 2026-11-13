import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { localizeHref } from '../../i18n/locales';
import { useLocale } from '../../i18n/use-locale';

/** MDX links: site-relative links (`/overview/forms/`) stay in the current locale. */
export const A = component$<PropsOf<'a'>>(({ href, ...props }) => {
  const locale = useLocale();

  return (
    <a {...props} href={typeof href === 'string' ? localizeHref(href, locale) : href}>
      <Slot />
    </a>
  );
});
