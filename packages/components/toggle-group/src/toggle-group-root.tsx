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
   * How many items can be pressed at once.
   * - `'single'`: zero or one item
   * - `'multiple'`: any number of items
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /**
   * The values of the items pressed initially (uncontrolled).
   * @default []
   */
  defaultValue?: string[];
  /** A signal with the values of the pressed items (controlled). */
  'bind:value'?: Signal<string[]>;
  /** Called when the pressed items change. */
  onValueChange$?: QRL<(value: string[]) => void>;
  /**
   * Disables all items.
   * @default false
   */
  disabled?: boolean;
  /**
   * The orientation of the group, which decides the arrow keys that move focus.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Whether arrow keys wrap from the last item to the first and vice versa.
   * @default true
   */
  loop?: boolean;
  /**
   * Manages focus with a roving tabindex and arrow keys.
   * When `false`, items are rendered without `tabIndex` or arrow key handlers and
   * each item is a regular tab stop. Use this when a parent such as a Toolbar manages focus.
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
