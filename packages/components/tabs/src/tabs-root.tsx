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
   * 初期状態で選択されるタブの value（非制御モード）。
   * @default null
   */
  defaultValue?: string | null;
  /**
   * 選択中のタブの value を保持する Signal（制御モード）。
   */
  'bind:value'?: Signal<string | null> | Signal<string>;
  /**
   * 選択中のタブが変わったときに呼ばれるコールバック。
   */
  onValueChange$?: QRL<(value: string) => void>;
  /**
   * タブの配置方向。
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * タブの選択方式。
   * - `'automatic'`: フォーカス移動と同時に選択する
   * - `'manual'`: フォーカス移動のみ行い、Enter / Space で選択する
   * @default 'automatic'
   */
  activationMode?: 'automatic' | 'manual';
  /**
   * 端に達したときに反対側の端へループするかどうか。
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
