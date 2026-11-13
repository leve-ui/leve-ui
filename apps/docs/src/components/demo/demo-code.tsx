import { $, component$, Resource, useResource$, useSignal } from '@builder.io/qwik';
import { Collapsible } from '@leve-ui/collapsible';
import { Tabs } from '@leve-ui/tabs';
import { css } from 'styled-system/css';
import { LuCheck, LuChevronRight, LuCopy, LuExternalLink } from '../icons';
import { loadDemoSource } from './demo-highlighted';

const STORYBOOK_URL = 'https://leve-ui-storybook.pages.dev';

/** `radio-group/with-field` → the Storybook story `components-radiogroup--with-field` */
function storybookUrl(id: string) {
  const [component, story] = id.split('/');
  return `${STORYBOOK_URL}/?path=/story/components-${component.replaceAll('-', '')}--${story}`;
}

const codeHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2',
  h: '44px',
  pl: '4',
  pr: '2',
  borderTop: '1px solid {colors.border-default}',
  borderBottom: '1px solid {colors.border-default}',
  bg: 'bg-subtle',
});

const tabListStyles = css({ display: 'flex', alignSelf: 'stretch' });

const tabTriggerStyles = css({
  position: 'relative',
  px: '10px',
  fontFamily: 'mono',
  fontSize: '13px',
  fontWeight: '500',
  color: 'fg-subtle',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  _hover: { color: 'fg-default' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent-default', outlineOffset: '-2px' },
  '&[aria-selected="true"]': {
    color: 'fg-default',
    _after: {
      content: '""',
      position: 'absolute',
      insetX: 0,
      bottom: 0,
      h: '2px',
      bg: 'accent-default',
    },
  },
});

const iconButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: '31px',
  h: '31px',
  borderRadius: 'md',
  color: 'fg-muted',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  _hover: { bg: 'bg-muted', color: 'fg-default' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent-default', outlineOffset: '2px' },
  '& svg': { w: '15px', h: '15px' },
});

const codeStyles = css({
  bg: 'bg-code',
  maxH: '480px',
  overflow: 'auto',
  _focusVisible: { outline: '2px solid', outlineColor: 'accent-default', outlineOffset: '-2px' },
  '& pre': {
    m: 0,
    py: '4',
    px: '5',
    fontFamily: 'mono',
    fontSize: '13px',
    lineHeight: '1.7',
  },
});

const collapsibleTriggerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5',
  w: 'full',
  px: '4',
  py: '2.5',
  borderTop: '1px solid {colors.border-default}',
  bg: 'bg-subtle',
  color: 'fg-muted',
  fontSize: 'sm',
  fontWeight: '500',
  fontFamily: 'inherit',
  cursor: 'pointer',
  border: 'none',
  _hover: { color: 'fg-default' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent-default', outlineOffset: '-2px' },
  '& svg': { w: '4', h: '4', transition: 'transform 0.15s ease' },
  '&[data-state="open"] svg': { transform: 'rotate(90deg)' },
  '&[data-state="open"] [data-label="show"]': { display: 'none' },
  '&[data-state="closed"] [data-label="hide"]': { display: 'none' },
});

const CopyButton = component$(() => {
  const copied = useSignal(false);

  // TODO(leve-ui): replace with Clipboard (#47)
  const copy$ = $(async (_: Event, button: HTMLButtonElement) => {
    const panel = button
      .closest('[data-docs-demo]')
      ?.querySelector('[data-leve-tabs-content]:not([hidden]) pre');
    if (!panel?.textContent) return;
    await navigator.clipboard.writeText(panel.textContent);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });

  return (
    <button
      type="button"
      class={iconButtonStyles}
      aria-label={copied.value ? 'Copied' : 'Copy code'}
      onClick$={copy$}
    >
      {copied.value ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
    </button>
  );
});

export type DemoFile = {
  file: string;
  /** `avatar/default.tsx` */
  source: string;
  /** Highlighted HTML. Empty when the page was rendered in the browser (SPA navigation). */
  html: string;
};

/** Loads the highlighted source in the browser when the page was not rendered on the server. */
const LazyHighlightedCode = component$<{ source: string }>(({ source }) => {
  const html = useResource$(() => loadDemoSource(source));
  return <Resource value={html} onResolved={(value) => <div dangerouslySetInnerHTML={value} />} />;
});

/**
 * The source tabs of a demo. This is an inline component (not `component$`) so
 * that the highlighted HTML is rendered once on the server and is never
 * serialized as props for the browser.
 */
export function DemoCode({ name, files }: { name: string; files: DemoFile[] }) {
  return (
    <Tabs.Root defaultValue={files[0].file}>
      <div class={codeHeaderStyles}>
        <Tabs.List aria-label={`${name} source`} class={tabListStyles}>
          {files.map(({ file }) => (
            <Tabs.Trigger key={file} value={file} class={tabTriggerStyles}>
              {file}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div class={css({ display: 'flex', alignItems: 'center' })}>
          <a
            href={storybookUrl(name)}
            target="_blank"
            rel="noreferrer"
            aria-label="Open in Storybook"
            class={iconButtonStyles}
          >
            <LuExternalLink aria-hidden="true" />
          </a>
          <CopyButton />
        </div>
      </div>
      {files.map(({ file, source, html }) => (
        <Tabs.Content key={file} value={file} class={codeStyles}>
          {html ? <div dangerouslySetInnerHTML={html} /> : <LazyHighlightedCode source={source} />}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

/** DemoCode behind a "Show code" toggle (used for Examples). Inline for the same reason. */
export function CollapsedDemoCode(props: { name: string; files: DemoFile[] }) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger class={collapsibleTriggerStyles}>
        <LuChevronRight aria-hidden="true" />
        <span data-label="show">Show code</span>
        <span data-label="hide">Hide code</span>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <DemoCode {...props} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
