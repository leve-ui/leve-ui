import { qwikVite } from '@builder.io/qwik/optimizer';
import { sourceResolveConfig } from '@leve-ui/vite-config';
import { defineConfig, mergeConfig } from 'vite';

// Storybook (builder-vite) はこの設定を読み込みます。
// Storybook はクライアント側で描画するため CSR モードで Qwik optimizer を適用します
export default defineConfig(
  mergeConfig(sourceResolveConfig(), {
    plugins: [qwikVite({ csr: true, srcDir: 'stories' })],
  }),
);
