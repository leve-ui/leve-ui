import { defineConfig } from '@pandacss/dev';

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
            canvas: {
              value: {
                base: '#f8fafc',
                _dark: '{colors.qwik.darkPurpleBg}',
              },
            },
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
            DEFAULT: {
              value: {
                base: '#0f172a',
                _dark: '{colors.white}',
              },
            },
            muted: {
              value: {
                base: '#475569',
                _dark: '{colors.qwik.lightBlue}',
              },
            },
            subtle: {
              value: {
                base: '#94a3b8',
                _dark: 'rgba(218, 240, 255, 0.6)',
              },
            },
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
            DEFAULT: {
              value: {
                base: '#e2e8f0',
                _dark: 'rgba(255, 255, 255, 0.12)',
              },
            },
            subtle: {
              value: {
                base: 'rgba(0, 0, 0, 0.08)',
                _dark: 'rgba(255, 255, 255, 0.08)',
              },
            },
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
  outdir: 'styled-system',
});
