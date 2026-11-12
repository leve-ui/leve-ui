import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface TriggerItem {
  value: string;
  disabled: boolean;
}

export interface TabsContext {
  baseId: string;
  selectedVal: ReadonlySignal<string | null>;
  setSelectedVal$: QRL<(value: string) => Promise<void>>;
  orientation: ReadonlySignal<'horizontal' | 'vertical'>;
  activationMode: ReadonlySignal<'automatic' | 'manual'>;
  loop: ReadonlySignal<boolean>;
  triggers: TriggerItem[];
}

export const tabsContextId = createContextId<TabsContext>('leve-ui.tabs');

/**
 * ID として安全な文字列に変換します。
 * 英数字・ハイフン・アンダースコア以外の文字をハイフンに置換します。
 */
export const safeId = (value: string): string => value.replace(/[^a-zA-Z0-9_-]/g, '-');

/**
 * 指定された baseId と value から Trigger 要素の ID を生成します。
 */
export const getTriggerId = (baseId: string, value: string): string =>
  `${baseId}-trigger-${safeId(value)}`;

/**
 * 指定された baseId と value から Content 要素の ID を生成します。
 */
export const getContentId = (baseId: string, value: string): string =>
  `${baseId}-content-${safeId(value)}`;
