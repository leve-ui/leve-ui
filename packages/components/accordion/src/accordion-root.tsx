import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr, useControllableState } from '@leve-ui/utils';
import { accordionContextId } from './accordion-context';

export type AccordionRootProps = PropsOf<'div'> & {
  /**
   * How many items can be open at once.
   * - `'single'`: at most one item
   * - `'multiple'`: any number of items
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /**
   * The values of the items that are open initially (uncontrolled).
   * @default []
   */
  defaultValue?: string[];
  /** A signal with the values of the open items (controlled). */
  'bind:value'?: Signal<string[]>;
  /** Called when the user opens or closes an item. */
  onValueChange$?: QRL<(value: string[]) => void>;
  /**
   * When `type` is `'single'`, allows closing the open item by activating it again.
   * @default false
   */
  collapsible?: boolean;
  /**
   * Disables all items.
   * @default false
   */
  disabled?: boolean;
  /**
   * The orientation of the accordion, which decides the arrow keys that move focus.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Whether arrow keys wrap from the last trigger to the first and vice versa.
   * @default true
   */
  loop?: boolean;
};

/**
 * 垂直または水平に並んだ見出し群と、それぞれに対応するコンテンツ領域を包括するルート要素です。
 *
 * WAI-ARIA APG の Accordion パターンに準拠しています。
 * 非制御モード（`defaultValue`）と制御モード（`bind:value` / `onValueChange$`）の両方に対応しています。
 */
export const AccordionRoot = component$<AccordionRootProps>(
  ({
    type = 'single',
    defaultValue = [],
    'bind:value': bindValue,
    onValueChange$,
    collapsible = false,
    disabled = false,
    orientation = 'vertical',
    loop = true,
    ...props
  }) => {
    const [valueSignal, setValue$] = useControllableState<string[]>({
      value: bindValue,
      defaultValue,
      onChange$: onValueChange$,
    });

    const typeSignal = useComputed$(() => type);
    const collapsibleSignal = useComputed$(() => Boolean(collapsible));
    const disabledSignal = useComputed$(() => Boolean(disabled));
    const orientationSignal = useComputed$(() => orientation);
    const loopSignal = useComputed$(() => Boolean(loop));

    const toggleItem$ = $(async (itemValue: string) => {
      const current = valueSignal.value;
      if (typeSignal.value === 'multiple') {
        const next = current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
        await setValue$(next);
      } else {
        if (current.includes(itemValue)) {
          if (collapsibleSignal.value) {
            await setValue$([]);
          }
        } else {
          await setValue$([itemValue]);
        }
      }
    });

    useContextProvider(accordionContextId, {
      value: valueSignal,
      toggleItem$,
      type: typeSignal,
      collapsible: collapsibleSignal,
      disabled: disabledSignal,
      orientation: orientationSignal,
      loop: loopSignal,
    });

    return (
      <div
        {...props}
        data-leve-accordion=""
        data-orientation={orientation}
        data-disabled={dataAttr(disabled)}
      >
        <Slot />
      </div>
    );
  },
);
