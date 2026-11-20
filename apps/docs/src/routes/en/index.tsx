import { $, component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
import { Switch } from '@leve-ui/core';
import { css } from 'styled-system/css';
import {
  LuAccessibility,
  LuArrowRight,
  LuArrowUpRight,
  LuBoxes,
  LuCheck,
  LuCopy,
  LuGithub,
  LuPaintbrush,
  LuZap,
} from '../../components/icons';
import { docsNav } from '../../docs-nav';
import { localizeHref } from '../../i18n/locales';
import { msg, t } from '../../i18n/translate';
import { useLocale } from '../../i18n/use-locale';

const GITHUB_URL = 'https://github.com/leve-ui/leve-ui';

const componentItems =
  docsNav
    .find((section) => section.items.some((i) => i.href === '/components/accordion/'))
    ?.items.filter((item) => item.href !== '/components/') ?? [];

const plannedItems = [msg('Select'), msg('Slider'), msg('Date Picker')];

const variantCardStyles = css({
  bg: 'bg-canvas',
  borderRadius: 'xl',
  border: '1px solid {colors.border-default}',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const variantPreviewStyles = css({
  h: '180px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3',
  px: '4',
});

const variantCaptionStyles = css({
  borderTop: '1px solid {colors.border-default}',
  px: '4',
  py: '3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2',
});

export default component$(() => {
  const locale = useLocale();
  const installCopied = useSignal(false);

  const copyInstall$ = $(() => {
    navigator.clipboard.writeText('pnpm add @leve-ui/core');
    installCopied.value = true;
    setTimeout(() => {
      installCopied.value = false;
    }, 2000);
  });

  const principles = [
    {
      title: msg('WAI-ARIA first'),
      desc: msg('Roles, states, keyboard and focus follow the APG. Verified with E2E tests.'),
      iconBg: 'accent-subtle',
      iconColor: 'accent-text',
      icon: 'accessibility' as const,
    },
    {
      title: msg('Unstyled'),
      desc: msg(
        'No class or style output. Style parts through data-state and data-leve-* attributes.',
      ),
      iconBg: 'secondary-subtle',
      iconColor: 'secondary-default',
      icon: 'paintbrush' as const,
    },
    {
      title: msg('Install only what you use'),
      desc: msg('Install @leve-ui/core, or only the components you use.'),
      iconBg: 'accent-subtle',
      iconColor: 'accent-text',
      icon: 'boxes' as const,
    },
    {
      title: msg('Built for Qwik'),
      desc: msg('Resumable, SSR-safe ids, native top-layer overlays, and bind: signals.'),
      iconBg: 'secondary-subtle',
      iconColor: 'secondary-default',
      icon: 'zap' as const,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        class={css({
          background:
            'radial-gradient(120% 140% at 50% 0%, token(colors.accent-subtle) 0%, token(colors.bg-canvas) 70%)',
          pt: { base: '16', md: '28' },
          pb: { base: '14', md: '24' },
          px: { base: '4', sm: '6' },
        })}
      >
        <div
          class={css({
            maxW: '1200px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '7',
          })}
        >
          <div
            class={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2',
              bg: 'bg-canvas',
              borderRadius: 'full',
              border: '1px solid {colors.border-default}',
              px: '3.5',
              py: '1.5',
            })}
          >
            <span
              class={css({
                w: '2',
                h: '2',
                borderRadius: 'full',
                bg: 'secondary-default',
                flexShrink: 0,
              })}
              aria-hidden="true"
            />
            <span class={css({ fontSize: '13px', fontWeight: '500', color: 'fg-muted' })}>
              {t(locale, 'v0.1.0 — 26 components, pre-1.0')}
            </span>
          </div>

          <h1
            class={css({
              fontSize: { base: '40px', sm: '52px', md: '64px' },
              fontWeight: '700',
              letterSpacing: '-1.5px',
              lineHeight: '1.1',
              color: 'fg-default',
              textAlign: 'center',
            })}
          >
            {t(locale, 'Headless UI for Qwik')}
          </h1>

          <p
            class={css({
              maxW: '640px',
              fontSize: { base: '17px', md: '20px' },
              lineHeight: '1.6',
              color: 'fg-muted',
              textAlign: 'center',
            })}
          >
            {t(
              locale,
              'Accessible, unstyled components that follow the WAI-ARIA Authoring Practices. Bring your own CSS — every part is yours to style.',
            )}
          </p>

          <div
            class={css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3',
              pt: '2',
            })}
          >
            <Link
              href={localizeHref('/overview/getting-started/', locale)}
              class={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                bg: 'accent-default',
                color: 'accent-fg',
                borderRadius: 'lg',
                px: '5',
                py: '3',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'opacity 0.15s ease',
                _hover: { opacity: 0.9 },
                _focusVisible: {
                  outline: '2px solid',
                  outlineColor: 'accent-default',
                  outlineOffset: '2px',
                },
                '& svg': { w: '4', h: '4' },
              })}
            >
              <span>{t(locale, 'Get Started')}</span>
              <LuArrowRight aria-hidden="true" />
            </Link>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              class={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                bg: 'bg-canvas',
                color: 'fg-default',
                border: '1px solid {colors.border-default}',
                borderRadius: 'lg',
                px: '5',
                py: '3',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
                _hover: { bg: 'bg-subtle', borderColor: 'accent-default' },
                _focusVisible: {
                  outline: '2px solid',
                  outlineColor: 'accent-default',
                  outlineOffset: '2px',
                },
                '& svg': { w: '4', h: '4' },
              })}
            >
              <LuGithub aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>

          <button
            type="button"
            onClick$={copyInstall$}
            aria-label={t(locale, 'Copy install command')}
            class={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3',
              bg: 'bg-subtle',
              border: '1px solid {colors.border-default}',
              borderRadius: 'lg',
              px: '4',
              py: '2.5',
              fontFamily: 'mono',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
              _hover: { borderColor: 'accent-default' },
              _focusVisible: {
                outline: '2px solid',
                outlineColor: 'accent-default',
                outlineOffset: '2px',
              },
              '& svg': { w: '15px', h: '15px', color: 'fg-subtle' },
            })}
          >
            <span class={css({ color: 'fg-subtle' })}>$</span>
            <span class={css({ color: 'fg-default' })}>pnpm add @leve-ui/core</span>
            {installCopied.value ? (
              <LuCheck aria-hidden="true" class={css({ color: 'accent-text!' })} />
            ) : (
              <LuCopy aria-hidden="true" />
            )}
          </button>
        </div>
      </section>

      {/* Principles */}
      <section
        class={css({
          maxW: '1200px',
          mx: 'auto',
          px: { base: '4', sm: '6', lg: '8' },
          pt: '6',
          pb: { base: '14', md: '24' },
        })}
      >
        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: { base: '8', lg: '0' },
          })}
        >
          {principles.map((item, idx) => (
            <div
              key={item.title}
              class={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '3',
                py: '2',
                px: { base: '0', lg: '7' },
                borderInlineStart: {
                  base: 'none',
                  lg: idx > 0 ? '1px solid {colors.border-default}' : 'none',
                },
              })}
            >
              <div
                class={css({
                  w: '10',
                  h: '10',
                  borderRadius: 'lg',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bg: item.iconBg,
                  color: item.iconColor,
                  '& svg': { w: '5', h: '5' },
                })}
                aria-hidden="true"
              >
                {item.icon === 'accessibility' && <LuAccessibility />}
                {item.icon === 'paintbrush' && <LuPaintbrush />}
                {item.icon === 'boxes' && <LuBoxes />}
                {item.icon === 'zap' && <LuZap />}
              </div>
              <h2 class={css({ fontSize: '18px', fontWeight: '600', color: 'fg-default' })}>
                {t(locale, item.title)}
              </h2>
              <p class={css({ fontSize: '15px', lineHeight: '1.6', color: 'fg-muted' })}>
                {t(locale, item.desc)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section
        class={css({
          bg: 'bg-subtle',
          borderTop: '1px solid {colors.border-default}',
          borderBottom: '1px solid {colors.border-default}',
          py: { base: '14', md: '24' },
          px: { base: '4', sm: '6', lg: '8' },
        })}
      >
        <div
          class={css({
            maxW: '1200px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10',
          })}
        >
          <div class={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
            <span
              class={css({
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '1px',
                color: 'secondary-default',
                textTransform: 'uppercase',
              })}
            >
              {t(locale, 'ONE COMPONENT, ANY LOOK')}
            </span>
            <h2
              class={css({
                fontSize: { base: '30px', md: '40px' },
                fontWeight: '700',
                letterSpacing: '-0.8px',
                lineHeight: '1.2',
                color: 'fg-default',
              })}
            >
              {t(locale, 'Same markup. Your styles.')}
            </h2>
            <p
              class={css({
                maxW: '640px',
                fontSize: '17px',
                lineHeight: '1.6',
                color: 'fg-muted',
              })}
            >
              {t(
                locale,
                'leve-ui renders the semantics and behavior. You decide how it looks with plain CSS, Panda, Tailwind or anything else.',
              )}
            </p>
          </div>

          <div
            class={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
              gap: '6',
            })}
          >
            {/* Variant 1: Minimal */}
            <div class={variantCardStyles}>
              <div class={variantPreviewStyles}>
                <Switch.Root
                  defaultChecked
                  class={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3',
                    cursor: 'pointer',
                  })}
                >
                  <Switch.Control
                    class={css({
                      w: '44px',
                      h: '24px',
                      borderRadius: 'full',
                      p: '3px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      bg: 'border-default',
                      transition: 'background-color 0.15s ease',
                      _focusVisible: {
                        outline: '2px solid',
                        outlineColor: 'accent-default',
                        outlineOffset: '2px',
                      },
                      '&[data-state="checked"]': {
                        bg: 'accent-default',
                      },
                    })}
                  >
                    <Switch.Thumb
                      class={css({
                        w: '18px',
                        h: '18px',
                        borderRadius: 'full',
                        bg: 'white',
                        transition: 'transform 0.15s ease',
                        '&[data-state="checked"]': {
                          transform: 'translateX(20px)',
                        },
                      })}
                    />
                  </Switch.Control>
                  <Switch.Label
                    class={css({ fontSize: '14px', fontWeight: '500', color: 'fg-default' })}
                  >
                    {t(locale, 'Notifications')}
                  </Switch.Label>
                </Switch.Root>
              </div>
              <div class={variantCaptionStyles}>
                <span class={css({ fontSize: '13px', fontWeight: '500', color: 'fg-muted' })}>
                  {t(locale, 'Minimal')}
                </span>
                <code class={css({ fontFamily: 'mono', fontSize: '12px', color: 'fg-subtle' })}>
                  {'<Switch.Root>'}
                </code>
              </div>
            </div>

            {/* Variant 2: Brutalist */}
            <div class={variantCardStyles}>
              <div class={variantPreviewStyles}>
                <Switch.Root
                  defaultChecked
                  class={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3',
                    cursor: 'pointer',
                  })}
                >
                  <Switch.Control
                    class={css({
                      w: '52px',
                      h: '26px',
                      borderRadius: 'sm',
                      p: '3px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      bg: 'bg-muted',
                      border: '1px solid {colors.border-default}',
                      transition: 'background-color 0.15s ease',
                      _focusVisible: {
                        outline: '2px solid',
                        outlineColor: 'accent-default',
                        outlineOffset: '2px',
                      },
                      '&[data-state="checked"]': {
                        bg: 'fg-default',
                        borderColor: 'fg-default',
                      },
                    })}
                  >
                    <Switch.Thumb
                      class={css({
                        w: '20px',
                        h: '20px',
                        borderRadius: '2px',
                        bg: 'bg-canvas',
                        transition: 'transform 0.15s ease',
                        '&[data-state="checked"]': {
                          transform: 'translateX(24px)',
                        },
                      })}
                    />
                  </Switch.Control>
                  <Switch.Label
                    class={css({
                      fontFamily: 'mono',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '1.2px',
                      color: 'fg-default',
                    })}
                  >
                    DARK MODE
                  </Switch.Label>
                </Switch.Root>
              </div>
              <div class={variantCaptionStyles}>
                <span class={css({ fontSize: '13px', fontWeight: '500', color: 'fg-muted' })}>
                  {t(locale, 'Brutalist')}
                </span>
                <code class={css({ fontFamily: 'mono', fontSize: '12px', color: 'fg-subtle' })}>
                  {'<Switch.Root>'}
                </code>
              </div>
            </div>

            {/* Variant 3: Segmented */}
            <div class={variantCardStyles}>
              <div class={variantPreviewStyles}>
                <Switch.Root defaultChecked aria-label={t(locale, 'Segmented toggle')}>
                  <Switch.Control
                    class={css({
                      display: 'inline-flex',
                      alignItems: 'center',
                      bg: 'secondary-subtle',
                      borderRadius: 'full',
                      p: '1',
                      cursor: 'pointer',
                      _focusVisible: {
                        outline: '2px solid',
                        outlineColor: 'secondary-default',
                        outlineOffset: '2px',
                      },
                      '&[data-state="checked"] [data-part="on"]': {
                        bg: 'secondary-default',
                        color: 'white',
                      },
                      '&[data-state="unchecked"] [data-part="off"]': {
                        bg: 'secondary-default',
                        color: 'white',
                      },
                    })}
                  >
                    <span
                      data-part="on"
                      class={css({
                        px: '3.5',
                        py: '1.5',
                        borderRadius: 'full',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'secondary-default',
                        transition: 'background-color 0.15s ease, color 0.15s ease',
                      })}
                    >
                      On
                    </span>
                    <span
                      data-part="off"
                      class={css({
                        px: '3.5',
                        py: '1.5',
                        borderRadius: 'full',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'secondary-default',
                        transition: 'background-color 0.15s ease, color 0.15s ease',
                      })}
                    >
                      Off
                    </span>
                    <Switch.Thumb class={css({ display: 'none' })} />
                  </Switch.Control>
                </Switch.Root>
              </div>
              <div class={variantCaptionStyles}>
                <span class={css({ fontSize: '13px', fontWeight: '500', color: 'fg-muted' })}>
                  {t(locale, 'Segmented')}
                </span>
                <code class={css({ fontFamily: 'mono', fontSize: '12px', color: 'fg-subtle' })}>
                  {'<Switch.Root>'}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section
        class={css({
          maxW: '1200px',
          mx: 'auto',
          px: { base: '4', sm: '6', lg: '8' },
          py: { base: '14', md: '24' },
          display: 'flex',
          flexDirection: 'column',
          gap: '8',
        })}
      >
        <div
          class={css({
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '4',
          })}
        >
          <div class={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
            <h2
              class={css({
                fontSize: { base: '30px', md: '40px' },
                fontWeight: '700',
                letterSpacing: '-0.8px',
                lineHeight: '1.2',
                color: 'fg-default',
              })}
            >
              {t(locale, '26 components, more on the way')}
            </h2>
            <p class={css({ fontSize: '17px', color: 'fg-muted' })}>
              {t(locale, 'Inputs, collections and date pickers are next on the roadmap.')}
            </p>
          </div>

          <Link
            href={localizeHref('/overview/roadmap/', locale)}
            class={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5',
              fontSize: '15px',
              fontWeight: '600',
              color: 'accent-text',
              textDecoration: 'none',
              borderRadius: 'sm',
              _hover: { textDecoration: 'underline' },
              _focusVisible: {
                outline: '2px solid',
                outlineColor: 'accent-default',
                outlineOffset: '2px',
              },
              '& svg': { w: '4', h: '4' },
            })}
          >
            <span>{t(locale, 'See the roadmap')}</span>
            <LuArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: '4',
          })}
        >
          {componentItems.map((item) => (
            <Link
              key={item.href}
              href={localizeHref(item.href, locale)}
              class={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2',
                borderRadius: 'lg',
                border: '1px solid {colors.border-default}',
                px: '5',
                py: '4',
                textDecoration: 'none',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
                _hover: { borderColor: 'accent-default', bg: 'bg-subtle' },
                _focusVisible: {
                  outline: '2px solid',
                  outlineColor: 'accent-default',
                  outlineOffset: '2px',
                },
                '& svg': { w: '4', h: '4', color: 'fg-subtle', flexShrink: 0 },
              })}
            >
              <span class={css({ fontSize: '15px', fontWeight: '500', color: 'fg-default' })}>
                {t(locale, item.title)}
              </span>
              <LuArrowUpRight aria-hidden="true" />
            </Link>
          ))}

          {plannedItems.map((name) => (
            <div
              key={name}
              class={css({
                opacity: 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2',
                borderRadius: 'lg',
                border: '1px solid {colors.border-default}',
                px: '5',
                py: '4',
              })}
            >
              <span class={css({ fontSize: '15px', fontWeight: '500', color: 'fg-muted' })}>
                {t(locale, name)}
              </span>
              <span
                class={css({
                  bg: 'bg-muted',
                  color: 'fg-subtle',
                  borderRadius: 'full',
                  px: '2',
                  py: '0.5',
                  fontSize: '11px',
                  fontWeight: '600',
                })}
              >
                {t(locale, 'Soon')}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'leve-ui — Headless UI for Qwik',
  meta: [
    {
      name: 'description',
      content:
        'Accessible, unstyled UI components for Qwik that follow the WAI-ARIA Authoring Practices. Bring your own styles.',
    },
  ],
};
