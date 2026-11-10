import type { UserConfig } from 'vite';

export interface LibraryPackageJson {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/**
 * Qwik ライブラリパッケージ共通の Vite 設定を生成します。
 * dependencies / peerDependencies はバンドルせず external にします。
 */
export function defineLibraryConfig(pkg: LibraryPackageJson, overrides?: UserConfig): UserConfig;

/**
 * アプリ（docs / storybook）で workspace パッケージを src から直接解決するための設定。
 */
export const SOURCE_CONDITION: '@leve-ui/source';
export function sourceResolveConfig(): Pick<UserConfig, 'resolve' | 'ssr'>;
