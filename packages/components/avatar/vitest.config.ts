import { qwikVite } from '@builder.io/qwik/optimizer';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [qwikVite()],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
