import { defineConfig, devices } from '@playwright/test';

// 開発用 Storybook (6006) と衝突しないよう専用ポートを使用
const PORT = Number(process.env.E2E_PORT ?? 6106);
const isCI = !!process.env.CI;
// E2E_STATIC=1 serves the static Storybook build instead of the dev server (used in CI): the dev
// server compiles each story on its first visit, which made the first tests time out
const isStatic = !!process.env.E2E_STATIC;

/**
 * Storybook に対して E2E テストを実行します。
 * 各ストーリーは /iframe.html?id=<story-id> で単体表示できます。
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    // Every test runs in the three engines: native <dialog>, popover and focus behave
    // differently between them (adr/0029). CI runs one job per project.
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: isStatic
      ? `node serve-static.mjs ${PORT}`
      : `pnpm --filter @leve-ui/storybook exec storybook dev -p ${PORT} --ci --no-open`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
