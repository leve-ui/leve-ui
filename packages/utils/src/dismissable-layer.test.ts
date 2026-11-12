import { createDOM } from '@builder.io/qwik/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DismissableLayer, DismissableLayerOptions } from './dismissable-layer';

const { screen } = await createDOM();
const doc = screen.ownerDocument as unknown as Document;
(globalThis as unknown as { document: Document }).document = doc;

const { createDismissableLayer } = await import('./dismissable-layer');

describe('createDismissableLayer', () => {
  let activeLayers: DismissableLayer[] = [];

  function createLayer(element: HTMLElement, options: DismissableLayerOptions): DismissableLayer {
    const layer = createDismissableLayer(element, options);
    activeLayers.push(layer);
    return layer;
  }

  function dispatchKeyDown(
    target: EventTarget,
    key: string,
    options: { isComposing?: boolean } = {},
  ): KeyboardEvent {
    let event: KeyboardEvent;
    if (typeof KeyboardEvent !== 'undefined') {
      try {
        event = new KeyboardEvent('keydown', { key, bubbles: true });
      } catch {
        event = doc.createEvent('Event') as unknown as KeyboardEvent;
        event.initEvent('keydown', true, true);
        Object.defineProperty(event, 'key', { value: key });
      }
    } else {
      event = doc.createEvent('Event') as unknown as KeyboardEvent;
      event.initEvent('keydown', true, true);
      Object.defineProperty(event, 'key', { value: key });
    }
    if (options.isComposing !== undefined) {
      Object.defineProperty(event, 'isComposing', { value: options.isComposing });
    }
    target.dispatchEvent(event as unknown as Event);
    return event;
  }

  function dispatchPointerDown(target: EventTarget): PointerEvent {
    let event: PointerEvent;
    if (typeof PointerEvent !== 'undefined') {
      try {
        event = new PointerEvent('pointerdown', { bubbles: true });
      } catch {
        event = doc.createEvent('Event') as unknown as PointerEvent;
        event.initEvent('pointerdown', true, true);
      }
    } else {
      event = doc.createEvent('Event') as unknown as PointerEvent;
      event.initEvent('pointerdown', true, true);
    }
    target.dispatchEvent(event as unknown as Event);
    return event;
  }

  function dispatchFocusIn(target: EventTarget): FocusEvent {
    let event: FocusEvent;
    if (typeof FocusEvent !== 'undefined') {
      try {
        event = new FocusEvent('focusin', { bubbles: true });
      } catch {
        event = doc.createEvent('Event') as unknown as FocusEvent;
        event.initEvent('focusin', true, true);
      }
    } else {
      event = doc.createEvent('Event') as unknown as FocusEvent;
      event.initEvent('focusin', true, true);
    }
    target.dispatchEvent(event as unknown as Event);
    return event;
  }

  afterEach(() => {
    for (const layer of activeLayers) {
      layer.destroy();
    }
    activeLayers = [];
    doc.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('Escape キーのハンドリング', () => {
    it('Escape キー押下で onEscapeKeyDown が呼ばれ、その後に onDismiss("escape-key") が呼ばれる', () => {
      const layerEl = doc.createElement('div');
      doc.body.appendChild(layerEl);
      const callOrder: string[] = [];

      createLayer(layerEl, {
        onEscapeKeyDown: (event) => {
          callOrder.push('escapeKeyDown');
          expect(event.reason).toBe('escape-key');
          expect(event.defaultPrevented).toBe(false);
        },
        onDismiss: (reason) => {
          callOrder.push(`dismiss:${reason}`);
        },
      });

      dispatchKeyDown(doc, 'Escape');

      expect(callOrder).toEqual(['escapeKeyDown', 'dismiss:escape-key']);
    });

    it('Escape 以外のキーでは onDismiss やコールバックは呼ばれない', () => {
      const layerEl = doc.createElement('div');
      doc.body.appendChild(layerEl);
      const onDismiss = vi.fn();
      const onEscapeKeyDown = vi.fn();

      createLayer(layerEl, { onDismiss, onEscapeKeyDown });

      dispatchKeyDown(doc, 'Enter');
      dispatchKeyDown(doc, 'Tab');
      dispatchKeyDown(doc, 'Space');

      expect(onEscapeKeyDown).not.toHaveBeenCalled();
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('isComposing が true のときは Escape キーでも onDismiss は呼ばれない', () => {
      const layerEl = doc.createElement('div');
      doc.body.appendChild(layerEl);
      const onDismiss = vi.fn();
      const onEscapeKeyDown = vi.fn();

      createLayer(layerEl, { onDismiss, onEscapeKeyDown });

      dispatchKeyDown(doc, 'Escape', { isComposing: true });

      expect(onEscapeKeyDown).not.toHaveBeenCalled();
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('pointerdown のハンドリング', () => {
    it('外側での pointerdown で onPointerDownOutside と onDismiss("pointer-down-outside") が呼ばれる', () => {
      const layerEl = doc.createElement('div');
      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(layerEl);
      doc.body.appendChild(outsideBtn);
      const callOrder: string[] = [];

      createLayer(layerEl, {
        onPointerDownOutside: (event) => {
          callOrder.push('pointerDownOutside');
          expect(event.reason).toBe('pointer-down-outside');
          expect(event.defaultPrevented).toBe(false);
        },
        onDismiss: (reason) => {
          callOrder.push(`dismiss:${reason}`);
        },
      });

      dispatchPointerDown(outsideBtn);

      expect(callOrder).toEqual(['pointerDownOutside', 'dismiss:pointer-down-outside']);
    });

    it('レイヤー内での pointerdown では何も呼ばれない', () => {
      const layerEl = doc.createElement('div');
      const insideBtn = doc.createElement('button');
      layerEl.appendChild(insideBtn);
      doc.body.appendChild(layerEl);
      const onDismiss = vi.fn();
      const onPointerDownOutside = vi.fn();

      createLayer(layerEl, { onDismiss, onPointerDownOutside });

      dispatchPointerDown(insideBtn);
      dispatchPointerDown(layerEl);

      expect(onPointerDownOutside).not.toHaveBeenCalled();
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('focusin のハンドリング', () => {
    it('外側への focusin で onFocusOutside と onDismiss("focus-outside") が呼ばれる', () => {
      const layerEl = doc.createElement('div');
      const outsideInput = doc.createElement('input');
      doc.body.appendChild(layerEl);
      doc.body.appendChild(outsideInput);
      const callOrder: string[] = [];

      createLayer(layerEl, {
        onFocusOutside: (event) => {
          callOrder.push('focusOutside');
          expect(event.reason).toBe('focus-outside');
          expect(event.defaultPrevented).toBe(false);
        },
        onDismiss: (reason) => {
          callOrder.push(`dismiss:${reason}`);
        },
      });

      dispatchFocusIn(outsideInput);

      expect(callOrder).toEqual(['focusOutside', 'dismiss:focus-outside']);
    });

    it('レイヤー内への focusin では何も呼ばれない', () => {
      const layerEl = doc.createElement('div');
      const insideInput = doc.createElement('input');
      layerEl.appendChild(insideInput);
      doc.body.appendChild(layerEl);
      const onDismiss = vi.fn();
      const onFocusOutside = vi.fn();

      createLayer(layerEl, { onDismiss, onFocusOutside });

      dispatchFocusIn(insideInput);
      dispatchFocusIn(layerEl);

      expect(onFocusOutside).not.toHaveBeenCalled();
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('preventDefault() による抑止', () => {
    it('各コールバックで preventDefault() を呼び出すと onDismiss は呼ばれずレイヤーは開いたままになる', () => {
      const layerEl = doc.createElement('div');
      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(layerEl);
      doc.body.appendChild(outsideBtn);
      const onDismiss = vi.fn();

      createLayer(layerEl, {
        onEscapeKeyDown: (event) => {
          event.preventDefault();
          expect(event.defaultPrevented).toBe(true);
        },
        onPointerDownOutside: (event) => {
          event.preventDefault();
          expect(event.defaultPrevented).toBe(true);
        },
        onFocusOutside: (event) => {
          event.preventDefault();
          expect(event.defaultPrevented).toBe(true);
        },
        onDismiss,
      });

      // Escape
      const keyEvent = dispatchKeyDown(doc, 'Escape');
      expect(keyEvent.defaultPrevented).toBe(false);
      expect(onDismiss).not.toHaveBeenCalled();

      // PointerDown outside
      const pointerEvent = dispatchPointerDown(outsideBtn);
      expect(pointerEvent.defaultPrevented).toBe(false);
      expect(onDismiss).not.toHaveBeenCalled();

      // FocusIn outside
      const focusEvent = dispatchFocusIn(outsideBtn);
      expect(focusEvent.defaultPrevented).toBe(false);
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('branches の要素', () => {
    it('branches で返された要素はレイヤーの内側として扱われる', () => {
      const layerEl = doc.createElement('div');
      const triggerBtn = doc.createElement('button');
      const triggerChild = doc.createElement('span');
      triggerBtn.appendChild(triggerChild);
      const outsideBtn = doc.createElement('button');

      doc.body.appendChild(layerEl);
      doc.body.appendChild(triggerBtn);
      doc.body.appendChild(outsideBtn);

      const onDismiss = vi.fn();
      const onPointerDownOutside = vi.fn();
      const onFocusOutside = vi.fn();

      createLayer(layerEl, {
        branches: () => [triggerBtn, null, undefined],
        onDismiss,
        onPointerDownOutside,
        onFocusOutside,
      });

      // triggerBtn 上での pointerdown と focusin は内側扱い
      dispatchPointerDown(triggerBtn);
      dispatchPointerDown(triggerChild);
      dispatchFocusIn(triggerBtn);

      expect(onPointerDownOutside).not.toHaveBeenCalled();
      expect(onFocusOutside).not.toHaveBeenCalled();
      expect(onDismiss).not.toHaveBeenCalled();

      // branches 外での pointerdown は外側扱い
      dispatchPointerDown(outsideBtn);
      expect(onPointerDownOutside).toHaveBeenCalledOnce();
      expect(onDismiss).toHaveBeenCalledWith('pointer-down-outside');
    });
  });

  describe('ネストされたレイヤー (Nested)', () => {
    it('親レイヤーと子レイヤーがある場合、Escape は子レイヤーのみを閉じ、子が破棄された後は親が閉じられる', () => {
      const parentEl = doc.createElement('div');
      const childEl = doc.createElement('div');
      doc.body.appendChild(parentEl);
      doc.body.appendChild(childEl);

      const parentDismiss = vi.fn();
      const childDismiss = vi.fn();

      const parentLayer = createLayer(parentEl, { onDismiss: parentDismiss });
      const childLayer = createLayer(childEl, { onDismiss: childDismiss });

      expect(parentLayer.isTopmost()).toBe(false);
      expect(childLayer.isTopmost()).toBe(true);

      // 1 回目の Escape: 最前面の子レイヤーのみ dismiss
      dispatchKeyDown(doc, 'Escape');
      expect(childDismiss).toHaveBeenCalledOnce();
      expect(parentDismiss).not.toHaveBeenCalled();

      // 子レイヤーを destroy
      childLayer.destroy();
      expect(parentLayer.isTopmost()).toBe(true);

      // 2 回目の Escape: 親レイヤーが dismiss
      dispatchKeyDown(doc, 'Escape');
      expect(parentDismiss).toHaveBeenCalledOnce();
    });

    it('子レイヤー内での pointerdown は親を閉じず、両方の外側での pointerdown は子のみを閉じる', () => {
      const parentEl = doc.createElement('div');
      const childEl = doc.createElement('div');
      const childInner = doc.createElement('button');
      childEl.appendChild(childInner);
      const outsideBtn = doc.createElement('button');

      // ポータル相当: childEl は parentEl の子ではなく body に直接配置
      doc.body.appendChild(parentEl);
      doc.body.appendChild(childEl);
      doc.body.appendChild(outsideBtn);

      const parentDismiss = vi.fn();
      const childDismiss = vi.fn();

      createLayer(parentEl, { onDismiss: parentDismiss });
      createLayer(childEl, { onDismiss: childDismiss });

      // 子レイヤー内での操作
      dispatchPointerDown(childInner);
      expect(childDismiss).not.toHaveBeenCalled();
      expect(parentDismiss).not.toHaveBeenCalled();

      // 両方の外側での操作
      dispatchPointerDown(outsideBtn);
      expect(childDismiss).toHaveBeenCalledOnce();
      expect(parentDismiss).not.toHaveBeenCalled();
    });
  });

  describe('スタック管理と isTopmost()', () => {
    it('isTopmost() はスタックを正しく反映し、中間のレイヤーを破棄しても他のレイヤーの順序が保たれる', () => {
      const el1 = doc.createElement('div');
      const el2 = doc.createElement('div');
      const el3 = doc.createElement('div');
      doc.body.appendChild(el1);
      doc.body.appendChild(el2);
      doc.body.appendChild(el3);

      const layer1 = createLayer(el1, { onDismiss: vi.fn() });
      expect(layer1.isTopmost()).toBe(true);

      const layer2 = createLayer(el2, { onDismiss: vi.fn() });
      expect(layer1.isTopmost()).toBe(false);
      expect(layer2.isTopmost()).toBe(true);

      const layer3 = createLayer(el3, { onDismiss: vi.fn() });
      expect(layer1.isTopmost()).toBe(false);
      expect(layer2.isTopmost()).toBe(false);
      expect(layer3.isTopmost()).toBe(true);

      // 中間の layer2 を破棄
      layer2.destroy();
      expect(layer2.isTopmost()).toBe(false);
      expect(layer1.isTopmost()).toBe(false);
      expect(layer3.isTopmost()).toBe(true);

      // 最前面の layer3 を破棄 -> layer1 が最前面になる
      layer3.destroy();
      expect(layer3.isTopmost()).toBe(false);
      expect(layer1.isTopmost()).toBe(true);

      // layer1 を破棄 -> 全て false
      layer1.destroy();
      expect(layer1.isTopmost()).toBe(false);
    });
  });

  describe('destroy() の動作とイベントリスナーのクリーンアップ', () => {
    it('destroy() 後はイベントが発生してもコールバックは呼ばれない', () => {
      const layerEl = doc.createElement('div');
      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(layerEl);
      doc.body.appendChild(outsideBtn);
      const onDismiss = vi.fn();

      const layer = createLayer(layerEl, { onDismiss });
      layer.destroy();

      dispatchKeyDown(doc, 'Escape');
      dispatchPointerDown(outsideBtn);
      dispatchFocusIn(outsideBtn);

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('destroy() を複数回呼び出しても安全である', () => {
      const layerEl = doc.createElement('div');
      doc.body.appendChild(layerEl);

      const layer = createLayer(layerEl, { onDismiss: vi.fn() });
      expect(() => {
        layer.destroy();
        layer.destroy();
        layer.destroy();
      }).not.toThrow();
      expect(layer.isTopmost()).toBe(false);
    });

    it('スタックが空になると document からイベントリスナーが削除される', () => {
      const removeSpy = vi.spyOn(doc, 'removeEventListener');
      const layerEl = doc.createElement('div');
      doc.body.appendChild(layerEl);

      const layer = createLayer(layerEl, { onDismiss: vi.fn() });
      expect(removeSpy).not.toHaveBeenCalled();

      layer.destroy();

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);
      expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function), true);
      expect(removeSpy).toHaveBeenCalledWith('focusin', expect.any(Function), true);
    });
  });

  describe('SSR (isBrowser: false)', () => {
    it('isBrowser が false のときは no-op レイヤーを返す', async () => {
      vi.resetModules();
      vi.doMock('./env', () => ({ isBrowser: false }));
      const { createDismissableLayer: createSsrLayer } = await import('./dismissable-layer');

      const el = doc.createElement('div');
      const onDismiss = vi.fn();
      const layer = createSsrLayer(el, { onDismiss });

      expect(layer.isTopmost()).toBe(false);
      expect(() => layer.destroy()).not.toThrow();

      dispatchKeyDown(doc, 'Escape');
      expect(onDismiss).not.toHaveBeenCalled();

      vi.doUnmock('./env');
    });
  });
});
