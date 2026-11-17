import {
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useContextProvider,
} from '@builder.io/qwik';
import { useControllableState } from '@leve-ui/utils';
import { menuRadioGroupContextId } from './menu-context';

export type MenuRadioGroupProps = PropsOf<'div'> & {
  /**
   * The value selected initially (uncontrolled).
   * @default null
   */
  defaultValue?: string | null;
  /** A signal with the selected value (controlled). */
  'bind:value'?: Signal<string | null>;
  /** Called when the user selects a value. */
  onValueChange$?: QRL<(value: string) => void>;
};

/**
 * どれか 1 つを選ぶ `Menu.RadioItem` のまとまりです。`role="group"` を出力します。
 * 名前は `aria-label` か、中の `Menu.GroupLabel`（`Menu.Group` で囲んだ場合）で付けてください。
 */
export const MenuRadioGroup = component$<MenuRadioGroupProps>(
  ({ defaultValue = null, 'bind:value': bindValue, onValueChange$, ...props }) => {
    const [value, setValue$] = useControllableState<string | null>({
      value: bindValue,
      defaultValue: defaultValue ?? null,
      onChange$: onValueChange$ as QRL<(value: string | null) => void> | undefined,
    });
    useContextProvider(menuRadioGroupContextId, { value, setValue$ });

    return (
      // biome-ignore lint/a11y/useSemanticElements: a <fieldset> is for form controls; the APG Menu uses role="group" for menuitemradio sets
      <div {...props} role="group" data-leve-menu-radio-group="">
        <Slot />
      </div>
    );
  },
);
