import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface AccordionRootContext {
  value: ReadonlySignal<string[]>;
  toggleItem$: QRL<(value: string) => Promise<void>>;
  type: ReadonlySignal<'single' | 'multiple'>;
  collapsible: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  orientation: ReadonlySignal<'vertical' | 'horizontal'>;
  loop: ReadonlySignal<boolean>;
}

export interface AccordionItemIds {
  trigger: string;
  content: string;
}

export interface AccordionItemContext {
  value: string;
  ids: AccordionItemIds;
  open: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
}

export const accordionContextId = createContextId<AccordionRootContext>('leve-ui.accordion');
export const accordionItemContextId =
  createContextId<AccordionItemContext>('leve-ui.accordion-item');
