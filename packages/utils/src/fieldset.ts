import { createContextId, type ReadonlySignal, useContext } from '@builder.io/qwik';

/**
 * `Fieldset.Root` が子孫に提供する Context の値。
 * ネイティブの `<fieldset disabled>` と同じく、leve-ui のフォームコントロールも無効にするために使います。
 */
export interface FieldsetContext {
  /** この Fieldset（または祖先の Fieldset）が無効化されているかどうか */
  disabled: ReadonlySignal<boolean>;
  /**
   * 祖先の Fieldset が無効化されているかどうか。
   * HTML と同じく、最初の `<legend>` の中のコントロールはこの Fieldset の `disabled` の影響を受けないため、
   * `Fieldset.Legend` はこの値を子孫に提供します。
   */
  parentDisabled: ReadonlySignal<boolean>;
}

/** Fieldset の無効状態を共有するための Context ID。 */
export const fieldsetContextId = createContextId<FieldsetContext>('leve-ui.fieldset');

/**
 * 囲んでいる Fieldset の Context を取得します。Fieldset の外では `null` を返します。
 */
export const useFieldsetContext = (): FieldsetContext | null => {
  return useContext(fieldsetContextId, null);
};
