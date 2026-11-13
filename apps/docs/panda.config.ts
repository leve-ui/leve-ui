import { defineConfig } from '@pandacss/dev';
import { proseGlobalCss } from './theme/prose';

export default defineConfig({
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  conditions: {
    extend: {
      dark: '.dark &, [data-theme="dark"] &, &[data-theme="dark"], &.dark',
    },
  },
  theme: {
    extend: {
      tokens: {
        fonts: {
          body: { value: 'Roboto, "Noto Sans JP", sans-serif' },
          mono: { value: '"Roboto Mono", monospace' },
        },
        colors: {
          white: { value: '#FFFFFF' },
          qwikBlue: { value: '#009dfd' },
          qwikDarkBlue: { value: '#006ce9' },
          qwikLightBlue: { value: '#daf0ff' },
          qwikPurple: { value: '#ac7ef4' },
          qwikDarkPurple: { value: '#6000ff' },
          qwikDarkPurpleBg: { value: '#151934' },
          qwik: {
            blue: { value: '#009dfd' },
            darkBlue: { value: '#006ce9' },
            lightBlue: { value: '#daf0ff' },
            purple: { value: '#ac7ef4' },
            darkPurple: { value: '#6000ff' },
            darkPurpleBg: { value: '#151934' },
          },
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            // Docs design tokens (apps/docs/design/leve-ui-docs.pen, "Foundations")
            canvas: { value: { base: '#FFFFFF', _dark: '#151934' } },
            subtle: { value: { base: '#F8FAFC', _dark: '#1B2045' } },
            muted: { value: { base: '#F1F5F9', _dark: '#252C5A' } },
            code: { value: { base: '#F8FAFC', _dark: '#10132A' } },
            surface: {
              value: {
                base: '{colors.white}',
                _dark: '#20264b',
              },
            },
            surfaceSubtle: {
              value: {
                base: '#f1f5f9',
                _dark: '#293262',
              },
            },
            card: {
              value: {
                base: '{colors.white}',
                _dark: '#222950',
              },
            },
            cardSubtle: {
              value: {
                base: '#f8fafc',
                _dark: '#2b3363',
              },
            },
            cardWhite: {
              value: {
                base: '{colors.white}',
                _dark: '{colors.white}',
              },
            },
            header: {
              value: {
                base: 'rgba(255, 255, 255, 0.85)',
                _dark: 'rgba(21, 25, 52, 0.85)',
              },
            },
            modal: {
              value: {
                base: '{colors.white}',
                _dark: '{colors.qwik.darkPurpleBg}',
              },
            },
          },
          fg: {
            default: { value: { base: '#0F172A', _dark: '#FFFFFF' } },
            DEFAULT: {
              value: {
                base: '#0f172a',
                _dark: '{colors.white}',
              },
            },
            muted: { value: { base: '#475569', _dark: '#C9DDF0' } },
            subtle: { value: { base: '#64748B', _dark: '#8FA3C7' } },
            cardWhite: {
              value: {
                base: '#0f172a',
                _dark: '#0f172a',
              },
            },
            cardWhiteMuted: {
              value: {
                base: '#475569',
                _dark: '#475569',
              },
            },
          },
          border: {
            default: { value: { base: '#E2E8F0', _dark: '#FFFFFF1F' } },
            DEFAULT: {
              value: {
                base: '#e2e8f0',
                _dark: 'rgba(255, 255, 255, 0.12)',
              },
            },
            subtle: { value: { base: '#F1F5F9', _dark: '#FFFFFF14' } },
            card: {
              value: {
                base: '#e2e8f0',
                _dark: 'rgba(255, 255, 255, 0.18)',
              },
            },
            cardGlow: {
              value: {
                base: 'rgba(0, 157, 253, 0.3)',
                _dark: 'rgba(0, 157, 253, 0.45)',
              },
            },
          },
          accent: {
            default: { value: '#009DFD' },
            text: { value: { base: '#006CE9', _dark: '#4CB8FF' } },
            subtle: { value: { base: '#DAF0FF', _dark: '#009DFD26' } },
            fg: { value: '#FFFFFF' },
          },
          secondary: {
            default: { value: { base: '#6000FF', _dark: '#AC7EF4' } },
            subtle: { value: { base: '#F1E9FF', _dark: '#AC7EF426' } },
          },
          brand: {
            primary: { value: '{colors.qwik.blue}' },
            primaryDark: { value: '{colors.qwik.darkBlue}' },
            primaryLight: { value: '{colors.qwik.lightBlue}' },
            accent: { value: '{colors.qwik.purple}' },
            accentDark: { value: '{colors.qwik.darkPurple}' },
            bgDark: { value: '{colors.qwik.darkPurpleBg}' },
          },
        },
        shadows: {
          card: {
            value: {
              base: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
              _dark: '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            },
          },
          cardHover: {
            value: {
              base: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              _dark: '0 12px 30px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 157, 253, 0.45)',
            },
          },
        },
      },
    },
  },
  globalCss: proseGlobalCss,
  outdir: 'styled-system',
});
