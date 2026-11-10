import { readdirSync } from 'node:fs';
import type { Plugin, UserConfig } from '@commitlint/types';

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

// コミットメッセージは英語で書く（adr/0017）。印字可能な ASCII 文字とタブのみ許可する。
const ASCII_LINE = /^[\t\x20-\x7E]*$/;
const english: Plugin = {
  rules: {
    'header-english': ({ header }) => [
      ASCII_LINE.test(header ?? ''),
      'header must be written in English (ASCII characters only)',
    ],
    'body-english': ({ body }) => [
      (body ?? '').split('\n').every((line) => ASCII_LINE.test(line)),
      'body must be written in English (ASCII characters only)',
    ],
  },
};

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  plugins: [english],
  rules: {
    'scope-enum': [2, 'always', scopes],
    'header-max-length': [2, 'always', 100],
    'header-english': [2, 'always'],
    'body-english': [2, 'always'],
  },
};

export default config;
