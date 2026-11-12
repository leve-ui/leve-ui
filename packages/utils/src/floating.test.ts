import { createDOM } from '@builder.io/qwik/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FloatingAlign, FloatingOptions, FloatingResult, FloatingSide } from './floating';

const { screen } = await createDOM();
const doc = screen.ownerDocument as unknown as Document;
(globalThis as unknown as { document: Document }).document = doc;
const win = (screen.ownerDocument as unknown as { defaultView: Window }).defaultView;
(globalThis as unknown as { window: Window }).window = win;

// DOM mocks required by Floating UI in Node environment
const div = doc.createElement('div');
const HTMLElementClass = Object.getPrototypeOf(div).constructor;
(globalThis as unknown as { HTMLElement: unknown }).HTMLElement = HTMLElementClass;
(globalThis as unknown as { Element: unknown }).Element = Object.getPrototypeOf(
  HTMLElementClass.prototype,
).constructor;
(globalThis as unknown as { Node: unknown }).Node = Object.getPrototypeOf(
  (globalThis as unknown as { Element: { prototype: unknown } }).Element.prototype,
).constructor;
(win as unknown as { HTMLElement: unknown }).HTMLElement = HTMLElementClass;
(win as unknown as { Element: unknown }).Element = (
  globalThis as unknown as { Element: unknown }
).Element;
(win as unknown as { Node: unknown }).Node = (globalThis as unknown as { Node: unknown }).Node;

Object.defineProperty(win, 'scrollX', { value: 0, configurable: true, writable: true });
Object.defineProperty(win, 'scrollY', { value: 0, configurable: true, writable: true });
Object.defineProperty(win, 'innerWidth', { value: 1024, configurable: true, writable: true });
Object.defineProperty(win, 'innerHeight', { value: 800, configurable: true, writable: true });

doc.documentElement.scrollLeft = 0;
doc.documentElement.scrollTop = 0;
(doc.documentElement as unknown as { clientWidth: number }).clientWidth = 1024;
(doc.documentElement as unknown as { clientHeight: number }).clientHeight = 800;

function getComputedStyleMock(el: Element): CSSStyleDeclaration {
  return ((el as HTMLElement).style || {
    getPropertyValue: () => '',
  }) as unknown as CSSStyleDeclaration;
}
win.getComputedStyle = getComputedStyleMock;
(globalThis as unknown as { getComputedStyle: unknown }).getComputedStyle = getComputedStyleMock;

if (!doc.documentElement.getBoundingClientRect) {
  doc.documentElement.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 800,
      right: 1024,
      width: 1024,
      height: 800,
      toJSON: () => {},
    }) as DOMRect;
}

// Domino's CSSStyleDeclaration does not support custom properties (--*) in its parser.
// Wrap doc.createElement to polyfill custom property support for tests.
const origCreateElement = doc.createElement.bind(doc);
doc.createElement = ((tagName: string, options?: ElementCreationOptions) => {
  const el = origCreateElement(tagName, options);
  const origStyle = el.style as unknown as {
    _parsed: { property: Record<string, string>; priority: Record<string, string> };
    _serialize: () => void;
    removeProperty: (p: string) => void;
    setProperty: (p: string, v: string) => void;
  };
  const proxy = new Proxy(origStyle, {
    get(target, prop, receiver) {
      if (prop === 'setProperty') {
        return (property: string, value: string) => {
          if (property.startsWith('--')) {
            if (value === '') {
              target.removeProperty(property);
              return;
            }
            target._parsed.property[property] = String(value);
            target._serialize();
            return;
          }
          return target.setProperty(property, value);
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });
  Object.defineProperty(el, 'style', {
    get: () => proxy,
    configurable: true,
  });
  return el;
}) as typeof doc.createElement;

const { autoUpdateSpy, autoUpdateCleanupSpy } = vi.hoisted(() => ({
  autoUpdateSpy: vi.fn(),
  autoUpdateCleanupSpy: vi.fn(),
}));

vi.mock('@floating-ui/dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@floating-ui/dom')>();
  return {
    ...actual,
    autoUpdate: (
      reference: Parameters<typeof actual.autoUpdate>[0],
      floating: Parameters<typeof actual.autoUpdate>[1],
      update: Parameters<typeof actual.autoUpdate>[2],
      options?: Parameters<typeof actual.autoUpdate>[3],
    ) => {
      autoUpdateSpy(reference, floating, update, options);
      const cleanup = actual.autoUpdate(reference, floating, update, options);
      return () => {
        autoUpdateCleanupSpy();
        cleanup();
      };
    },
  };
});

const { applyFloating, computeFloating, fromPlacement, startFloating, toPlacement } = await import(
  './floating'
);

describe('floating utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toPlacement / fromPlacement', () => {
    const sides: FloatingSide[] = ['top', 'right', 'bottom', 'left'];
    const aligns: FloatingAlign[] = ['start', 'center', 'end'];

    it('全 12 パターンの相互変換（ラウンドトリップ）が正しく動作する', () => {
      for (const side of sides) {
        for (const align of aligns) {
          const placement = toPlacement(side, align);
          const parsed = fromPlacement(placement);
          expect(parsed).toEqual({ side, align });
        }
      }
    });

    it('主要な placement の変換が正しい値を返す', () => {
      expect(toPlacement('bottom', 'center')).toBe('bottom');
      expect(toPlacement('top', 'start')).toBe('top-start');
      expect(toPlacement('right', 'end')).toBe('right-end');
      expect(fromPlacement('top-end')).toEqual({ side: 'top', align: 'end' });
      expect(fromPlacement('left')).toEqual({ side: 'left', align: 'center' });
      expect(fromPlacement('bottom-start')).toEqual({
        side: 'bottom',
        align: 'start',
      });
    });
  });

  describe('applyFloating', () => {
    it('floating 要素に position, left/top(丸め値), data 属性, CSS 変数を設定し、既存のインラインスタイルを保持する', () => {
      const floating = doc.createElement('div');
      floating.style.setProperty('color', 'red');
      floating.style.setProperty('z-index', '50');

      const result: FloatingResult = {
        x: 104.4,
        y: 205.6,
        side: 'bottom',
        align: 'center',
        anchorWidth: 120,
        anchorHeight: 40,
        availableWidth: 320,
        availableHeight: 500,
      };

      applyFloating(floating, result, { cssVarPrefix: '--leve-popover' });

      expect(floating.style.position).toBe('fixed');
      expect(floating.style.left).toBe('104px');
      expect(floating.style.top).toBe('206px');
      expect(floating.style.color).toBe('red');
      expect(floating.style.zIndex).toBe('50');

      expect(floating.getAttribute('data-side')).toBe('bottom');
      expect(floating.getAttribute('data-align')).toBe('center');

      expect(floating.style.getPropertyValue('--leve-popover-anchor-width')).toBe('120px');
      expect(floating.style.getPropertyValue('--leve-popover-anchor-height')).toBe('40px');
      expect(floating.style.getPropertyValue('--leve-popover-available-width')).toBe('320px');
      expect(floating.style.getPropertyValue('--leve-popover-available-height')).toBe('500px');
    });

    it('arrow 要素に position: absolute, offset, static side: 0, data-side を設定する', () => {
      const floating = doc.createElement('div');
      const arrow = doc.createElement('div');
      arrow.style.setProperty('background-color', 'white');

      const result: FloatingResult = {
        x: 100,
        y: 200,
        side: 'bottom',
        align: 'center',
        arrowX: 35,
        anchorWidth: 100,
        anchorHeight: 40,
        availableWidth: 300,
        availableHeight: 400,
      };

      applyFloating(floating, result, {
        arrow,
        cssVarPrefix: '--leve-popover',
      });

      expect(arrow.style.position).toBe('absolute');
      expect(arrow.style.left).toBe('35px');
      expect(arrow.style.top).toBe('0');
      expect(arrow.style.right).toBe('');
      expect(arrow.style.bottom).toBe('');
      expect(arrow.getAttribute('data-side')).toBe('bottom');
      expect(arrow.style.backgroundColor).toBe('white');
    });

    it('side を bottom から top に切り替えた際、古い static side がクリアされる', () => {
      const floating = doc.createElement('div');
      const arrow = doc.createElement('div');

      const bottomResult: FloatingResult = {
        x: 100,
        y: 200,
        side: 'bottom',
        align: 'center',
        arrowX: 35,
        anchorWidth: 100,
        anchorHeight: 40,
        availableWidth: 300,
        availableHeight: 400,
      };

      applyFloating(floating, bottomResult, {
        arrow,
        cssVarPrefix: '--leve-popover',
      });
      expect(arrow.style.top).toBe('0');
      expect(arrow.style.bottom).toBe('');
      expect(arrow.getAttribute('data-side')).toBe('bottom');

      const topResult: FloatingResult = {
        x: 100,
        y: 50,
        side: 'top',
        align: 'center',
        arrowX: 35,
        anchorWidth: 100,
        anchorHeight: 40,
        availableWidth: 300,
        availableHeight: 400,
      };

      applyFloating(floating, topResult, {
        arrow,
        cssVarPrefix: '--leve-popover',
      });
      expect(arrow.style.top).toBe('');
      expect(arrow.style.bottom).toBe('0');
      expect(arrow.style.left).toBe('35px');
      expect(arrow.getAttribute('data-side')).toBe('top');
    });

    it('side が right / left のとき arrowY を top に設定し、static side を設定する', () => {
      const floating = doc.createElement('div');
      const arrow = doc.createElement('div');

      const rightResult: FloatingResult = {
        x: 200,
        y: 100,
        side: 'right',
        align: 'center',
        arrowY: 20,
        anchorWidth: 40,
        anchorHeight: 40,
        availableWidth: 300,
        availableHeight: 400,
      };

      applyFloating(floating, rightResult, {
        arrow,
        cssVarPrefix: '--leve-popover',
      });
      expect(arrow.style.left).toBe('0');
      expect(arrow.style.top).toBe('20px');
      expect(arrow.style.right).toBe('');
      expect(arrow.style.bottom).toBe('');
      expect(arrow.getAttribute('data-side')).toBe('right');
    });
  });

  describe('computeFloating', () => {
    function createElements() {
      const anchor = doc.createElement('div');
      const floating = doc.createElement('div');

      anchor.getBoundingClientRect = () =>
        ({
          x: 100,
          y: 100,
          top: 100,
          left: 100,
          bottom: 140,
          right: 200,
          width: 100,
          height: 40,
          toJSON: () => {},
        }) as DOMRect;

      floating.getBoundingClientRect = () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 50,
          right: 80,
          width: 80,
          height: 50,
          toJSON: () => {},
        }) as DOMRect;
      (floating as unknown as { offsetWidth: number }).offsetWidth = 80;
      (floating as unknown as { offsetHeight: number }).offsetHeight = 50;

      doc.body.appendChild(anchor);
      doc.body.appendChild(floating);

      return { anchor, floating };
    }

    it('bottom / center で sideOffset を反映してアンカーの下側に配置される', async () => {
      const { anchor, floating } = createElements();

      const result = await computeFloating(anchor, floating, {
        side: 'bottom',
        align: 'center',
        sideOffset: 10,
        cssVarPrefix: '--leve-popover',
      });

      expect(result.side).toBe('bottom');
      expect(result.align).toBe('center');
      // anchor: y=100, height=40 => bottom edge 140 + sideOffset 10 = 150
      expect(result.y).toBe(150);
      // anchor: x=100, width=100 => center 150 - floating half width 40 = 110
      expect(result.x).toBe(110);
      expect(result.anchorWidth).toBe(100);
      expect(result.anchorHeight).toBe(40);
      expect(result.availableWidth).toBeGreaterThan(0);
      expect(result.availableHeight).toBeGreaterThan(0);
    });

    it('align: start で左端が揃う', async () => {
      const { anchor, floating } = createElements();

      const result = await computeFloating(anchor, floating, {
        side: 'bottom',
        align: 'start',
        sideOffset: 8,
        cssVarPrefix: '--leve-popover',
      });

      expect(result.side).toBe('bottom');
      expect(result.align).toBe('start');
      expect(result.x).toBe(100);
      expect(result.y).toBe(148);
    });

    it('下側にスペースがなく avoidCollisions が true のとき top に反転する', async () => {
      const anchor = doc.createElement('div');
      const floating = doc.createElement('div');

      anchor.getBoundingClientRect = () =>
        ({
          x: 100,
          y: 700,
          top: 700,
          left: 100,
          bottom: 740,
          right: 200,
          width: 100,
          height: 40,
          toJSON: () => {},
        }) as DOMRect;

      floating.getBoundingClientRect = () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 120,
          right: 80,
          width: 80,
          height: 120,
          toJSON: () => {},
        }) as DOMRect;
      (floating as unknown as { offsetWidth: number }).offsetWidth = 80;
      (floating as unknown as { offsetHeight: number }).offsetHeight = 120;

      doc.body.appendChild(anchor);
      doc.body.appendChild(floating);

      const result = await computeFloating(anchor, floating, {
        side: 'bottom',
        align: 'center',
        sideOffset: 8,
        avoidCollisions: true,
        cssVarPrefix: '--leve-popover',
      });

      expect(result.side).toBe('top');
      // anchor y=700 - sideOffset 8 - floating height 120 = 572
      expect(result.y).toBe(572);
    });

    it('下側にスペースがなくても avoidCollisions が false のときは bottom のままになる', async () => {
      const anchor = doc.createElement('div');
      const floating = doc.createElement('div');

      anchor.getBoundingClientRect = () =>
        ({
          x: 100,
          y: 700,
          top: 700,
          left: 100,
          bottom: 740,
          right: 200,
          width: 100,
          height: 40,
          toJSON: () => {},
        }) as DOMRect;

      floating.getBoundingClientRect = () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 120,
          right: 80,
          width: 80,
          height: 120,
          toJSON: () => {},
        }) as DOMRect;
      (floating as unknown as { offsetWidth: number }).offsetWidth = 80;
      (floating as unknown as { offsetHeight: number }).offsetHeight = 120;

      doc.body.appendChild(anchor);
      doc.body.appendChild(floating);

      const result = await computeFloating(anchor, floating, {
        side: 'bottom',
        align: 'center',
        sideOffset: 8,
        avoidCollisions: false,
        cssVarPrefix: '--leve-popover',
      });

      expect(result.side).toBe('bottom');
      // anchor bottom 740 + sideOffset 8 = 748
      expect(result.y).toBe(748);
    });

    it('arrow 要素が指定された場合、arrowX が計算される', async () => {
      const { anchor, floating } = createElements();
      const arrow = doc.createElement('div');
      arrow.getBoundingClientRect = () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 10,
          right: 10,
          width: 10,
          height: 10,
          toJSON: () => {},
        }) as DOMRect;
      (arrow as unknown as { offsetWidth: number }).offsetWidth = 10;
      (arrow as unknown as { offsetHeight: number }).offsetHeight = 10;
      floating.appendChild(arrow);

      const result = await computeFloating(anchor, floating, {
        side: 'bottom',
        align: 'center',
        arrow,
        arrowPadding: 4,
        cssVarPrefix: '--leve-popover',
      });

      expect(result.arrowX).toBeDefined();
      // floating width 80, arrow width 10 => center (80 - 10) / 2 = 35
      expect(result.arrowX).toBe(35);
    });

    it('仮想要素（VirtualElement）をアンカーとして受け付ける', async () => {
      const virtualAnchor = {
        getBoundingClientRect: () =>
          ({
            x: 200,
            y: 300,
            top: 300,
            left: 200,
            bottom: 300,
            right: 200,
            width: 0,
            height: 0,
            toJSON: () => {},
          }) as DOMRect,
      };

      const floating = doc.createElement('div');
      floating.getBoundingClientRect = () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 40,
          right: 60,
          width: 60,
          height: 40,
          toJSON: () => {},
        }) as DOMRect;
      (floating as unknown as { offsetWidth: number }).offsetWidth = 60;
      (floating as unknown as { offsetHeight: number }).offsetHeight = 40;
      doc.body.appendChild(floating);

      const result = await computeFloating(virtualAnchor, floating, {
        side: 'bottom',
        align: 'center',
        cssVarPrefix: '--leve-popover',
      });

      expect(result.x).toBe(170); // 200 - 30
      expect(result.y).toBe(300);
      expect(result.anchorWidth).toBe(0);
      expect(result.anchorHeight).toBe(0);
    });
  });

  describe('startFloating', () => {
    it('autoUpdate を呼び出し、onUpdate に計算結果を渡し、クリーンアップ関数は複数回呼んでも autoUpdate のクリーンアップを 1 回だけ呼ぶ', async () => {
      const anchor = doc.createElement('div');
      const floating = doc.createElement('div');

      anchor.getBoundingClientRect = () =>
        ({
          x: 100,
          y: 100,
          top: 100,
          left: 100,
          bottom: 140,
          right: 200,
          width: 100,
          height: 40,
          toJSON: () => {},
        }) as DOMRect;

      floating.getBoundingClientRect = () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 50,
          right: 80,
          width: 80,
          height: 50,
          toJSON: () => {},
        }) as DOMRect;
      (floating as unknown as { offsetWidth: number }).offsetWidth = 80;
      (floating as unknown as { offsetHeight: number }).offsetHeight = 50;

      doc.body.appendChild(anchor);
      doc.body.appendChild(floating);

      const onUpdate = vi.fn();
      const options: FloatingOptions & {
        onUpdate?: (result: FloatingResult) => void;
      } = {
        side: 'bottom',
        align: 'center',
        sideOffset: 8,
        cssVarPrefix: '--leve-popover',
        onUpdate,
      };

      const cleanup = startFloating(anchor, floating, options);

      expect(autoUpdateSpy).toHaveBeenCalledTimes(1);
      expect(autoUpdateSpy.mock.calls[0][0]).toBe(anchor);
      expect(autoUpdateSpy.mock.calls[0][1]).toBe(floating);
      expect(typeof autoUpdateSpy.mock.calls[0][2]).toBe('function');

      // 非同期更新の完了を待機
      await vi.waitFor(() => {
        expect(onUpdate).toHaveBeenCalledTimes(1);
      });

      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          side: 'bottom',
          align: 'center',
          y: 148,
          x: 110,
        }),
      );
      expect(floating.style.position).toBe('fixed');
      expect(floating.style.left).toBe('110px');
      expect(floating.style.top).toBe('148px');

      // クリーンアップの呼び出し（べき等性テスト）
      cleanup();
      expect(autoUpdateCleanupSpy).toHaveBeenCalledTimes(1);

      cleanup();
      expect(autoUpdateCleanupSpy).toHaveBeenCalledTimes(1);
    });
  });
});
