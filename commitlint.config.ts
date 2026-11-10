import { readdirSync } from 'node:fs';
import type { UserConfig } from '@commitlint/types';

const listDirs = (path: string) =>
  readdirSync(new URL(path, import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

/**
 * scope はモノレポのディレクトリ名から自動生成します。
 * コンポーネントを追加すると、そのディレクトリ名が scope として使えるようになります。
 */
const scopes = [
  ...listDirs('./packages/components'), // avatar, ...
  'levis-ui',
  'utils',
  ...listDirs('./apps'), // docs, storybook, e2e
  ...listDirs('./tooling'), // tsconfig, vite-config
  'repo', // ルート設定・モノレポ全体
  'deps', // 依存関係の更新
  'release', // changeset によるリリース
  'ai', // AGENTS.md / .agents / .claude 配下
  'adr', // adr 配下
];

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', scopes],
    'header-max-length': [2, 'always', 100],
    // 日本語の subject を許可するため大文字小文字のルールは無効化
    'subject-case': [0],
  },
};

export default config;
