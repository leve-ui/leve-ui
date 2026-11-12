import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface RadioGroupIds {
  label: string;
  root: string;
}

export interface RadioGroupItemRegistration {
  value: string;
  disabled: boolean;
}

export interface RadioGroupContext {
  ids: RadioGroupIds;
  value: ReadonlySignal<string | null>;
  select$: QRL<(value: string) => void>;
  disabled: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  orientation: ReadonlySignal<'horizontal' | 'vertical'>;
  loop: ReadonlySignal<boolean>;
  items: RadioGroupItemRegistration[];
}

export const radioGroupContextId = createContextId<RadioGroupContext>('leve-ui.radio-group');

export interface RadioGroupItemContext {
  checked: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
}

export const radioGroupItemContextId = createContextId<RadioGroupItemContext>(
  'leve-ui.radio-group-item',
);
