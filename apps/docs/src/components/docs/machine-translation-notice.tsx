import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { Alert } from '@leve-ui/alert';
import { css } from 'styled-system/css';
import { LOCALE_REVIEWED, localizeHref, SOURCE_LOCALE, stripLocale } from '../../i18n/locales';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/use-locale';
import { LuLanguages } from '../icons';

/**
 * Tells readers that the page is a machine translation, on locales that nobody reviews
 * (`LOCALE_REVIEWED` in src/i18n/locales.ts), with a link to the English page.
 */
export const MachineTranslationNotice = component$(() => {
  const locale = useLocale();
  const loc = useLocation();
  if (LOCALE_REVIEWED[locale]) return null;

  return (
    <Alert.Root
      class={css({
        display: 'flex',
        gap: '3',
        alignItems: 'flex-start',
        mb: '8',
        px: '4',
        py: '3',
        border: '1px solid {colors.border-default}',
        borderRadius: 'lg',
        bg: 'bg-subtle',
        fontSize: '14px',
        color: 'fg-muted',
        '& svg': { flexShrink: 0, w: '4', h: '4', mt: '0.5', color: 'accent-text' },
      })}
    >
      <LuLanguages aria-hidden="true" />
      <Alert.Description>
        {t(locale, 'This page was translated by machine and may contain mistakes.')}{' '}
        <Link
          href={localizeHref(stripLocale(loc.url.pathname), SOURCE_LOCALE)}
          class={css({ color: 'accent-text', textDecoration: 'underline' })}
        >
          {t(locale, 'Read the English page')}
        </Link>
      </Alert.Description>
    </Alert.Root>
  );
});
