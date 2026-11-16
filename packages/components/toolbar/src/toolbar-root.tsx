import {
  $,
  component$,
  type PropsOf,
  Slot,
  sync$,
  useComputed$,
  useContextProvider,
  useSignal,
  useStore,
} from '@builder.io/qwik';
import { moveRovingFocus, type ToolbarItemRegistration, toolbarContextId } from '@leve-ui/utils';

export type ToolbarRootProps = PropsOf<'div'> & {
  /**
   * The orientation of the toolbar, which decides the arrow keys that move focus.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Whether arrow keys wrap from the last item to the first and vice versa.
   * @default true
   */
  loop?: boolean;
};

const ITEM = '[data-leve-toolbar-item]';

/**
 * ボタンなどのコントロールをまとめるツールバーです。
 *
 * WAI-ARIA APG の Toolbar パターンに準拠し、`role="toolbar"` と `aria-orientation` を出力します。
 * タブストップは 1 つで、矢印キーと Home / End で項目間を移動します（ロービングタブインデックス）。
 * Tab で戻ってきたときは、最後にフォーカスした項目に入ります。
 *
 * 項目は `Toolbar.Button`、`Toolbar.Link` のほか、中に置いた Toggle と Toggle Group の項目も
 * 自動でツールバーの項目になります（Toggle Group 自身の矢印キー操作は止まります）。
 * アクセシブルネームは `aria-label` / `aria-labelledby` で指定してください。
 */
export const ToolbarRoot = component$<ToolbarRootProps>(
  ({ orientation: _orientation, loop: _loop, onKeyDown$, ...props }) => {
    const orientation = useComputed$(() => _orientation ?? 'horizontal');
    const loop = useComputed$(() => _loop ?? true);
    const items = useStore<ToolbarItemRegistration[]>([]);
    const activeId = useSignal<string | null>(null);

    useContextProvider(toolbarContextId, { orientation, items, activeId });

    // Stops the page from scrolling; Qwik handlers run asynchronously
    const preventScroll$ = sync$((event: KeyboardEvent, root: HTMLElement) => {
      const horizontal = root.getAttribute('aria-orientation') !== 'vertical';
      const keys = horizontal
        ? ['ArrowLeft', 'ArrowRight', 'Home', 'End']
        : ['ArrowUp', 'ArrowDown', 'Home', 'End'];
      const target = event.target as HTMLElement | null;
      if (keys.includes(event.key) && target?.closest('[data-leve-toolbar-item]')) {
        event.preventDefault();
      }
    });

    const move$ = $((event: KeyboardEvent, root: HTMLElement) => {
      const items = Array.from(root.querySelectorAll<HTMLElement>(ITEM)).filter(
        (el) => el.closest('[data-leve-toolbar]') === root,
      );
      moveRovingFocus(event, items, { orientation: orientation.value, loop: loop.value });
    });

    return (
      <div
        {...props}
        role="toolbar"
        aria-orientation={orientation.value}
        onKeyDown$={[preventScroll$, move$, onKeyDown$]}
        data-leve-toolbar=""
        data-orientation={orientation.value}
      >
        <Slot />
      </div>
    );
  },
);
