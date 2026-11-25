import { type QRL, type Signal, useVisibleTask$ } from '@builder.io/qwik';
import { getElementByIdInContainer } from './dom';

/**
 * `HiddenInput` 要素が所属する `<form>` 要素を取得します。
 *
 * ネイティブの `element.form` に加え、`form="id"` 属性による外部フォームへの関連付けを
 * Qwik コンテナ境界（`getElementByIdInContainer`）を考慮して解決し、
 * それでも見つからない場合は `closest('form')` にフォールバックします。
 */
export function getOwnerForm(element: HTMLInputElement): HTMLFormElement | null {
  if (element.form) return element.form;
  const formId = element.getAttribute('form');
  if (formId) {
    const target = getElementByIdInContainer(element, formId);
    if (target?.tagName === 'FORM') {
      return target as HTMLFormElement;
    }
  }
  return element.closest('form');
}

function attachFormReset(input: HTMLInputElement, onReset$: QRL<() => void>): () => void {
  const form = getOwnerForm(input);
  if (!form) {
    return function noop() {};
  }

  function handleReset(event: Event) {
    queueMicrotask(() => {
      if (event.defaultPrevented) return;
      void onReset$();
    });
  }

  form.addEventListener('reset', handleReset);
  return function cleanup() {
    form.removeEventListener('reset', handleReset);
  };
}

/**
 * `HiddenInput` 要素が所属する `<form>` の `reset` イベントを監視し、
 * フォームがリセットされたときに `onReset$` を呼び出します。
 *
 * `queueMicrotask` で実行を遅らせることで、他の同期的な `reset` リスナーによる
 * `preventDefault()` とブラウザ自身のネイティブリセットが完了した後に
 * Qwik の状態復元と隠し入力の DOM プロパティ同期を行えます。
 */
export function useFormReset(
  inputRef: Signal<HTMLInputElement | undefined>,
  onReset$: QRL<() => void>,
): void {
  // biome-ignore lint/correctness/noQwikUseVisibleTask: 所属する form 要素の DOM reset イベントを購読する必要があるため
  useVisibleTask$(
    ({ track, cleanup }) => {
      const input = track(() => inputRef.value);
      if (!input) return;
      cleanup(attachFormReset(input, onReset$));
    },
    { strategy: 'document-ready' },
  );
}
