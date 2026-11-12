import { isBrowser } from './env';

interface SavedStyle {
  value: string;
  priority: string;
}

let lockCount = 0;
let savedOverflow: SavedStyle | null = null;
let savedPaddingRight: SavedStyle | null = null;

/**
 * ページのスクロールをロックし、ロックを解除する関数を返します。
 *
 * ロックは参照カウント方式で管理され、ネストした呼び出しに対応します。
 * 最初のロック時に `<html>` 要素に `overflow: hidden` およびスクロールバー幅に応じた `padding-right`
 * をインラインスタイルとして設定し、`data-leve-scroll-locked=""` 属性を付与します。
 * すべてのロックが解除されたときに元のインラインスタイルと属性が復元されます。
 *
 * 解除関数はべき等であり、複数回呼び出しても安全です。
 * SSR 環境（`isBrowser` が false）では何も行わない解除関数を返し、カウントは 0 のまま維持します。
 *
 * @returns スクロールロックを解除するべき等な関数
 */
export const lockScroll = (): (() => void) => {
  if (!isBrowser) {
    return () => {};
  }

  const html = document.documentElement;
  if (!html) {
    return () => {};
  }

  if (lockCount === 0) {
    // 既存のインラインスタイル（priority を含む）を正確に復元できるよう退避する
    savedOverflow = {
      value: html.style.getPropertyValue('overflow'),
      priority: html.style.getPropertyPriority?.('overflow') ?? '',
    };
    savedPaddingRight = {
      value: html.style.getPropertyValue('padding-right'),
      priority: html.style.getPropertyPriority?.('padding-right') ?? '',
    };

    const innerWidth = typeof window.innerWidth === 'number' ? window.innerWidth : 0;
    const clientWidth = typeof html.clientWidth === 'number' ? html.clientWidth : 0;
    const scrollbarWidth = Math.max(0, innerWidth - clientWidth);

    const computed =
      typeof window.getComputedStyle === 'function' ? window.getComputedStyle(html) : null;
    const scrollbarGutter = (
      computed?.getPropertyValue('scrollbar-gutter') ||
      (computed as unknown as { scrollbarGutter?: string } | null)?.scrollbarGutter ||
      ''
    ).trim();
    const isStableGutter = scrollbarGutter.startsWith('stable');

    // スクロールバー非表示に伴うレイアウトシフト（ガタつき）を防ぐため、padding-right を補正する。
    // 機能上不可欠な最小限のインラインスタイル例外（.agents/rules/component-architecture.md 参照）。
    if (!isStableGutter && scrollbarWidth > 0) {
      const originalComputedPaddingRight =
        computed?.getPropertyValue('padding-right') ||
        (computed as unknown as { paddingRight?: string } | null)?.paddingRight ||
        '0px';
      html.style.setProperty(
        'padding-right',
        `calc(${originalComputedPaddingRight} + ${scrollbarWidth}px)`,
      );
    }

    // ページのスクロールを抑止するためのインラインスタイル例外（.agents/rules/component-architecture.md 参照）。
    html.style.setProperty('overflow', 'hidden');
    html.setAttribute('data-leve-scroll-locked', '');
  }

  lockCount++;
  let unlocked = false;

  return () => {
    if (unlocked) {
      return;
    }
    unlocked = true;
    lockCount--;

    if (lockCount === 0) {
      const currentHtml = document.documentElement;
      if (currentHtml) {
        if (savedOverflow) {
          if (savedOverflow.value) {
            currentHtml.style.setProperty('overflow', savedOverflow.value, savedOverflow.priority);
          } else {
            currentHtml.style.removeProperty('overflow');
          }
          savedOverflow = null;
        }

        if (savedPaddingRight) {
          if (savedPaddingRight.value) {
            currentHtml.style.setProperty(
              'padding-right',
              savedPaddingRight.value,
              savedPaddingRight.priority,
            );
          } else {
            currentHtml.style.removeProperty('padding-right');
          }
          savedPaddingRight = null;
        }

        currentHtml.removeAttribute('data-leve-scroll-locked');
      }
    }
  };
};

/**
 * 現在アクティブなスクロールロックの数を返します（テストおよびデバッグ用）。
 */
export const getScrollLockCount = (): number => lockCount;
