import { createContextId, type Signal } from '@builder.io/qwik';

export interface FieldsetContext {
  disabled: Signal<boolean>;
}

export const fieldsetContextId = createContextId<FieldsetContext>('leve-ui.fieldset');
