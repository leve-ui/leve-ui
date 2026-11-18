/**
 * `from` と同じ Qwik コンテナ（`q:container` を持つ要素）の中から、id で要素を探します。
 *
 * Qwik の `useId()` は `q:base` とコンポーネントのハッシュと連番から id を作るため、1 つのページに
 * 複数のコンテナがあり（Astro のアイランド、Storybook の Docs ページ、`render()` を複数回呼ぶ構成など）、
 * 同じコンポーネントを描くと id が重複します。`document.getElementById` では最初のコンテナの要素が
 * 見つかってしまうため、パーツ同士の参照にはこの関数を使います（#167）。
 * コンテナの外にある（またはコンテナがない）ときは `document.getElementById` と同じです。
 */
export function getElementByIdInContainer<T extends HTMLElement = HTMLElement>(
  from: Element,
  id: string,
): T | null {
  const container = from.closest('[q\\:container]');
  if (container) {
    // An attribute selector, since CSS.escape is not available everywhere (e.g. the test DOM)
    const escaped = id.replace(/["\\]/g, '\\$&');
    const found = container.querySelector<T>(`[id="${escaped}"]`);
    if (found) return found;
  }
  return from.ownerDocument.getElementById(id) as T | null;
}
