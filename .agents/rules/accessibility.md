---
trigger: always_on
description: UI コンポーネントを WAI-ARIA / APG に準拠させるためのルール
---

# アクセシビリティ（WAI-ARIA 準拠）

すべての UI コンポーネントは WAI-ARIA と [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) に準拠させる。

## 実装前

- 対応する APG パターン（Dialog、Tabs、Menu Button、Combobox など）を確認し、パーツの `role`、`aria-*` 属性、キーボード操作、フォーカス管理の仕様を洗い出してから実装する。
- 該当する APG パターンがない場合は、ネイティブ HTML 要素の意味論を優先し、採用した方針をコンポーネントの JSDoc に書く。

## 必須事項

- **ネイティブ要素を優先する。** ボタンは `<button type="button">`、リンクは `<a>` を使う。`<div onClick$>` で代用しない。ネイティブで実現できない場合だけ `role` を付ける。
- **ARIA 属性はライブラリ側で必ず出力する。** `role`、`aria-expanded`、`aria-controls`、`aria-labelledby`、`aria-describedby`、`aria-selected`、`aria-checked` など、パターンで必須の属性を利用者に任せない。利用者の props で上書きされないよう、`{...props}` の後に書く。
- **パーツ間の ID 関連付けには `useId()` を使う。** SSR とクライアントで一致させるため。利用者が `id` を渡した場合はそちらを優先する。
- **APG が定めるキーボード操作をすべて実装する。** Enter / Space / Escape / 矢印キー / Home / End / Tab など。
- **フォーカスを管理する。** 開いたときの初期フォーカス、閉じたときのトリガーへの復帰、モーダルのフォーカストラップ、ロービングタブインデックス（`tabIndex` の 0 / -1 切り替え）を必要に応じて実装する。
- **ロービングタブインデックスは `@leve-ui/utils` の `moveRovingFocus` を使う。** 項目の `tabIndex` は、アクティブな 1 つだけ `0`、残りを `-1` で SSR 出力し、`keydown` で `moveRovingFocus(event, items, { orientation, loop })` を呼ぶ。矢印キーのスクロールを確実に止めるには `sync$` / `preventdefault:keydown` を併用する（Qwik のハンドラは非同期のため）。
- **無効状態の扱い。** ネイティブ要素なら `disabled`、それ以外は `aria-disabled="true"` を使う。フォーカスを残すかどうかは APG に従う。
- **状態は data 属性でも出す。** スタイル用に `data-state`、`data-disabled` など（`component-architecture.md` を参照）。ただし ARIA 属性の代わりにはしない。
- **アクセシブルネームを確保する。** ラベルが必要なパーツは、`aria-label` / `aria-labelledby` を受け取れるようにするか、Label パーツと関連付ける。
- **装飾要素は隠す。** アイコンなど意味を持たない要素には `aria-hidden="true"` を付ける。

## 禁止事項

- `aria-*` の誤用（存在しない属性、`role` と合わない属性）。
- ARIA を付けただけで、キーボード操作やフォーカス管理を実装しないこと。
- 正の値の `tabIndex`。
- `outline: none` などのフォーカス表示を消すスタイルの埋め込み（そもそもスタイルは出力しない）。

## 検証

- ユニットテストで `role` と `aria-*` 属性が出力されていることを確認する。
- キーボード操作とフォーカス移動は Playwright の E2E で確認する（`testing.md` を参照）。
