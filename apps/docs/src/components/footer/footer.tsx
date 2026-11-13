import { component$ } from '@builder.io/qwik';
import { Separator } from '@leve-ui/core';
import { css } from 'styled-system/css';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/use-locale';
import { LuGithub } from '../icons';

const footerContainerStyles = css({
  bg: 'bg-canvas',
  mt: 'auto',
  width: '100%',
  transition: 'background-color 0.2s ease',
});

const footerInnerStyles = css({
  maxW: '1400px',
  mx: 'auto',
  px: { base: '6', sm: '8', lg: '12' },
  py: '6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '4',
});

const copyrightStyles = css({
  fontSize: 'sm',
  color: 'fg-muted',
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  flexWrap: 'wrap',
});

const githubLinkStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'fg-muted',
  p: '2',
  borderRadius: 'lg',
  fontSize: 'xl',
  transition: 'color 0.15s ease, background-color 0.15s ease',
  _hover: {
    color: 'fg-default',
    bg: 'bg-muted',
  },
});

export const Footer = component$(() => {
  const locale = useLocale();
  return (
    <footer class={footerContainerStyles}>
      <Separator.Root class={css({ height: '1px', bg: 'border-default' })} />
      <div class={footerInnerStyles}>
        <p class={copyrightStyles}>
          <span>&copy; 2026 leve-ui.</span>
          <span class={css({ color: 'fg-subtle', display: { base: 'none', sm: 'inline' } })}>
            {t(locale, 'Released under the MIT License.')}
          </span>
        </p>

        <a
          href="https://github.com/leve-ui/leve-ui"
          target="_blank"
          rel="noreferrer"
          aria-label={t(locale, 'GitHub repository')}
          class={githubLinkStyles}
        >
          <LuGithub />
        </a>
      </div>
    </footer>
  );
});
