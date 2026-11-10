import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type AlertRootProps = PropsOf<'div'>;

/**
 * ユーザーの作業を中断せずに、重要なメッセージを伝えます。
 *
 * APG の Alert パターン（https://www.w3.org/WAI/ARIA/apg/patterns/alert/）に従い、
 * `role="alert"` を付けます。フォーカスは移動せず、自分では閉じません
 * （一時的な通知には Toast を使ってください）。
 * 描画済みの Alert は読み上げられないことがあるため、表示するときに描画してください。
 */
export const AlertRoot = component$<AlertRootProps>((props) => {
  return (
    <div {...props} role="alert" data-leve-alert="">
      <Slot />
    </div>
  );
});
