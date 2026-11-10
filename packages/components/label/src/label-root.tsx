import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type LabelRootProps = PropsOf<'label'>;

/**
 * コントロールのラベルです。
 *
 * 該当する APG パターンはないため、ネイティブの `<label>` を使います。
 * `for` でコントロールの `id` を指定するか、コントロールを子要素として包んでください。
 * Field の中では `Field.Label` を使ってください。
 */
export const LabelRoot = component$<LabelRootProps>((props) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: コントロールとの関連付けは利用者が for 属性か子要素で行う
    <label {...props} data-leve-label="">
      <Slot />
    </label>
  );
});
