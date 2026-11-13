import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import {
  type AccordionItemIds,
  accordionContextId,
  accordionItemContextId,
} from './accordion-context';

export type AccordionItemProps = PropsOf<'div'> & {
  /** A unique value that identifies this item. */
  value: string;
  /**
   * Disables this item.
   * @default false
   */
  disabled?: boolean;
};

/**
 * アコーディオンの 1 つのヘッダーとコンテンツのペアを包括する要素です。
 */
export const AccordionItem = component$<AccordionItemProps>(
  ({ value, disabled = false, ...props }) => {
    const rootContext = useContext(accordionContextId);

    const base = useId();
    const ids: AccordionItemIds = {
      trigger: `${base}-trigger`,
      content: `${base}-content`,
    };

    const isOpen = useComputed$(() => rootContext.value.value.includes(value));
    const isDisabled = useComputed$(() => Boolean(disabled) || rootContext.disabled.value);

    useContextProvider(accordionItemContextId, {
      value,
      ids,
      open: isOpen,
      disabled: isDisabled,
    });

    return (
      <div
        {...props}
        data-leve-accordion-item=""
        data-state={isOpen.value ? 'open' : 'closed'}
        data-disabled={dataAttr(isDisabled.value)}
        data-orientation={rootContext.orientation.value}
      >
        <Slot />
      </div>
    );
  },
);
