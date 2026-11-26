import { $, type Component, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { tagsInputContextId } from './tags-input-context';

export type TagsInputControlProps = PropsOf<'div'> & {
  /**
   * The element or component to render instead of `<div>`. A component must spread the props it receives onto one element.
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * Visual container that wraps the tag items and text input.
 * Clicking non-interactive space inside the control focuses `TagsInput.Input`.
 */
export const TagsInputControl = component$<TagsInputControlProps>((props) => {
  const { as, onClick$, ...restProps } = props;
  const Element = (as ?? 'div') as Component<Record<string, unknown>>;
  const context = useContext(tagsInputContextId);
  const state = context.tags.value.length > 0 ? 'has-tags' : 'empty';

  const handleClick$ = $(async (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, input, [data-leve-tags-input-item]')) {
      return;
    }
    await context.focusInput$();
  });

  return (
    <Element
      {...restProps}
      id={props.id ?? context.ids.control}
      onClick$={[handleClick$, onClick$]}
      data-leve-tags-input-control=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      <Slot />
    </Element>
  );
});
