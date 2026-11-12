import {
  autoUpdate,
  computePosition,
  flip,
  arrow as floatingArrow,
  limitShift,
  offset,
  type Placement,
  shift,
  size,
} from '@floating-ui/dom';
import { isBrowser } from './env';

export type { Placement };

/**
 * フローティング要素を配置する基準辺。
 */
export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * フローティング要素の基準辺に沿った配置位置。
 */
export type FloatingAlign = 'start' | 'center' | 'end';

/**
 * Floating UI が参照先（アンカー）として受け付ける要素または仮想要素。
 * （例: ポインタ座標などの仮想要素）
 */
export type FloatingAnchor =
  | Element
  | { getBoundingClientRect(): DOMRect | ClientRect; contextElement?: Element };

/**
 * フローティング配置のオプション。
 */
export interface FloatingOptions {
  /**
   * 配置する基準辺。
   *
   * @default 'bottom'
   */
  side?: FloatingSide;

  /**
   * 基準辺に沿った配置位置。
   *
   * @default 'center'
   */
  align?: FloatingAlign;

  /**
   * アンカー要素からの距離（px）。
   *
   * @default 0
   */
  sideOffset?: number;

  /**
   * 基準辺に沿ったオフセット（px）。
   *
   * @default 0
   */
  alignOffset?: number;

  /**
   * 画面端との衝突時に反転（flip）や移動（shift）を行うかどうか。
   *
   * @default true
   */
  avoidCollisions?: boolean;

  /**
   * 画面端との衝突判定を行う際のパディング（px）。
   *
   * @default 0
   */
  collisionPadding?: number | Partial<Record<FloatingSide, number>>;

  /**
   * フローティング要素内の矢印要素。
   */
  arrow?: HTMLElement | null;

  /**
   * 矢印要素とフローティング要素の角との間のパディング（px）。
   *
   * @default 0
   */
  arrowPadding?: number;

  /**
   * CSS 変数のプレフィックス（例: `'--leve-popover'`）。
   */
  cssVarPrefix: `--${string}`;
}

/**
 * フローティング配置の計算結果。
 */
export interface FloatingResult {
  /** フローティング要素の X 座標（px）。 */
  x: number;
  /** フローティング要素の Y 座標（px）。 */
  y: number;
  /** 最終的に決定された配置辺（反転後）。 */
  side: FloatingSide;
  /** 最終的に決定されたアライメント。 */
  align: FloatingAlign;
  /** 矢印要素の X 座標（px）。 */
  arrowX?: number;
  /** 矢印要素の Y 座標（px）。 */
  arrowY?: number;
  /** アンカー要素の幅（px）。 */
  anchorWidth: number;
  /** アンカー要素の高さ（px）。 */
  anchorHeight: number;
  /** 利用可能な最大幅（px）。 */
  availableWidth: number;
  /** 利用可能な最大高さ（px）。 */
  availableHeight: number;
}

/**
 * `side` と `align` から Floating UI の `Placement` 文字列を生成します。
 *
 * @example
 * toPlacement('bottom', 'center') // 'bottom'
 * toPlacement('top', 'start') // 'top-start'
 */
export const toPlacement = (side: FloatingSide, align: FloatingAlign): Placement => {
  return align === 'center' ? side : (`${side}-${align}` as Placement);
};

/**
 * Floating UI の `Placement` 文字列から `side` と `align` を抽出します。
 *
 * @example
 * fromPlacement('top-end') // { side: 'top', align: 'end' }
 * fromPlacement('left') // { side: 'left', align: 'center' }
 */
export const fromPlacement = (
  placement: Placement,
): { side: FloatingSide; align: FloatingAlign } => {
  const [side, align] = placement.split('-') as [FloatingSide, FloatingAlign | undefined];
  return { side, align: align ?? 'center' };
};

/**
 * フローティング要素の配置座標およびサイズ情報を一度だけ非同期で計算します。
 */
export const computeFloating = async (
  anchor: FloatingAnchor,
  floating: HTMLElement,
  options: FloatingOptions,
): Promise<FloatingResult> => {
  const side = options.side ?? 'bottom';
  const align = options.align ?? 'center';
  const sideOffset = options.sideOffset ?? 0;
  const alignOffset = options.alignOffset ?? 0;
  const avoidCollisions = options.avoidCollisions ?? true;
  const collisionPadding = options.collisionPadding ?? 0;
  const arrowEl = options.arrow;
  const arrowPadding = options.arrowPadding ?? 0;

  let availableWidth = 0;
  let availableHeight = 0;
  let anchorWidth = 0;
  let anchorHeight = 0;

  const middleware = [
    offset({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
    ...(avoidCollisions
      ? [
          flip({ padding: collisionPadding }),
          shift({ padding: collisionPadding, limiter: limitShift() }),
        ]
      : []),
    size({
      padding: collisionPadding,
      apply({ availableWidth: aw, availableHeight: ah, rects }) {
        availableWidth = aw;
        availableHeight = ah;
        anchorWidth = rects.reference.width;
        anchorHeight = rects.reference.height;
      },
    }),
    ...(arrowEl ? [floatingArrow({ element: arrowEl, padding: arrowPadding })] : []),
  ];

  const { x, y, placement, middlewareData } = await computePosition(anchor, floating, {
    placement: toPlacement(side, align),
    strategy: 'fixed',
    middleware,
  });

  const finalPlacement = fromPlacement(placement);

  return {
    x,
    y,
    side: finalPlacement.side,
    align: finalPlacement.align,
    arrowX: middlewareData.arrow?.x,
    arrowY: middlewareData.arrow?.y,
    anchorWidth,
    anchorHeight,
    availableWidth,
    availableHeight,
  };
};

const staticSideMap: Record<FloatingSide, 'top' | 'right' | 'bottom' | 'left'> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

const EDGE_PROPERTIES = ['top', 'right', 'bottom', 'left'] as const;

/**
 * 計算された配置結果をフローティング要素および矢印要素の DOM に反映します。
 */
export const applyFloating = (
  floating: HTMLElement,
  result: FloatingResult,
  options: Pick<FloatingOptions, 'arrow' | 'cssVarPrefix'>,
): void => {
  // Positioning styles are an allowed inline style exception per ADR 0009 / ADR 0030.
  // Transform is intentionally not used so consumers can use CSS transforms for animations.
  // style.setProperty is used so unrelated inline styles are kept.
  floating.style.setProperty('position', 'fixed');
  floating.style.setProperty('left', `${Math.round(result.x)}px`);
  floating.style.setProperty('top', `${Math.round(result.y)}px`);

  floating.setAttribute('data-side', result.side);
  floating.setAttribute('data-align', result.align);

  const prefix = options.cssVarPrefix;
  floating.style.setProperty(`${prefix}-anchor-width`, `${result.anchorWidth}px`);
  floating.style.setProperty(`${prefix}-anchor-height`, `${result.anchorHeight}px`);
  floating.style.setProperty(`${prefix}-available-width`, `${result.availableWidth}px`);
  floating.style.setProperty(`${prefix}-available-height`, `${result.availableHeight}px`);

  const arrow = options.arrow;
  if (arrow) {
    arrow.style.setProperty('position', 'absolute');

    const staticSide = staticSideMap[result.side];
    for (const edge of EDGE_PROPERTIES) {
      if (edge === staticSide) {
        arrow.style.setProperty(edge, '0');
      } else if (edge === 'left' && result.arrowX != null) {
        arrow.style.setProperty('left', `${result.arrowX}px`);
      } else if (edge === 'top' && result.arrowY != null) {
        arrow.style.setProperty('top', `${result.arrowY}px`);
      } else {
        arrow.style.setProperty(edge, '');
      }
    }

    arrow.setAttribute('data-side', result.side);
  }
};

/**
 * フローティング要素の配置を開始します。
 * 初回および Floating UI の autoUpdate（スクロール、リサイズ、レイアウト変更）のたびに
 * 配置を計算して DOM に反映します。
 * クリーンアップ関数（べき等）を返します。
 */
export const startFloating = (
  anchor: FloatingAnchor,
  floating: HTMLElement,
  options: FloatingOptions & { onUpdate?: (result: FloatingResult) => void },
): (() => void) => {
  if (!isBrowser) {
    return () => {};
  }

  let cleanedUp = false;

  async function update() {
    if (cleanedUp) {
      return;
    }
    const result = await computeFloating(anchor, floating, options);
    if (cleanedUp) {
      return;
    }
    applyFloating(floating, result, options);
    options.onUpdate?.(result);
  }

  const cleanupAutoUpdate = autoUpdate(anchor, floating, () => {
    void update();
  });

  return () => {
    if (cleanedUp) {
      return;
    }
    cleanedUp = true;
    cleanupAutoUpdate();
  };
};
