import { createDOM } from '@builder.io/qwik/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { screen } = await createDOM();
(globalThis as unknown as { document: Document }).document =
  screen.ownerDocument as unknown as Document;
(globalThis as unknown as { window: unknown }).window = (
  screen.ownerDocument as unknown as { defaultView: unknown }
).defaultView;

if (typeof (window as unknown as { getComputedStyle?: unknown }).getComputedStyle !== 'function') {
  (window as unknown as { getComputedStyle: unknown }).getComputedStyle = () =>
    ({
      getPropertyValue: () => '',
      paddingRight: '',
      scrollbarGutter: '',
    }) as unknown as CSSStyleDeclaration;
}

const { getScrollLockCount, lockScroll } = await import('./scroll-lock');

describe('scroll-lock', () => {
  const activeUnlocks: (() => void)[] = [];

  function lock(): () => void {
    const unlock = lockScroll();
    activeUnlocks.push(unlock);
    return unlock;
  }

  afterEach(() => {
    while (activeUnlocks.length > 0) {
      const unlock = activeUnlocks.pop();
      unlock?.();
    }
    document.documentElement.removeAttribute('data-leve-scroll-locked');
    document.documentElement.removeAttribute('style');
    Object.defineProperty(window, 'innerWidth', { value: 0, configurable: true, writable: true });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 0,
      configurable: true,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  it('最初のロックで html に overflow: hidden と data-leve-scroll-locked が付与され、アンロックで復元される', () => {
    expect(document.documentElement.hasAttribute('data-leve-scroll-locked')).toBe(false);
    expect(document.documentElement.style.getPropertyValue('overflow')).toBe('');

    const unlock = lock();

    expect(document.documentElement.style.getPropertyValue('overflow')).toBe('hidden');
    expect(document.documentElement.hasAttribute('data-leve-scroll-locked')).toBe(true);
    expect(getScrollLockCount()).toBe(1);

    unlock();

    expect(document.documentElement.style.getPropertyValue('overflow')).toBe('');
    expect(document.documentElement.hasAttribute('data-leve-scroll-locked')).toBe(false);
    expect(getScrollLockCount()).toBe(0);
  });

  it('ネストしたロックでは最後のアンロックでスタイルが復元され、getScrollLockCount でカウントできる', () => {
    expect(getScrollLockCount()).toBe(0);

    const unlock1 = lock();
    expect(getScrollLockCount()).toBe(1);
    expect(document.documentElement.style.getPropertyValue('overflow')).toBe('hidden');
    expect(document.documentElement.hasAttribute('data-leve-scroll-locked')).toBe(true);

    const unlock2 = lock();
    expect(getScrollLockCount()).toBe(2);

    // 1 回目のアンロックではまだロック状態が維持される
    unlock1();
    expect(getScrollLockCount()).toBe(1);
    expect(document.documentElement.style.getPropertyValue('overflow')).toBe('hidden');
    expect(document.documentElement.hasAttribute('data-leve-scroll-locked')).toBe(true);

    // 2 回目のアンロックですべて解除され、復元される
    unlock2();
    expect(getScrollLockCount()).toBe(0);
    expect(document.documentElement.style.getPropertyValue('overflow')).toBe('');
    expect(document.documentElement.hasAttribute('data-leve-scroll-locked')).toBe(false);
  });

  it('アンロック関数はべき等であり、複数回呼び出しても他のロックを解除しない', () => {
    const unlock1 = lock();
    const unlock2 = lock();
    expect(getScrollLockCount()).toBe(2);

    unlock1();
    expect(getScrollLockCount()).toBe(1);

    // 2 回目の呼び出しは無視される
    unlock1();
    expect(getScrollLockCount()).toBe(1);
    expect(document.documentElement.style.getPropertyValue('overflow')).toBe('hidden');

    unlock2();
    expect(getScrollLockCount()).toBe(0);
    expect(document.documentElement.style.getPropertyValue('overflow')).toBe('');
  });

  it('既存のインライン overflow および padding-right（priority を含む）が正確に復元される', () => {
    const html = document.documentElement;
    html.style.setProperty('overflow', 'scroll', 'important');
    html.style.setProperty('padding-right', '20px');

    expect(html.style.getPropertyValue('overflow')).toBe('scroll');
    expect(html.style.getPropertyPriority('overflow')).toBe('important');
    expect(html.style.getPropertyValue('padding-right')).toBe('20px');

    const unlock = lock();

    expect(html.style.getPropertyValue('overflow')).toBe('hidden');
    expect(html.hasAttribute('data-leve-scroll-locked')).toBe(true);

    unlock();

    expect(html.style.getPropertyValue('overflow')).toBe('scroll');
    expect(html.style.getPropertyPriority('overflow')).toBe('important');
    expect(html.style.getPropertyValue('padding-right')).toBe('20px');
    expect(html.style.getPropertyPriority('padding-right')).toBe('');
  });

  it('スクロールバー幅がある場合は padding-right が補正され、幅 0 の場合は補正されない', () => {
    const html = document.documentElement;

    // width = 15 のケース
    Object.defineProperty(window, 'innerWidth', {
      value: 1015,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(html, 'clientWidth', {
      value: 1000,
      configurable: true,
      writable: true,
    });

    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
      return {
        getPropertyValue: (prop: string) => {
          if (prop === 'padding-right') return '10px';
          if (prop === 'scrollbar-gutter') return 'auto';
          return '';
        },
        paddingRight: '10px',
        scrollbarGutter: 'auto',
      } as unknown as CSSStyleDeclaration;
    });

    const unlock1 = lock();
    expect(html.style.getPropertyValue('padding-right')).toContain('15px');
    expect(html.style.getPropertyValue('padding-right')).toBe('calc(10px + 15px)');

    unlock1();
    expect(html.style.getPropertyValue('padding-right')).toBe('');

    // width = 0 のケース
    Object.defineProperty(window, 'innerWidth', {
      value: 1000,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(html, 'clientWidth', {
      value: 1000,
      configurable: true,
      writable: true,
    });

    const unlock2 = lock();
    expect(html.style.getPropertyValue('padding-right')).toBe('');

    unlock2();
    expect(html.style.getPropertyValue('padding-right')).toBe('');
  });

  it('scrollbar-gutter が stable の場合はスクロールバー幅があっても padding-right を補正しない', () => {
    const html = document.documentElement;

    Object.defineProperty(window, 'innerWidth', {
      value: 1015,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(html, 'clientWidth', {
      value: 1000,
      configurable: true,
      writable: true,
    });

    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
      return {
        getPropertyValue: (prop: string) => {
          if (prop === 'scrollbar-gutter') return 'stable';
          if (prop === 'padding-right') return '0px';
          return '';
        },
        scrollbarGutter: 'stable',
        paddingRight: '0px',
      } as unknown as CSSStyleDeclaration;
    });

    const unlock = lock();
    expect(html.style.getPropertyValue('overflow')).toBe('hidden');
    expect(html.style.getPropertyValue('padding-right')).toBe('');

    unlock();
    expect(html.style.getPropertyValue('overflow')).toBe('');
  });

  it('scrollbar-gutter が stable both-edges の場合も padding-right を補正しない', () => {
    const html = document.documentElement;

    Object.defineProperty(window, 'innerWidth', {
      value: 1015,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(html, 'clientWidth', {
      value: 1000,
      configurable: true,
      writable: true,
    });

    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
      return {
        getPropertyValue: (prop: string) => {
          if (prop === 'scrollbar-gutter') return 'stable both-edges';
          return '';
        },
        scrollbarGutter: 'stable both-edges',
      } as unknown as CSSStyleDeclaration;
    });

    const unlock = lock();
    expect(html.style.getPropertyValue('padding-right')).toBe('');

    unlock();
  });

  describe('SSR (isBrowser: false)', () => {
    it('isBrowser が false のときは no-op 解除関数を返しカウントを 0 に保つ (サーバーセーフ)', async () => {
      vi.resetModules();
      vi.doMock('./env', () => ({ isBrowser: false }));
      const { lockScroll: ssrLockScroll, getScrollLockCount: ssrGetScrollLockCount } = await import(
        './scroll-lock'
      );

      const unlock = ssrLockScroll();
      expect(ssrGetScrollLockCount()).toBe(0);
      expect(() => unlock()).not.toThrow();

      vi.doUnmock('./env');
      vi.resetModules();
    });
  });
});
