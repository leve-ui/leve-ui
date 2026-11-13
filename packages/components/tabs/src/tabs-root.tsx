import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useStore,
} from '@builder.io/qwik';
import { useControllableState } from '@leve-ui/utils';
import { type TriggerItem, tabsContextId } from './tabs-context';

export type TabsRootProps = PropsOf<'div'> & {
  /**
   * The value of the tab selected initially (uncontrolled).
   * @default null
   */
  defaultValue?: string | null;
  /** A signal with the value of the selected tab (controlled). */
  'bind:value'?: Signal<string | null> | Signal<string>;
  /** Called when the selected tab changes. */
  onValueChange$?: QRL<(value: string) => void>;
  /**
   * The orientation of the tab list.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * How a tab is selected.
   * - `'automatic'`: selected when it receives focus
   * - `'manual'`: focus moves only; Enter or Space selects
   * @default 'automatic'
   */
  activationMode?: 'automatic' | 'manual';
  /**
   * Whether arrow keys wrap from the last tab to the first and vice versa.
   * @default true
   */
  loop?: boolean;
};

/**
 * タブコンポーネントのルート要素です。
 *
 * WAI-ARIA APG の Tabs パターンに準拠しています。
 * タブの選択状態、配置方向（orientation）、選択方式（activationMode）、ループ設定などを管理し、
 * 子パーツに対して Context を提供します。
 */
export const TabsRoot = component$<TabsRootProps>((allProps) => {
  const { defaultValue = null, 'bind:value': bindValue, onValueChange$, ...props } = allProps;

  const baseId = useId();
  const triggers = useStore<TriggerItem[]>([]);

  const [selectedVal, setVal$] = useControllableState<string | null>({
    value: bindValue as Signal<string | null> | undefined,
    defaultValue: defaultValue ?? null,
    onChange$: onValueChange$
      ? $((val: string | null) => {
          if (val !== null) {
            onValueChange$(val);
          }
        })
      : undefined,
  });

  const setSelectedVal$ = $((val: string) => setVal$(val));

  const orientationSignal = useComputed$(() => allProps.orientation ?? 'horizontal');
  const activationModeSignal = useComputed$(() => allProps.activationMode ?? 'automatic');
  const loopSignal = useComputed$(() => allProps.loop ?? true);

  useContextProvider(tabsContextId, {
    baseId,
    selectedVal,
    setSelectedVal$,
    orientation: orientationSignal,
    activationMode: activationModeSignal,
    loop: loopSignal,
    triggers,
  });

  return (
    <div {...props} data-leve-tabs="" data-orientation={orientationSignal.value}>
      <Slot />
    </div>
  );
});
