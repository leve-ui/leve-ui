import { qwikVite } from '@builder.io/qwik/optimizer';
import { sourceResolveConfig } from '@leve-ui/vite-config';
import { defineConfig, mergeConfig } from 'vite';

// Storybook (builder-vite) はこの設定を読み込みます。
// Storybook はクライアント側で描画するため CSR モードで Qwik optimizer を適用します
export default defineConfig(
  mergeConfig(sourceResolveConfig(), {
    plugins: [qwikVite({ csr: true, srcDir: 'stories' })],
    // 初回アクセス時の処理待ちや再最適化でストーリーの描画が遅れ、E2E が不安定になるのを防ぐため、
    // 起動時に事前バンドルしておく
    optimizeDeps: {
      include: [
        // @leve-ui/utils は src を直接読む（@leve-ui/source）ため、起動時の依存スキャンで見つからない
        '@leve-ui/accordion > @leve-ui/utils > @floating-ui/dom',
        // demo のアイコン。1MB ほどある 1 ファイルなので、初回の変換に時間がかかる
        '@qwikest/icons/lucide',
      ],
    },
  }),
);
