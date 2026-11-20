import {
  $,
  component$,
  createContextId,
  type Signal,
  useContext,
  useSignal,
} from '@builder.io/qwik';
import { Tabs } from '@leve-ui/core';
import { css } from 'styled-system/css';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/use-locale';
import { LuCheck, LuCopy } from '../icons';

const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const packageManagerContextId = createContextId<Signal<string>>(
  'leve-ui.docs.package-manager',
);

function formatCommand(pm: PackageManager, pkg: string) {
  const verb = pm === 'npm' ? 'install' : 'add';
  return { pm, verb, pkg, full: `${pm} ${verb} ${pkg}` };
}

export type InstallProps = {
  /** Individual package name, e.g. `@leve-ui/checkbox`. */
  package: string;
};

/**
 * Package installation widget with package (`@leve-ui/<name>` / `@leve-ui/core`)
 * and package manager (`pnpm` / `npm` / `yarn` / `bun`) tabs.
 */
export const Install = component$<InstallProps>((props) => {
  const locale = useLocale();
  const packages =
    props.package === '@leve-ui/core' ? ['@leve-ui/core'] : [props.package, '@leve-ui/core'];
  const selectedPkg = useSignal<string>(packages[0]);
  const selectedPm = useContext(packageManagerContextId);
  const copied = useSignal(false);

  const copy$ = $(() => {
    const { full } = formatCommand(selectedPm.value as PackageManager, selectedPkg.value);
    navigator.clipboard.writeText(full);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });

  return (
    <div
      class={css({
        my: '4',
        borderRadius: 'lg',
        border: '1px solid {colors.border-default}',
        bg: 'bg-code',
        overflow: 'hidden',
      })}
    >
      <Tabs.Root bind:value={selectedPkg}>
        <div
          class={css({
            h: '40px',
            ps: '3',
            pe: '2',
            borderBottom: '1px solid {colors.border-default}',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2',
          })}
        >
          <Tabs.List
            aria-label={t(locale, 'Package')}
            class={css({ display: 'flex', alignItems: 'stretch', h: 'full', gap: '1' })}
          >
            {packages.map((pkg) => (
              <Tabs.Trigger
                key={pkg}
                value={pkg}
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  h: 'full',
                  px: '2.5',
                  bg: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid transparent',
                  fontFamily: 'mono',
                  fontSize: '13px',
                  color: 'fg-muted',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                  _hover: { color: 'fg-default' },
                  _focusVisible: {
                    outline: '2px solid',
                    outlineColor: 'accent-default',
                    outlineOffset: '-2px',
                  },
                  '&[data-state="active"]': {
                    color: 'fg-default',
                    fontWeight: '500',
                    borderBottomColor: 'accent-default',
                  },
                })}
              >
                {pkg}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <button
            type="button"
            onClick$={copy$}
            aria-label={t(locale, 'Copy install command')}
            class={css({
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              w: '8',
              h: '8',
              borderRadius: 'md',
              bg: 'transparent',
              border: 'none',
              color: 'fg-muted',
              cursor: 'pointer',
              _hover: { color: 'fg-default', bg: 'bg-muted' },
              _focusVisible: {
                outline: '2px solid',
                outlineColor: 'accent-default',
                outlineOffset: '2px',
              },
              '& svg': { w: '15px', h: '15px' },
            })}
          >
            {copied.value ? (
              <LuCheck aria-hidden="true" class={css({ color: 'accent-text' })} />
            ) : (
              <LuCopy aria-hidden="true" />
            )}
          </button>
        </div>

        {packages.map((pkg) => (
          <Tabs.Content key={pkg} value={pkg}>
            <Tabs.Root bind:value={selectedPm}>
              <Tabs.List
                aria-label={t(locale, 'Package manager')}
                class={css({ display: 'flex', alignItems: 'center', gap: '1', pt: '2.5', px: '3' })}
              >
                {PACKAGE_MANAGERS.map((pm) => (
                  <Tabs.Trigger
                    key={pm}
                    value={pm}
                    class={css({
                      px: '2',
                      py: '3px',
                      borderRadius: 'sm',
                      bg: 'transparent',
                      border: 'none',
                      fontFamily: 'mono',
                      fontSize: '12px',
                      color: 'fg-subtle',
                      cursor: 'pointer',
                      transition: 'color 0.15s ease, background-color 0.15s ease',
                      _hover: { color: 'fg-default' },
                      _focusVisible: {
                        outline: '2px solid',
                        outlineColor: 'accent-default',
                        outlineOffset: '1px',
                      },
                      '&[data-state="active"]': {
                        bg: 'bg-muted',
                        color: 'fg-default',
                      },
                    })}
                  >
                    {pm}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {PACKAGE_MANAGERS.map((pm) => {
                const cmd = formatCommand(pm, pkg);
                return (
                  <Tabs.Content
                    key={pm}
                    value={pm}
                    class={css({
                      px: '5',
                      py: '4',
                      fontFamily: 'mono',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      overflowX: 'auto',
                    })}
                  >
                    <pre class={css({ m: 0, fontFamily: 'inherit' })}>
                      <code>
                        <span class={css({ color: 'code-tag' })}>{cmd.pm}</span>{' '}
                        <span class={css({ color: 'fg-default' })}>
                          {cmd.verb} {cmd.pkg}
                        </span>
                      </code>
                    </pre>
                  </Tabs.Content>
                );
              })}
            </Tabs.Root>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
});
