import { createDOM } from '@builder.io/qwik/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FocusScope, FocusScopeOptions } from './focus-scope';

const { screen } = await createDOM();
const doc = screen.ownerDocument as unknown as Document;
(globalThis as unknown as { document: Document }).document = doc;

let currentActiveElement: HTMLElement | null = null;
Object.defineProperty(doc, 'activeElement', {
  get: () => currentActiveElement,
  set: (el: HTMLElement | null) => {
    currentActiveElement = el;
  },
  configurable: true,
});

const originalCreateElement = doc.createElement.bind(doc);
doc.createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: ElementCreationOptions,
): HTMLElementTagNameMap[K] => {
  const el = originalCreateElement(tagName, options);
  Object.defineProperty(el, 'focus', {
    value: () => {
      currentActiveElement = el as HTMLElement;
    },
    writable: true,
    configurable: true,
  });
  return el as HTMLElementTagNameMap[K];
};

const { createFocusScope, getTabbableElements } = await import('./focus-scope');

describe('focus-scope', () => {
  let activeScopes: FocusScope[] = [];

  function createScope(container: HTMLElement, options?: FocusScopeOptions): FocusScope {
    const scope = createFocusScope(container, options);
    activeScopes.push(scope);
    return scope;
  }

  function dispatchKeyDown(
    target: EventTarget,
    key: string,
    options: {
      shiftKey?: boolean;
      altKey?: boolean;
      ctrlKey?: boolean;
      metaKey?: boolean;
      isComposing?: boolean;
    } = {},
  ): KeyboardEvent {
    let event: KeyboardEvent;
    if (typeof KeyboardEvent !== 'undefined') {
      try {
        event = new KeyboardEvent('keydown', {
          key,
          shiftKey: options.shiftKey ?? false,
          altKey: options.altKey ?? false,
          ctrlKey: options.ctrlKey ?? false,
          metaKey: options.metaKey ?? false,
          bubbles: true,
          cancelable: true,
        });
      } catch {
        event = doc.createEvent('Event') as unknown as KeyboardEvent;
        event.initEvent('keydown', true, true);
        Object.defineProperty(event, 'key', { value: key });
        Object.defineProperty(event, 'shiftKey', { value: options.shiftKey ?? false });
      }
    } else {
      event = doc.createEvent('Event') as unknown as KeyboardEvent;
      event.initEvent('keydown', true, true);
      Object.defineProperty(event, 'key', { value: key });
      Object.defineProperty(event, 'shiftKey', { value: options.shiftKey ?? false });
    }
    if (options.isComposing !== undefined) {
      Object.defineProperty(event, 'isComposing', { value: options.isComposing });
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
    for (const scope of activeScopes) {
      scope.destroy();
    }
    activeScopes = [];
    currentActiveElement = null;
    doc.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('getTabbableElements', () => {
    it('DOM の順序に従って Tab 移動可能な要素を返す', () => {
      const container = doc.createElement('div');
      const btn = doc.createElement('button');
      const a = doc.createElement('a');
      a.href = '#';
      const input = doc.createElement('input');
      const textarea = doc.createElement('textarea');
      const select = doc.createElement('select');

      container.appendChild(btn);
      container.appendChild(a);
      container.appendChild(input);
      container.appendChild(textarea);
      container.appendChild(select);
      doc.body.appendChild(container);

      expect(getTabbableElements(container)).toEqual([btn, a, input, textarea, select]);
    });

    it('disabled な要素をスキップする', () => {
      const container = doc.createElement('div');
      const disabledBtn = doc.createElement('button');
      disabledBtn.disabled = true;

      const disabledAttrBtn = doc.createElement('button');
      disabledAttrBtn.setAttribute('disabled', '');

      const validBtn = doc.createElement('button');

      container.appendChild(disabledBtn);
      container.appendChild(disabledAttrBtn);
      container.appendChild(validBtn);
      doc.body.appendChild(container);

      expect(getTabbableElements(container)).toEqual([validBtn]);
    });

    it('tabindex="-1" の要素をスキップする', () => {
      const container = doc.createElement('div');
      const btnNeg = doc.createElement('button');
      btnNeg.setAttribute('tabindex', '-1');

      const divNeg = doc.createElement('div');
      divNeg.setAttribute('tabindex', '-1');

      const validBtn = doc.createElement('button');

      container.appendChild(btnNeg);
      container.appendChild(divNeg);
      container.appendChild(validBtn);
      doc.body.appendChild(container);

      expect(getTabbableElements(container)).toEqual([validBtn]);
    });

    it('hidden や inert な祖先を持つ要素、および自身が hidden/inert な要素をスキップする', () => {
      const container = doc.createElement('div');

      const hiddenDiv = doc.createElement('div');
      hiddenDiv.setAttribute('hidden', '');
      const btnInHidden = doc.createElement('button');
      hiddenDiv.appendChild(btnInHidden);

      const inertDiv = doc.createElement('div');
      inertDiv.setAttribute('inert', '');
      const btnInInert = doc.createElement('button');
      inertDiv.appendChild(btnInInert);

      const hiddenBtn = doc.createElement('button');
      hiddenBtn.setAttribute('hidden', '');

      const inertBtn = doc.createElement('button');
      inertBtn.setAttribute('inert', '');

      const normalBtn = doc.createElement('button');

      container.appendChild(hiddenDiv);
      container.appendChild(inertDiv);
      container.appendChild(hiddenBtn);
      container.appendChild(inertBtn);
      container.appendChild(normalBtn);
      doc.body.appendChild(container);

      expect(getTabbableElements(container)).toEqual([normalBtn]);
    });

    it('type="hidden" の input 要素をスキップする', () => {
      const container = doc.createElement('div');
      const hiddenInput = doc.createElement('input');
      hiddenInput.type = 'hidden';

      const textInput = doc.createElement('input');
      textInput.type = 'text';

      container.appendChild(hiddenInput);
      container.appendChild(textInput);
      doc.body.appendChild(container);

      expect(getTabbableElements(container)).toEqual([textInput]);
    });

    it('tabindex="0" の div 要素を Tab 移動可能要素として含める', () => {
      const container = doc.createElement('div');
      const divWithTabindex = doc.createElement('div');
      divWithTabindex.setAttribute('tabindex', '0');

      const plainDiv = doc.createElement('div');
      const btn = doc.createElement('button');

      container.appendChild(divWithTabindex);
      container.appendChild(plainDiv);
      container.appendChild(btn);
      doc.body.appendChild(container);

      expect(getTabbableElements(container)).toEqual([divWithTabindex, btn]);
    });

    it('container が無効な場合や子要素がない場合は空配列を返す', () => {
      const container = doc.createElement('div');
      doc.body.appendChild(container);

      expect(getTabbableElements(container)).toEqual([]);
      expect(getTabbableElements(null as unknown as HTMLElement)).toEqual([]);
    });
  });

  describe('初期フォーカス (Initial focus)', () => {
    it('デフォルトでは最初の Tab 移動可能要素にフォーカスする', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      createScope(container);

      expect(doc.activeElement).toBe(btn1);
    });

    it('Tab 移動可能要素がない場合は container (tabindex="-1") にフォーカスする', () => {
      const container = doc.createElement('div');
      container.setAttribute('tabindex', '-1');
      doc.body.appendChild(container);

      createScope(container);

      expect(doc.activeElement).toBe(container);
    });

    it('initialFocus に要素を指定した場合はその要素にフォーカスする', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      createScope(container, { initialFocus: btn2 });

      expect(doc.activeElement).toBe(btn2);
    });

    it('initialFocus に関数を指定した場合はその返り値の要素にフォーカスする', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      createScope(container, { initialFocus: () => btn2 });

      expect(doc.activeElement).toBe(btn2);
    });

    it('initialFocus が何も解決しない場合（null / undefined）は最初の Tab 移動可能要素にフォールバックする', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      createScope(container, { initialFocus: () => null });

      expect(doc.activeElement).toBe(btn1);
    });

    it('initialFocus: false の場合はフォーカスを移動しない', () => {
      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(outsideBtn);
      outsideBtn.focus();
      expect(doc.activeElement).toBe(outsideBtn);

      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      container.appendChild(btn1);
      doc.body.appendChild(container);

      createScope(container, { initialFocus: false });

      expect(doc.activeElement).toBe(outsideBtn);
    });

    it('既にコンテナ内にフォーカスがある場合はフォーカスを移動しない', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      btn2.focus();
      expect(doc.activeElement).toBe(btn2);

      createScope(container);

      expect(doc.activeElement).toBe(btn2);
    });
  });

  describe('フォーカス復帰 (Restore focus)', () => {
    it('デフォルトではスコープ作成時にフォーカスされていた要素へ復帰する', () => {
      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(outsideBtn);
      outsideBtn.focus();
      expect(doc.activeElement).toBe(outsideBtn);

      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      container.appendChild(btn1);
      doc.body.appendChild(container);

      const scope = createScope(container);
      expect(doc.activeElement).toBe(btn1);

      scope.destroy();
      expect(doc.activeElement).toBe(outsideBtn);
    });

    it('restoreFocus に要素または関数を指定した場合はその要素へ復帰する', () => {
      const prevBtn = doc.createElement('button');
      const customRestoreBtn = doc.createElement('button');
      doc.body.appendChild(prevBtn);
      doc.body.appendChild(customRestoreBtn);
      prevBtn.focus();

      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      container.appendChild(btn1);
      doc.body.appendChild(container);

      // 要素指定
      const scope1 = createScope(container, { restoreFocus: customRestoreBtn });
      scope1.destroy();
      expect(doc.activeElement).toBe(customRestoreBtn);

      // 関数指定
      prevBtn.focus();
      const scope2 = createScope(container, { restoreFocus: () => customRestoreBtn });
      scope2.destroy();
      expect(doc.activeElement).toBe(customRestoreBtn);
    });

    it('restoreFocus: false の場合はフォーカスを復帰しない', () => {
      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(outsideBtn);
      outsideBtn.focus();

      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      container.appendChild(btn1);
      doc.body.appendChild(container);

      const scope = createScope(container, { restoreFocus: false });
      expect(doc.activeElement).toBe(btn1);

      scope.destroy();
      expect(doc.activeElement).toBe(btn1);
    });

    it('復帰先の要素が DOM から削除されていた場合はフォーカスを移動しない', () => {
      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(outsideBtn);
      outsideBtn.focus();

      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      container.appendChild(btn1);
      doc.body.appendChild(container);

      const scope = createScope(container);
      expect(doc.activeElement).toBe(btn1);

      doc.body.removeChild(outsideBtn);
      expect(outsideBtn.isConnected).toBe(false);

      scope.destroy();
      expect(doc.activeElement).toBe(btn1);
    });
  });

  describe('フォーカストラップ (Trap)', () => {
    it('最後の要素での Tab キー押下で最初の要素へ循環し、preventDefault が呼ばれる', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      createScope(container, { trap: true });
      btn2.focus();

      const event = dispatchKeyDown(btn2, 'Tab');

      expect(event.defaultPrevented).toBe(true);
      expect(doc.activeElement).toBe(btn1);
    });

    it('最初の要素での Shift+Tab キー押下で最後の要素へ循環し、preventDefault が呼ばれる', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      createScope(container, { trap: true });
      btn1.focus();

      const event = dispatchKeyDown(btn1, 'Tab', { shiftKey: true });

      expect(event.defaultPrevented).toBe(true);
      expect(doc.activeElement).toBe(btn2);
    });

    it('コンテナ自身での Shift+Tab キー押下で最後の要素へ移動し、preventDefault が呼ばれる', () => {
      const container = doc.createElement('div');
      container.setAttribute('tabindex', '-1');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      createScope(container, { trap: true });
      container.focus();

      const event = dispatchKeyDown(container, 'Tab', { shiftKey: true });

      expect(event.defaultPrevented).toBe(true);
      expect(doc.activeElement).toBe(btn2);
    });

    it('中間の要素での Tab キー押下では preventDefault は呼ばれない', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      const btn3 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      container.appendChild(btn3);
      doc.body.appendChild(container);

      createScope(container, { trap: true });
      btn2.focus();

      const event = dispatchKeyDown(btn2, 'Tab');

      expect(event.defaultPrevented).toBe(false);
    });

    it('コンテナ外への focusin はコンテナ内で最後にフォーカスされていた要素へ引き戻される', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);

      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(container);
      doc.body.appendChild(outsideBtn);

      createScope(container, { trap: true });

      // コンテナ内の btn2 にフォーカスが移動したことをシミュレート
      btn2.focus();
      dispatchFocusIn(btn2);
      expect(doc.activeElement).toBe(btn2);

      // 外側への focusin
      const btn2Spy = vi.spyOn(btn2, 'focus');
      dispatchFocusIn(outsideBtn);

      expect(btn2Spy).toHaveBeenCalled();
      expect(doc.activeElement).toBe(btn2);
    });

    it('コンテナ内での focusin が未発生のときに外側へ focusin された場合、最初の要素に引き戻される', () => {
      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);

      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(container);
      doc.body.appendChild(outsideBtn);

      createScope(container, { trap: true, initialFocus: false });

      const btn1Spy = vi.spyOn(btn1, 'focus');
      dispatchFocusIn(outsideBtn);

      expect(btn1Spy).toHaveBeenCalled();
      expect(doc.activeElement).toBe(btn1);
    });

    it('Tab 移動可能要素がない場合、Tab 押下および外側への focusin で container にフォーカスする', () => {
      const container = doc.createElement('div');
      container.setAttribute('tabindex', '-1');

      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(container);
      doc.body.appendChild(outsideBtn);

      createScope(container, { trap: true });

      const containerSpy = vi.spyOn(container, 'focus');

      // Tab 押下
      const event = dispatchKeyDown(container, 'Tab');
      expect(event.defaultPrevented).toBe(true);
      expect(containerSpy).toHaveBeenCalledTimes(1);

      // 外側への focusin
      dispatchFocusIn(outsideBtn);
      expect(containerSpy).toHaveBeenCalledTimes(2);
      expect(doc.activeElement).toBe(container);
    });
  });

  describe('ネストされたトラップ (Nested)', () => {
    it('内側のトラップがアクティブになり、内側を破棄すると外側のトラップが再アクティブ化してフォーカスが外側コンテナへ復帰する', () => {
      const outerContainer = doc.createElement('div');
      const outerBtn1 = doc.createElement('button');
      const outerBtn2 = doc.createElement('button');
      outerContainer.appendChild(outerBtn1);
      outerContainer.appendChild(outerBtn2);

      const innerContainer = doc.createElement('div');
      const innerBtn1 = doc.createElement('button');
      const innerBtn2 = doc.createElement('button');
      innerContainer.appendChild(innerBtn1);
      innerContainer.appendChild(innerBtn2);

      doc.body.appendChild(outerContainer);
      doc.body.appendChild(innerContainer);

      const outerScope = createScope(outerContainer, { trap: true });
      expect(doc.activeElement).toBe(outerBtn1);

      // 内側のスコープ作成
      const innerScope = createScope(innerContainer, { trap: true });
      expect(doc.activeElement).toBe(innerBtn1);

      // 内側で Tab ループが動作する
      innerBtn2.focus();
      const tabInner = dispatchKeyDown(innerBtn2, 'Tab');
      expect(tabInner.defaultPrevented).toBe(true);
      expect(doc.activeElement).toBe(innerBtn1);

      // 内側スコープを破棄 -> 外側のフォーカス（outerBtn1）へ復帰
      innerScope.destroy();
      expect(doc.activeElement).toBe(outerBtn1);

      // 外側のトラップが再アクティブ化している
      outerBtn2.focus();
      const tabOuter = dispatchKeyDown(outerBtn2, 'Tab');
      expect(tabOuter.defaultPrevented).toBe(true);
      expect(doc.activeElement).toBe(outerBtn1);

      outerScope.destroy();
    });
  });

  describe('trap: false', () => {
    it('trap: false のスコープは Tab キーをインターセプトせず、初期フォーカスと復帰のみ行う', () => {
      const outsideBtn = doc.createElement('button');
      doc.body.appendChild(outsideBtn);
      outsideBtn.focus();

      const container = doc.createElement('div');
      const btn1 = doc.createElement('button');
      const btn2 = doc.createElement('button');
      container.appendChild(btn1);
      container.appendChild(btn2);
      doc.body.appendChild(container);

      const scope = createScope(container, { trap: false });
      expect(doc.activeElement).toBe(btn1);

      // Tab はインターセプトされない
      btn2.focus();
      const tabEvent = dispatchKeyDown(btn2, 'Tab');
      expect(tabEvent.defaultPrevented).toBe(false);

      // 外側への focusin も引き戻されない
      const btn1Spy = vi.spyOn(btn1, 'focus');
      dispatchFocusIn(outsideBtn);
      expect(btn1Spy).not.toHaveBeenCalled();

      // destroy でフォーカス復帰
      scope.destroy();
      expect(doc.activeElement).toBe(outsideBtn);
    });
  });

  describe('destroy() のべき等性とリスナーのクリーンアップ', () => {
    it('destroy() を複数回呼び出しても安全である', () => {
      const container = doc.createElement('div');
      const btn = doc.createElement('button');
      container.appendChild(btn);
      doc.body.appendChild(container);

      const scope = createScope(container, { trap: true });
      expect(() => {
        scope.destroy();
        scope.destroy();
        scope.destroy();
      }).not.toThrow();
    });

    it('すべてのトラップが破棄されると document からイベントリスナーが削除される', () => {
      const container = doc.createElement('div');
      const btn = doc.createElement('button');
      container.appendChild(btn);
      doc.body.appendChild(container);

      const removeSpy = vi.spyOn(doc, 'removeEventListener');
      const scope = createScope(container, { trap: true });

      expect(removeSpy).not.toHaveBeenCalled();

      scope.destroy();

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);
      expect(removeSpy).toHaveBeenCalledWith('focusin', expect.any(Function), true);
    });
  });

  describe('SSR (isBrowser: false)', () => {
    it('isBrowser が false のときは no-op スコープを返す', async () => {
      vi.resetModules();
      vi.doMock('./env', () => ({ isBrowser: false }));
      const { createFocusScope: createSsrScope } = await import('./focus-scope');

      const container = doc.createElement('div');
      const btn = doc.createElement('button');
      container.appendChild(btn);
      doc.body.appendChild(container);

      const scope = createSsrScope(container, { trap: true });
      expect(() => scope.destroy()).not.toThrow();

      vi.doUnmock('./env');
    });
  });
});
