import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr, useControllableState } from '@leve-ui/utils';
import { accordionContextId } from './accordion-context';

export type AccordionRootProps = PropsOf<'div'> & {
  /**
   * アコーディオンの展開モード。
   * - `'single'`: 同時に開く項目は最大 1 つ（既定値）
   * - `'multiple'`: 複数の項目を同時に開くことができる
   */
  type?: 'single' | 'multiple';
  /**
   * 非制御モードでの初期展開状態の項目値リスト。既定値は `[]`
   */
  defaultValue?: string[];
  /**
   * 制御モードでの展開項目値リストの Signal
   */
  'bind:value'?: Signal<string[]>;
  /**
   * ユーザー操作で展開項目値リストが変更されたときに呼ばれるコールバック
   */
  onValueChange$?: QRL<(value: string[]) => void>;
  /**
   * `type="single"` のとき、開いている項目をクリックして閉じられるかどうか。既定値は `false`
   */
  collapsible?: boolean;
  /**
   * すべての項目を無効化するかどうか。既定値は `false`
   */
  disabled?: boolean;
  /**
   * アコーディオンの配置方向。キーボードの矢印キー操作に影響します。既定値は `'vertical'`
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * 矢印キー移動時に末尾から先頭（または先頭から末尾）へループするかどうか。既定値は `true`
   */
  loop?: boolean;
};

/**
 * 垂直または水平に並んだ見出し群と、それぞれに対応するコンテンツ領域を包括するルート要素です。
 *
 * WAI-ARIA APG の Accordion パターンに準拠しています。
 * 非制御モード（`defaultValue`）と制御モード（`bind:value` / `onValueChange$`）の両方に対応しています。
 */
export const AccordionRoot = component$<AccordionRootProps>(
  ({
    type = 'single',
    defaultValue = [],
    'bind:value': bindValue,
    onValueChange$,
    collapsible = false,
    disabled = false,
    orientation = 'vertical',
    loop = true,
    ...props
  }) => {
    const [valueSignal, setValue$] = useControllableState<string[]>({
      value: bindValue,
      defaultValue,
      onChange$: onValueChange$,
    });

    const typeSignal = useComputed$(() => type);
    const collapsibleSignal = useComputed$(() => Boolean(collapsible));
    const disabledSignal = useComputed$(() => Boolean(disabled));
    const orientationSignal = useComputed$(() => orientation);
    const loopSignal = useComputed$(() => Boolean(loop));

    const toggleItem$ = $(async (itemValue: string) => {
      const current = valueSignal.value;
      if (typeSignal.value === 'multiple') {
        const next = current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
        await setValue$(next);
      } else {
        if (current.includes(itemValue)) {
          if (collapsibleSignal.value) {
            await setValue$([]);
          }
        } else {
          await setValue$([itemValue]);
        }
      }
    });

    useContextProvider(accordionContextId, {
      value: valueSignal,
      toggleItem$,
      type: typeSignal,
      collapsible: collapsibleSignal,
      disabled: disabledSignal,
      orientation: orientationSignal,
      loop: loopSignal,
    });

    return (
      <div
        {...props}
        data-leve-accordion=""
        data-orientation={orientation}
        data-disabled={dataAttr(disabled)}
      >
        <Slot />
      </div>
    );
  },
);
