import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { accordionContextId, accordionItemContextId } from './accordion-context';

export type AccordionHeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type AccordionHeaderProps = PropsOf<'h3'> & {
  /**
   * 見出しレベル（1〜6）。既定値は 3
   */
  level?: AccordionHeaderLevel;
};

/**
 * アコーディオントリガーを内包する見出し要素です。
 *
 * `level` プロパティ（1〜6、既定値 3）に応じたネイティブの `<h1>`〜`<h6>` タグを出力します。
 */
export const AccordionHeader = component$<AccordionHeaderProps>(({ level = 3, ...props }) => {
  const rootContext = useContext(accordionContextId);
  const itemContext = useContext(accordionItemContextId);

  const commonProps = {
    ...props,
    'data-leve-accordion-header': '',
    'data-state': itemContext.open.value ? 'open' : 'closed',
    'data-disabled': dataAttr(itemContext.disabled.value),
    'data-orientation': rootContext.orientation.value,
  };

  switch (level) {
    case 1:
      return (
        <h1 {...commonProps}>
          <Slot />
        </h1>
      );
    case 2:
      return (
        <h2 {...commonProps}>
          <Slot />
        </h2>
      );
    case 3:
      return (
        <h3 {...commonProps}>
          <Slot />
        </h3>
      );
    case 4:
      return (
        <h4 {...commonProps}>
          <Slot />
        </h4>
      );
    case 5:
      return (
        <h5 {...commonProps}>
          <Slot />
        </h5>
      );
    case 6:
      return (
        <h6 {...commonProps}>
          <Slot />
        </h6>
      );
    default:
      return (
        <h3 {...commonProps}>
          <Slot />
        </h3>
      );
  }
});
