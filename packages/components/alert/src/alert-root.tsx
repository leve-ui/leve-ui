import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type AlertRootProps = PropsOf<'div'> & {
  /**
   * Whether the alert is a live region (`role={live === false ? undefined : 'alert'}
      data-live={live === false ? undefined : ''}`) that screen readers announce. Set it to
   * `false` for a notice that is on the page from the start, so that it is read as normal content.
   * @default true
   */
  live?: boolean;
};

/**
 * ユーザーの作業を中断せずに、重要なメッセージを伝えます。
 *
 * APG の Alert パターン（https://www.w3.org/WAI/ARIA/apg/patterns/alert/）に従い、
 * `role={live === false ? undefined : 'alert'}
      data-live={live === false ? undefined : ''}` を付けます。フォーカスは移動せず、自分では閉じません
 * （一時的な通知には Toast を使ってください）。
 * 描画済みの Alert は読み上げられないことがあるため、表示するときに描画してください。
 * ページを開いたときから表示している注記には `live={false}` を渡し、`role` を出力しないようにします。
 */
export const AlertRoot = component$<AlertRootProps>(({ live, ...props }) => {
  return (
    <div {...props} role={live === false ? undefined : 'alert'} data-leve-alert="">
      <Slot />
    </div>
  );
});
