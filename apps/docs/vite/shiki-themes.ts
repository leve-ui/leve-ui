import type { ThemeRegistration } from 'shiki';

import { designColors } from '../theme/tokens';

type Mode = 'light' | 'dark';

/** Code colors of the design (`code-*`, `fg-*` and `bg-code` in theme/tokens.ts). */
function palette(mode: Mode) {
  return {
    fg: designColors['fg-default'][mode],
    subtle: designColors['fg-subtle'][mode],
    keyword: designColors['code-keyword'][mode],
    string: designColors['code-string'][mode],
    tag: designColors['code-tag'][mode],
    attr: designColors['code-attr'][mode],
    bg: designColors['bg-code'][mode],
  };
}

function createTheme(mode: Mode): ThemeRegistration {
  const c = palette(mode);
  return {
    name: `leve-${mode}`,
    type: mode,
    colors: { 'editor.foreground': c.fg, 'editor.background': c.bg },
    settings: [
      { settings: { foreground: c.fg } },
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.subtle } },
      {
        scope: [
          'keyword',
          'storage',
          'storage.type',
          'storage.modifier',
          'constant.language',
          'variable.language.this',
        ],
        settings: { foreground: c.keyword },
      },
      {
        scope: [
          'string',
          'string.quoted',
          'string.template',
          'constant.numeric',
          'support.constant.property-value',
          'constant.other.color',
        ],
        settings: { foreground: c.string },
      },
      {
        scope: [
          'entity.name.tag',
          'support.class.component',
          'entity.other.attribute-name.class.css',
          'entity.other.attribute-name.pseudo-class.css',
          'entity.other.attribute-name.pseudo-element.css',
          'entity.other.attribute-name.id.css',
        ],
        settings: { foreground: c.tag },
      },
      {
        scope: [
          'entity.other.attribute-name',
          'support.type.property-name',
          'entity.other.attribute-name.css',
          'support.type.vendored.property-name',
        ],
        settings: { foreground: c.attr },
      },
      {
        scope: [
          'punctuation.definition.tag',
          'keyword.operator.assignment',
          'punctuation.separator.key-value',
          'punctuation.section.embedded',
        ],
        settings: { foreground: c.subtle },
      },
    ],
  };
}

export const SHIKI_THEMES = { light: createTheme('light'), dark: createTheme('dark') };
