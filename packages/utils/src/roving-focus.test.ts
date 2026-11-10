import { createDOM } from '@builder.io/qwik/testing';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { getRovingIndex, isRovingItemDisabled, moveRovingFocus } from './roving-focus';

describe('getRovingIndex', () => {
  const horizontalOptions = {
    orientation: 'horizontal' as const,
    loop: true,
    dir: 'ltr' as const,
  };

  const verticalOptions = {
    orientation: 'vertical' as const,
    loop: true,
    dir: 'ltr' as const,
  };

  const bothOptions = {
    orientation: 'both' as const,
    loop: true,
    dir: 'ltr' as const,
  };

  describe('orientation', () => {
    describe('horizontal', () => {
      it('ArrowRight で次の項目へ進む', () => {
        expect(getRovingIndex('ArrowRight', 0, [true, true, true], horizontalOptions)).toBe(1);
        expect(getRovingIndex('ArrowRight', 1, [true, true, true], horizontalOptions)).toBe(2);
      });

      it('ArrowLeft で前の項目へ戻る', () => {
        expect(getRovingIndex('ArrowLeft', 2, [true, true, true], horizontalOptions)).toBe(1);
        expect(getRovingIndex('ArrowLeft', 1, [true, true, true], horizontalOptions)).toBe(0);
      });

      it('ArrowUp / ArrowDown では移動しない (null)', () => {
        expect(getRovingIndex('ArrowUp', 1, [true, true, true], horizontalOptions)).toBeNull();
        expect(getRovingIndex('ArrowDown', 1, [true, true, true], horizontalOptions)).toBeNull();
      });
    });

    describe('vertical', () => {
      it('ArrowDown で次の項目へ進む', () => {
        expect(getRovingIndex('ArrowDown', 0, [true, true, true], verticalOptions)).toBe(1);
        expect(getRovingIndex('ArrowDown', 1, [true, true, true], verticalOptions)).toBe(2);
      });

      it('ArrowUp で前の項目へ戻る', () => {
        expect(getRovingIndex('ArrowUp', 2, [true, true, true], verticalOptions)).toBe(1);
        expect(getRovingIndex('ArrowUp', 1, [true, true, true], verticalOptions)).toBe(0);
      });

      it('ArrowLeft / ArrowRight では移動しない (null)', () => {
        expect(getRovingIndex('ArrowLeft', 1, [true, true, true], verticalOptions)).toBeNull();
        expect(getRovingIndex('ArrowRight', 1, [true, true, true], verticalOptions)).toBeNull();
      });
    });

    describe('both', () => {
      it('ltr: ArrowRight と ArrowDown で次の項目へ進む', () => {
        expect(getRovingIndex('ArrowRight', 0, [true, true, true], bothOptions)).toBe(1);
        expect(getRovingIndex('ArrowDown', 0, [true, true, true], bothOptions)).toBe(1);
      });

      it('ltr: ArrowLeft と ArrowUp で前の項目へ戻る', () => {
        expect(getRovingIndex('ArrowLeft', 2, [true, true, true], bothOptions)).toBe(1);
        expect(getRovingIndex('ArrowUp', 2, [true, true, true], bothOptions)).toBe(1);
      });

      it('rtl: 左右のみ反転し、上下は反転しない', () => {
        const bothRtl = { ...bothOptions, dir: 'rtl' as const };
        // ArrowRight: 前へ (反転)
        expect(getRovingIndex('ArrowRight', 1, [true, true, true], bothRtl)).toBe(0);
        // ArrowLeft: 次へ (反転)
        expect(getRovingIndex('ArrowLeft', 1, [true, true, true], bothRtl)).toBe(2);
        // ArrowDown: 次へ (反転しない)
        expect(getRovingIndex('ArrowDown', 1, [true, true, true], bothRtl)).toBe(2);
        // ArrowUp: 前へ (反転しない)
        expect(getRovingIndex('ArrowUp', 1, [true, true, true], bothRtl)).toBe(0);
      });
    });
  });

  describe('rtl (horizontal)', () => {
    const rtlOptions = { ...horizontalOptions, dir: 'rtl' as const };

    it('ArrowRight で前の項目へ戻る (反転)', () => {
      expect(getRovingIndex('ArrowRight', 1, [true, true, true], rtlOptions)).toBe(0);
    });

    it('ArrowLeft で次の項目へ進む (反転)', () => {
      expect(getRovingIndex('ArrowLeft', 1, [true, true, true], rtlOptions)).toBe(2);
    });
  });

  describe('loop', () => {
    describe('loop: true', () => {
      it('末尾で進むと先頭へ循環する', () => {
        expect(
          getRovingIndex('ArrowRight', 2, [true, true, true], {
            ...horizontalOptions,
            loop: true,
          }),
        ).toBe(0);
      });

      it('先頭で戻ると末尾へ循環する', () => {
        expect(
          getRovingIndex('ArrowLeft', 0, [true, true, true], {
            ...horizontalOptions,
            loop: true,
          }),
        ).toBe(2);
      });
    });

    describe('loop: false', () => {
      it('末尾で進むと null を返す', () => {
        expect(
          getRovingIndex('ArrowRight', 2, [true, true, true], {
            ...horizontalOptions,
            loop: false,
          }),
        ).toBeNull();
      });

      it('先頭で戻ると null を返す', () => {
        expect(
          getRovingIndex('ArrowLeft', 0, [true, true, true], {
            ...horizontalOptions,
            loop: false,
          }),
        ).toBeNull();
      });
    });
  });

  describe('Home / End', () => {
    it('Home で最初のフォーカス可能項目へ移動する', () => {
      expect(getRovingIndex('Home', 2, [true, true, true], horizontalOptions)).toBe(0);
    });

    it('End で最後のフォーカス可能項目へ移動する', () => {
      expect(getRovingIndex('End', 0, [true, true, true], horizontalOptions)).toBe(2);
    });

    it('先頭が無効な場合、Home は最初の有効な項目へ移動する', () => {
      expect(getRovingIndex('Home', 2, [false, true, true], horizontalOptions)).toBe(1);
    });

    it('末尾が無効な場合、End は最後の有効な項目へ移動する', () => {
      expect(getRovingIndex('End', 0, [true, true, false], horizontalOptions)).toBe(1);
    });

    it('すでに最初のフォーカス可能項目にいる場合、Home は null を返す', () => {
      expect(getRovingIndex('Home', 0, [true, true, true], horizontalOptions)).toBeNull();
      expect(getRovingIndex('Home', 1, [false, true, true], horizontalOptions)).toBeNull();
    });

    it('すでに最後のフォーカス可能項目にいる場合、End は null を返す', () => {
      expect(getRovingIndex('End', 2, [true, true, true], horizontalOptions)).toBeNull();
      expect(getRovingIndex('End', 1, [true, true, false], horizontalOptions)).toBeNull();
    });
  });

  describe('フォーカス不可項目のスキップ', () => {
    it('中間の無効項目をスキップして次の項目へ進む', () => {
      expect(getRovingIndex('ArrowRight', 0, [true, false, true], horizontalOptions)).toBe(2);
    });

    it('中間の無効項目をスキップして前の項目へ戻る', () => {
      expect(getRovingIndex('ArrowLeft', 2, [true, false, true], horizontalOptions)).toBe(0);
    });

    it('連続する複数の無効項目をスキップする', () => {
      expect(getRovingIndex('ArrowRight', 0, [true, false, false, true], horizontalOptions)).toBe(
        3,
      );
    });

    it('ループ時に末尾/先頭の無効項目をスキップする', () => {
      expect(
        getRovingIndex('ArrowRight', 1, [false, true, false], {
          ...horizontalOptions,
          loop: true,
        }),
      ).toBeNull(); // 他にフォーカス可能項目がないため
    });
  });

  describe('currentIndex: -1 (未選択)', () => {
    it('矢印キーは null を返す', () => {
      expect(getRovingIndex('ArrowRight', -1, [true, true, true], horizontalOptions)).toBeNull();
      expect(getRovingIndex('ArrowLeft', -1, [true, true, true], horizontalOptions)).toBeNull();
      expect(getRovingIndex('ArrowDown', -1, [true, true, true], verticalOptions)).toBeNull();
      expect(getRovingIndex('ArrowUp', -1, [true, true, true], verticalOptions)).toBeNull();
    });

    it('Home は最初のフォーカス可能項目へ移動する', () => {
      expect(getRovingIndex('Home', -1, [false, true, true], horizontalOptions)).toBe(1);
    });

    it('End は最後のフォーカス可能項目へ移動する', () => {
      expect(getRovingIndex('End', -1, [true, true, false], horizontalOptions)).toBe(1);
    });
  });

  describe('フォーカス可能項目が存在しない場合', () => {
    it('すべての項目が無効なときは null を返す', () => {
      expect(getRovingIndex('ArrowRight', 0, [false, false], horizontalOptions)).toBeNull();
      expect(getRovingIndex('Home', -1, [false, false], horizontalOptions)).toBeNull();
      expect(getRovingIndex('End', -1, [false, false], horizontalOptions)).toBeNull();
    });

    it('項目配列が空のときは null を返す', () => {
      expect(getRovingIndex('ArrowRight', 0, [], horizontalOptions)).toBeNull();
      expect(getRovingIndex('Home', -1, [], horizontalOptions)).toBeNull();
      expect(getRovingIndex('End', -1, [], horizontalOptions)).toBeNull();
    });
  });

  describe('対象外のキー', () => {
    it('移動に関係のないキーでは null を返す', () => {
      for (const key of ['Tab', 'Enter', 'Space', 'Escape', 'a', '1']) {
        expect(getRovingIndex(key, 0, [true, true, true], horizontalOptions)).toBeNull();
      }
    });
  });

  describe('単一の項目 (single item)', () => {
    it('移動先が現在位置と同じになるため null を返す', () => {
      expect(getRovingIndex('ArrowRight', 0, [true], horizontalOptions)).toBeNull();
      expect(getRovingIndex('ArrowLeft', 0, [true], horizontalOptions)).toBeNull();
      expect(getRovingIndex('Home', 0, [true], horizontalOptions)).toBeNull();
      expect(getRovingIndex('End', 0, [true], horizontalOptions)).toBeNull();
    });
  });
});

describe('isRovingItemDisabled', () => {
  let doc: Document;

  beforeAll(async () => {
    const { screen } = await createDOM();
    doc = screen.ownerDocument as unknown as Document;
  });

  it('disabled 属性またはプロパティを持つとき true を返す', () => {
    const btn = doc.createElement('button') as HTMLButtonElement;
    btn.disabled = true;
    expect(isRovingItemDisabled(btn)).toBe(true);

    const div = doc.createElement('div');
    div.setAttribute('disabled', '');
    expect(isRovingItemDisabled(div)).toBe(true);
  });

  it('aria-disabled="true" のとき true を返す', () => {
    const btn = doc.createElement('button');
    btn.setAttribute('aria-disabled', 'true');
    expect(isRovingItemDisabled(btn)).toBe(true);
  });

  it('data-disabled 属性が存在するとき true を返す', () => {
    const btn = doc.createElement('button');
    btn.setAttribute('data-disabled', '');
    expect(isRovingItemDisabled(btn)).toBe(true);

    const div = doc.createElement('div');
    div.setAttribute('data-disabled', 'true');
    expect(isRovingItemDisabled(div)).toBe(true);
  });

  it('aria-disabled="false" のとき false を返す', () => {
    const btn = doc.createElement('button');
    btn.setAttribute('aria-disabled', 'false');
    expect(isRovingItemDisabled(btn)).toBe(false);
  });

  it('data-disabled="false" のとき false を返す', () => {
    const btn = doc.createElement('button');
    btn.setAttribute('data-disabled', 'false');
    expect(isRovingItemDisabled(btn)).toBe(false);
  });

  it('無効化属性を持たない通常要素のとき false を返す', () => {
    const btn = doc.createElement('button');
    expect(isRovingItemDisabled(btn)).toBe(false);
  });
});

describe('moveRovingFocus', () => {
  let doc: Document;

  beforeAll(async () => {
    const { screen } = await createDOM();
    doc = screen.ownerDocument as unknown as Document;
  });

  afterEach(() => {
    doc.body.innerHTML = '';
  });

  /**
   * cancelable な KeyboardEvent を作成し、ターゲット要素から dispatch して target を設定するヘルパー
   */
  function dispatchKeyEvent(target: HTMLElement, key: string): KeyboardEvent {
    const event = doc.createEvent('Event') as unknown as KeyboardEvent;
    event.initEvent('keydown', true, true);
    Object.defineProperty(event, 'key', { value: key });
    target.dispatchEvent(event as unknown as Event);
    return event;
  }

  function setupButtons(count = 3): HTMLButtonElement[] {
    const buttons: HTMLButtonElement[] = [];
    for (let i = 0; i < count; i++) {
      const btn = doc.createElement('button');
      btn.textContent = `Item ${i}`;
      btn.tabIndex = i === 0 ? 0 : -1;
      doc.body.appendChild(btn);
      buttons.push(btn);
    }
    return buttons;
  }

  it('フォーカスを移動し、移動先の要素を返す', () => {
    const [b0, b1, b2] = setupButtons(3);
    const focusSpy = vi.spyOn(b1, 'focus');

    const event = dispatchKeyEvent(b0, 'ArrowRight');
    const result = moveRovingFocus(event, [b0, b1, b2]);

    expect(result).toBe(b1);
    expect(focusSpy).toHaveBeenCalledOnce();
  });

  it('移動先の tabIndex を 0 にし、他の項目の tabIndex を -1 にする', () => {
    const [b0, b1, b2] = setupButtons(3);

    const event = dispatchKeyEvent(b0, 'ArrowRight');
    moveRovingFocus(event, [b0, b1, b2]);

    expect(b0.tabIndex).toBe(-1);
    expect(b1.tabIndex).toBe(0);
    expect(b2.tabIndex).toBe(-1);
  });

  it('移動が発生したときは event.preventDefault() を呼ぶ (defaultPrevented が true)', () => {
    const [b0, b1, b2] = setupButtons(3);

    const event = dispatchKeyEvent(b0, 'ArrowRight');
    expect(event.defaultPrevented).toBe(false);

    moveRovingFocus(event, [b0, b1, b2]);
    expect(event.defaultPrevented).toBe(true);
  });

  it('対象外のキーでは null を返し、DOM や tabIndex を変更しない', () => {
    const [b0, b1, b2] = setupButtons(3);

    const event = dispatchKeyEvent(b0, 'Tab');
    const result = moveRovingFocus(event, [b0, b1, b2]);

    expect(result).toBeNull();
    expect(event.defaultPrevented).toBe(false);
    expect(b0.tabIndex).toBe(0);
    expect(b1.tabIndex).toBe(-1);
    expect(b2.tabIndex).toBe(-1);
  });

  it('無効な項目をスキップして次の有効な項目へ移動する', () => {
    const [b0, b1, b2] = setupButtons(3);
    b1.disabled = true;

    const event = dispatchKeyEvent(b0, 'ArrowRight');
    const result = moveRovingFocus(event, [b0, b1, b2]);

    expect(result).toBe(b2);
    expect(b0.tabIndex).toBe(-1);
    expect(b1.tabIndex).toBe(-1);
    expect(b2.tabIndex).toBe(0);
  });

  it('focusableWhenDisabled: true のときは無効な項目へもフォーカスを移動する', () => {
    const [b0, b1, b2] = setupButtons(3);
    b1.disabled = true;

    const event = dispatchKeyEvent(b0, 'ArrowRight');
    const result = moveRovingFocus(event, [b0, b1, b2], {
      focusableWhenDisabled: true,
    });

    expect(result).toBe(b1);
    expect(b0.tabIndex).toBe(-1);
    expect(b1.tabIndex).toBe(0);
    expect(b2.tabIndex).toBe(-1);
  });

  it('dir="rtl" を明示的に指定したとき、左右キーの移動方向が反転する', () => {
    const [b0, b1, b2] = setupButtons(3);
    // b1 から ArrowRight を押すと rtl では前 (b0) へ移動する
    const eventRight = dispatchKeyEvent(b1, 'ArrowRight');
    const resultRight = moveRovingFocus(eventRight, [b0, b1, b2], {
      dir: 'rtl',
    });
    expect(resultRight).toBe(b0);

    // b1 から ArrowLeft を押すと rtl では次 (b2) へ移動する
    const eventLeft = dispatchKeyEvent(b1, 'ArrowLeft');
    const resultLeft = moveRovingFocus(eventLeft, [b0, b1, b2], {
      dir: 'rtl',
    });
    expect(resultLeft).toBe(b2);
  });

  it('dir オプション省略時に直近の [dir] 属性から rtl を検出する', () => {
    const wrapper = doc.createElement('div');
    wrapper.setAttribute('dir', 'rtl');
    doc.body.appendChild(wrapper);

    const b0 = doc.createElement('button');
    const b1 = doc.createElement('button');
    wrapper.appendChild(b0);
    wrapper.appendChild(b1);

    const event = dispatchKeyEvent(b0, 'ArrowLeft');
    const result = moveRovingFocus(event, [b0, b1]);
    expect(result).toBe(b1);
  });
});
