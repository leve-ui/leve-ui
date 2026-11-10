import { defineConfig, devices } from '@playwright/test';

// 開発用 Storybook (6006) と衝突しないよう専用ポートを使用
const PORT = Number(process.env.E2E_PORT ?? 6106);
const isCI = !!process.env.CI;

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
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm --filter @levis-ui/storybook exec storybook dev -p ${PORT} --ci --no-open`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
