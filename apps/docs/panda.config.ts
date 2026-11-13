import { defineConfig } from '@pandacss/dev';
import { proseGlobalCss } from './theme/prose';
import { designFonts, designRadii, designSemanticColors } from './theme/tokens';

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
        // Same names as the design variables (theme/tokens.ts)
        fonts: designFonts,
        radii: designRadii,
      },
      semanticTokens: {
        colors: {
          ...designSemanticColors,
        },
      },
    },
  },
  globalCss: proseGlobalCss,
  outdir: 'styled-system',
});
