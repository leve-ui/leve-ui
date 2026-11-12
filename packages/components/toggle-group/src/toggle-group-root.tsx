import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useSignal,
  useStore,
} from '@builder.io/qwik';
import { dataAttr, useControllableState } from '@leve-ui/utils';
import { type ToggleGroupItemRegistration, toggleGroupContextId } from './toggle-group-context';

export type ToggleGroupRootProps = PropsOf<'div'> & {
  /**
   * 選択モード。
   * - `'single'`: 単一選択（0個または1個の値を保持）
   * - `'multiple'`: 複数選択（複数の値を保持）
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /**
   * 初期状態で押下される項目の value の配列（非制御モード）。
   * @default []
   */
  defaultValue?: string[];
  /**
   * 押下中の項目の value の配列を保持する Signal（制御モード）。
   */
  'bind:value'?: Signal<string[]>;
  /**
   * 押下状態が変わったときに呼ばれるコールバック。
   */
  onValueChange$?: QRL<(value: string[]) => void>;
  /**
   * グループ全体を無効化するかどうか。
   * すべての Item が無効化されます。
   */
  disabled?: boolean;
  /**
   * 項目の配置方向。矢印キーの操作方向に影響します。
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 端に達したときに反対側の端へループするかどうか。
   * @default true
   */
  loop?: boolean;
  /**
   * ロービングフォーカス管理を有効にするかどうか。
   * `false` の場合、グループはフォーカス管理を行いません。Item は `tabIndex` 属性なし・矢印キーハンドラなしで描画され、
   * 各 Item は通常のタブストップになります。Toolbar などの親コンポーネントがフォーカスを管理する場合に使用します。
   * @default true
   */
  rovingFocus?: boolean;
};

/**
 * 押下状態を切り替え可能なボタンのグループを提供するルート要素です。
 *
 * 固有の APG パターンは存在せず、Toggle Button パターン（https://www.w3.org/WAI/ARIA/apg/patterns/button/）のグループに
 * Toolbar パターン（https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/）と同様のロービングフォーカスを組み合わせた設計となっています。
 *
 * グループのアクセシブルネームとして、利用側で `aria-label` または `aria-labelledby` を指定してください。
 *
 * `rovingFocus` が `false` の場合、グループはフォーカス管理を行いません。Item は `tabIndex` 属性なし・矢印キーハンドラなしで描画され、
 * 各 Item は通常のタブストップになります。Toolbar などの親コンポーネントがフォーカスを管理する場合に使用します。
 */
export const ToggleGroupRoot = component$<ToggleGroupRootProps>((props) => {
  const {
    type: _type,
    defaultValue = [],
    'bind:value': bindValue,
    onValueChange$,
    disabled: _disabled,
    orientation: _orientation,
    loop: _loop,
    rovingFocus: _rovingFocus,
    ...restProps
  } = props;

  const [valueSignal, setValue$] = useControllableState<string[]>({
    value: bindValue,
    defaultValue: defaultValue ?? [],
    onChange$: onValueChange$,
  });

  const typeSignal = useComputed$(() => props.type ?? 'single');
  const disabledSignal = useComputed$(() => Boolean(props.disabled));
  const orientationSignal = useComputed$(() => props.orientation ?? 'horizontal');
  const loopSignal = useComputed$(() => props.loop ?? true);
  const rovingFocusSignal = useComputed$(() => props.rovingFocus ?? true);

  const toggleItem$ = $(async (itemValue: string) => {
    const current = valueSignal.value;
    const isPressed = current.includes(itemValue);
    let next: string[];

    if (typeSignal.value === 'multiple') {
      if (isPressed) {
        next = current.filter((v) => v !== itemValue);
      } else {
        next = [...current, itemValue];
      }
    } else {
      if (isPressed) {
        next = [];
      } else {
        next = [itemValue];
      }
    }

    await setValue$(next);
  });

  const focusedValue = useSignal<string | null>(null);
  const items = useStore<ToggleGroupItemRegistration[]>([]);

  useContextProvider(toggleGroupContextId, {
    value: valueSignal,
    toggleItem$,
    type: typeSignal,
    disabled: disabledSignal,
    orientation: orientationSignal,
    loop: loopSignal,
    rovingFocus: rovingFocusSignal,
    items,
    focusedValue,
  });

  return (
    // biome-ignore lint/a11y/useSemanticElements: APG Toolbar パターンと同様に、div[role="group"] でボタン群をグループ化するため
    <div
      {...restProps}
      role="group"
      data-leve-toggle-group=""
      data-orientation={orientationSignal.value}
      data-disabled={dataAttr(disabledSignal.value)}
    >
      <Slot />
    </div>
  );
});
