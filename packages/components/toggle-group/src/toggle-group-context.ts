import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

export interface ToggleGroupItemRegistration {
  value: string;
  disabled: boolean;
}

export interface ToggleGroupContext {
  value: ReadonlySignal<string[]>;
  toggleItem$: QRL<(value: string) => Promise<void>>;
  type: ReadonlySignal<'single' | 'multiple'>;
  disabled: ReadonlySignal<boolean>;
  orientation: ReadonlySignal<'horizontal' | 'vertical'>;
  loop: ReadonlySignal<boolean>;
  rovingFocus: ReadonlySignal<boolean>;
  items: ToggleGroupItemRegistration[];
  focusedValue: Signal<string | null>;
}

export const toggleGroupContextId = createContextId<ToggleGroupContext>('leve-ui.toggle-group');
