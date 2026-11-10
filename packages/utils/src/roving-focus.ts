/**
 * ロービングフォーカスで移動を受け付ける方向。
 *
 * - `'horizontal'`: 左右矢印キーで移動（水平）
 * - `'vertical'`: 上下矢印キーで移動（垂直）
 * - `'both'`: 上下左右すべての矢印キーで移動（1 次元の循環）
 */
export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

/**
 * ロービングフォーカスの移動オプション。
 */
export interface RovingFocusOptions {
  /**
   * 移動を受け付ける方向。
   *
   * @default 'horizontal'
   */
  orientation?: RovingOrientation;

  /**
   * 文字の書字方向。省略時は現在の項目（`items[currentIndex]`）、`currentIndex` が `-1` の場合は `items[0]` を基準に判定します。
   * `window.getComputedStyle` が利用可能な場合は computed style の `direction` を使用し、それ以外の場合は `el.closest('[dir]')` から判定します（フォールバックは `'ltr'`）。
   * `'rtl'` の場合は水平方向の左右キーの移動方向が反転します。
   */
  dir?: 'ltr' | 'rtl';

  /**
   * 端に達したときに反対側の端へループするかどうか。
   *
   * @default true
   */
  loop?: boolean;

  /**
   * 無効化された項目にもフォーカスを当てるかどうか。
   * `false` の場合は無効な項目をスキップして次のフォーカス可能項目を探します。
   *
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

/**
 * 対象の要素が無効化されているかを判定します。
 *
 * 以下のいずれかに該当する場合に `true` を返します。
 * - `disabled` 属性または `disabled` プロパティが真
 * - `aria-disabled="true"`
 * - `data-disabled` 属性が存在する（値が `'false'` の場合を除く）
 *
 * @param el 判定対象の HTMLElement
 * @returns 無効化されている場合は `true`、それ以外は `false`
 *
 * @example
 * if (isRovingItemDisabled(item)) {
 *   // スキップ処理
 * }
 */
export const isRovingItemDisabled = (el: HTMLElement): boolean => {
  if ('disabled' in el && (el as HTMLElement & { disabled?: boolean }).disabled) {
    return true;
  }
  if (el.hasAttribute('disabled')) {
    return true;
  }
  if (el.getAttribute('aria-disabled') === 'true') {
    return true;
  }
  if (el.hasAttribute('data-disabled') && el.getAttribute('data-disabled') !== 'false') {
    return true;
  }
  return false;
};

/**
 * 押下されたキーと現在位置から、次にフォーカスすべきインデックスを計算する純粋関数です。
 *
 * - `orientation: 'horizontal'`: ArrowRight で次、ArrowLeft で前（`dir: 'rtl'` の場合は反転）。ArrowUp / ArrowDown は `null`
 * - `orientation: 'vertical'`: ArrowDown で次、ArrowUp で前。ArrowLeft / ArrowRight は `null`
 * - `orientation: 'both'`: ArrowRight / ArrowDown で次、ArrowLeft / ArrowUp で前（`dir: 'rtl'` では左右のみ反転）
 * - `Home`: 最初のフォーカス可能項目
 * - `End`: 最後のフォーカス可能項目
 * - フォーカス不可の項目はスキップします。`loop: true` の場合は端で反対側へ循環し、`loop: false` の場合は端で `null` を返します。
 * - `currentIndex` が `-1` のとき矢印キーは `null` を返します（Home / End は有効）。
 * - フォーカス可能項目がない場合や、移動先が現在位置と同じ場合は `null` を返します。
 *
 * @param key 押下されたキー（`event.key`）
 * @param currentIndex 現在フォーカスされている項目のインデックス（未選択の場合は `-1`）
 * @param isFocusable 各項目がフォーカス可能かどうかを示す真偽値の配列
 * @param options 移動方向、ループ有無、書字方向
 * @returns 次にフォーカスすべきインデックス。移動しないキーや移動先がない場合は `null`
 *
 * @example
 * const nextIndex = getRovingIndex('ArrowRight', 0, [true, false, true], {
 *   orientation: 'horizontal',
 *   loop: true,
 *   dir: 'ltr',
 * });
 * // nextIndex: 2（インデックス 1 はスキップ）
 */
export const getRovingIndex = (
  key: string,
  currentIndex: number,
  isFocusable: readonly boolean[],
  options: Required<Pick<RovingFocusOptions, 'orientation' | 'loop'>> & { dir: 'ltr' | 'rtl' },
): number | null => {
  const count = isFocusable.length;
  if (count === 0) return null;

  if (key === 'Home') {
    const firstIndex = isFocusable.findIndex(Boolean);
    if (firstIndex === -1 || firstIndex === currentIndex) return null;
    return firstIndex;
  }

  if (key === 'End') {
    let lastIndex = -1;
    for (let i = count - 1; i >= 0; i--) {
      if (isFocusable[i]) {
        lastIndex = i;
        break;
      }
    }
    if (lastIndex === -1 || lastIndex === currentIndex) return null;
    return lastIndex;
  }

  if (currentIndex < 0 || currentIndex >= count) {
    return null;
  }

  const isRtl = options.dir === 'rtl';
  let step: 1 | -1 | null = null;

  switch (key) {
    case 'ArrowRight': {
      if (options.orientation === 'vertical') return null;
      step = isRtl ? -1 : 1;
      break;
    }
    case 'ArrowLeft': {
      if (options.orientation === 'vertical') return null;
      step = isRtl ? 1 : -1;
      break;
    }
    case 'ArrowDown': {
      if (options.orientation === 'horizontal') return null;
      step = 1;
      break;
    }
    case 'ArrowUp': {
      if (options.orientation === 'horizontal') return null;
      step = -1;
      break;
    }
    default:
      return null;
  }

  if (options.loop) {
    let next = (currentIndex + step + count) % count;
    while (next !== currentIndex) {
      if (isFocusable[next]) return next;
      next = (next + step + count) % count;
    }
    return null;
  }

  let next = currentIndex + step;
  while (next >= 0 && next < count) {
    if (isFocusable[next]) return next;
    next += step;
  }
  return null;
};

/**
 * `keydown` イベントを受け取り、ロービングタブインデックスに従って次の項目へフォーカスを移動します。
 *
 * - `items` の中から `event.target` を含む項目を現在のインデックスとします。
 * - `getRovingIndex` で移動先を決定します。
 * - 移動先がある場合:
 *   1. `event.preventDefault()` を呼び出します。
 *   2. 全項目の `tabIndex` を `-1` にし、移動先の `tabIndex` を `0` に付け替えます。
 *   3. 移動先の項目に `focus()` を呼び出します。
 *   4. 移動先の要素を返します。
 * - 対象外のキーや移動先がない場合は何も変更せず `null` を返します。
 *
 * > [!NOTE]
 * > Qwik のイベントハンドラは非同期で実行されるため、ハンドラ内での `event.preventDefault()` は
 * > ブラウザの既定の挙動を抑止できない場合があります。
 * > 確実にスクロール等を抑止したい場合は、コンポーネント側で `sync$` または `preventdefault:keydown` を併用してください。
 *
 * @param event キーボードイベント
 * @param items ナビゲーション対象となる要素の配列
 * @param options 移動オプション（orientation, dir, loop, focusableWhenDisabled）
 * @returns フォーカスが移動した項目。移動しなかった場合は `null`
 *
 * @example
 * const onKeyDown$ = $((event: KeyboardEvent) => {
 *   const items = Array.from(containerRef.value?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
 *   moveRovingFocus(event, items, { orientation: 'horizontal' });
 * });
 */
export const moveRovingFocus = (
  event: KeyboardEvent,
  items: readonly HTMLElement[],
  options?: RovingFocusOptions,
): HTMLElement | null => {
  const count = items.length;
  if (count === 0) return null;

  const target = event.target as Node | null;
  const currentIndex = target
    ? items.findIndex((item) => item === target || item.contains(target))
    : -1;

  const focusableWhenDisabled = options?.focusableWhenDisabled ?? false;
  const isFocusable = items.map((item) => focusableWhenDisabled || !isRovingItemDisabled(item));

  const orientation = options?.orientation ?? 'horizontal';
  const loop = options?.loop ?? true;

  let dir = options?.dir;
  if (!dir) {
    const el = currentIndex !== -1 ? items[currentIndex] : items[0];
    if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
      dir = window.getComputedStyle(el).direction === 'rtl' ? 'rtl' : 'ltr';
    } else {
      dir = el.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
    }
  }

  const nextIndex = getRovingIndex(event.key, currentIndex, isFocusable, {
    orientation,
    loop,
    dir,
  });

  if (nextIndex === null) {
    return null;
  }

  event.preventDefault();

  for (let i = 0; i < count; i++) {
    items[i].tabIndex = i === nextIndex ? 0 : -1;
  }

  const nextItem = items[nextIndex];
  nextItem?.focus();
  return nextItem ?? null;
};
