/**
 * Design tokens of the docs site. The names match the variables of the design
 * (apps/docs/design/leve-ui-docs.pen, "Foundations") one to one:
 *
 * - colors: the same name, e.g. `$bg-canvas` → `bg: 'bg-canvas'` (`--colors-bg-canvas`)
 * - `$radius-*` → radii `*`, e.g. `$radius-md` → `borderRadius: 'md'`
 * - `$font-*` → fonts `*`, e.g. `$font-mono` → `fontFamily: 'mono'`
 *
 * The `demo-*` variables are not tokens here: demos use plain CSS with the
 * same values (.agents/rules/storybook.md).
 */

type Mode = { light: string; dark: string };

function mode({ light, dark }: Mode) {
  return { value: { base: light, _dark: dark } };
}

const colors: Record<string, Mode> = {
  'bg-canvas': { light: '#FFFFFF', dark: '#151934' },
  'bg-subtle': { light: '#F8FAFC', dark: '#1B2045' },
  'bg-muted': { light: '#F1F5F9', dark: '#252C5A' },
  'bg-code': { light: '#F8FAFC', dark: '#10132A' },
  'fg-default': { light: '#0F172A', dark: '#FFFFFF' },
  'fg-muted': { light: '#475569', dark: '#C9DDF0' },
  'fg-subtle': { light: '#64748B', dark: '#8FA3C7' },
  'border-default': { light: '#E2E8F0', dark: '#FFFFFF1F' },
  'border-subtle': { light: '#F1F5F9', dark: '#FFFFFF14' },
  'accent-default': { light: '#009DFD', dark: '#009DFD' },
  'accent-text': { light: '#006CE9', dark: '#4CB8FF' },
  'accent-subtle': { light: '#DAF0FF', dark: '#009DFD26' },
  'accent-fg': { light: '#FFFFFF', dark: '#FFFFFF' },
  'secondary-default': { light: '#6000FF', dark: '#AC7EF4' },
  'secondary-subtle': { light: '#F1E9FF', dark: '#AC7EF426' },
  'logo-ink': { light: '#000000', dark: '#FFFFFF' },
  'code-keyword': { light: '#6000FF', dark: '#C4A5F7' },
  'code-string': { light: '#0A7D45', dark: '#7EE2A8' },
  'code-tag': { light: '#006CE9', dark: '#4CB8FF' },
  'code-attr': { light: '#B45309', dark: '#F5C26B' },
};

/** Used by the shiki themes (vite/shiki-themes.ts), which need plain values. */
export const designColors = colors;

export const designSemanticColors = Object.fromEntries(
  Object.entries(colors).map(([name, value]) => [name, mode(value)]),
);

export const designFonts = {
  sans: { value: 'Roboto' },
  ja: { value: '"Noto Sans JP"' },
  mono: { value: '"Roboto Mono", monospace' },
};

export const designRadii = {
  sm: { value: '4px' },
  md: { value: '6px' },
  lg: { value: '8px' },
  xl: { value: '12px' },
};
