import { defineGlobalStyles, type defineStyles } from '@pandacss/dev';

type SystemStyleObject = Parameters<typeof defineStyles>[0];
type GlobalStyleObject = ReturnType<typeof defineGlobalStyles>;

/** Class name of the Markdown content area of docs pages. */
export const PROSE_CLASS = 'docs-prose';

/**
 * Element selectors must not reach into live demos, which bring their own CSS
 * (adr/0031). Every selector is limited to elements outside `[data-docs-demo]`.
 */
function scoped(styles: Record<string, SystemStyleObject>): GlobalStyleObject {
  return Object.fromEntries(
    Object.entries(styles).map(([selector, style]) => [
      selector
        .split(',')
        .map((s) => `.${PROSE_CLASS} ${s.trim()}:not([data-docs-demo] *)`)
        .join(', '),
      style,
    ]),
  );
}

/** Styles for the Markdown content of docs pages (headings are in src/components/mdx). */
export const proseGlobalCss = defineGlobalStyles({
  [`.${PROSE_CLASS}`]: {
    color: 'fg-muted',
    fontSize: '16px',
    lineHeight: '1.7',
  },
  ...scoped({
    h1: {
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '1.2',
      color: 'fg-default',
      mt: 0,
      mb: '3',
      letterSpacing: '-0.01em',
    },
    // The first paragraph after the title is the lead
    'h1 + p': { fontSize: '18px', color: 'fg-muted', mt: 0, mb: '6' },
    p: { my: '4' },
    a: {
      color: 'accent-text',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
      _hover: { textDecorationThickness: '2px' },
    },
    'h2 > a, h3 > a': { textDecoration: 'none', color: 'fg-subtle' },
    strong: { color: 'fg-default', fontWeight: '600' },
    'ul, ol': { ps: '6', my: '4' },
    ul: { listStyleType: 'disc' },
    ol: { listStyleType: 'decimal' },
    li: { my: '1.5' },
    hr: { border: 'none', borderTop: '1px solid {colors.border-default}', my: '8' },
    blockquote: {
      m: 0,
      my: '4',
      ps: '4',
      borderInlineStart: '3px solid {colors.accent-default}',
    },
    ':not(pre) > code': {
      fontFamily: 'mono',
      fontSize: '0.875em',
      px: '1.5',
      py: '0.5',
      borderRadius: 'sm',
      bg: 'bg-muted',
      color: 'fg-default',
    },
    'pre.shiki': {
      fontFamily: 'mono',
      fontSize: '13px',
      lineHeight: '1.7',
      p: '4',
      my: '5',
      bg: 'bg-code',
      border: '1px solid',
      borderColor: 'border-default',
      borderRadius: 'xl',
      overflowX: 'auto',
    },
    '.table-wrapper': { overflowX: 'auto', my: '5' },
    table: {
      w: 'full',
      borderCollapse: 'separate',
      borderSpacing: 0,
      border: '1px solid',
      borderColor: 'border-default',
      borderRadius: 'lg',
      fontSize: '14px',
      lineHeight: '1.6',
    },
    th: {
      textAlign: 'start',
      fontWeight: '600',
      color: 'fg-default',
      bg: 'bg-subtle',
      px: '4',
      py: '2.5',
      borderBottom: '1px solid {colors.border-default}',
    },
    td: {
      px: '4',
      py: '2.5',
      verticalAlign: 'top',
      borderBottom: '1px solid {colors.border-default}',
    },
    'tr:last-child td': { borderBottom: 'none' },
    'th:first-child': { borderStartStartRadius: 'lg' },
    'th:last-child': { borderStartEndRadius: 'lg' },
  }),
});
