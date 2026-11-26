import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { tagsInputContextId } from './tags-input-context';

export type TagsInputControlProps = PropsOf<'div'>;

/**
 * Visual container that wraps the tag items and text input.
 * Clicking non-interactive space inside the control focuses `TagsInput.Input`.
 */
export const TagsInputControl = component$<TagsInputControlProps>((props) => {
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
    <div
      {...props}
      id={props.id ?? context.ids.control}
      onClick$={[handleClick$, props.onClick$]}
      data-leve-tags-input-control=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      <Slot />
    </div>
  );
});
