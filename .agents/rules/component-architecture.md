---
trigger: always_on
description: headless コンポーネントのパーツ分割・props・data 属性の設計ルール
---

# コンポーネント設計（パーツ分割・Headless）

利用者が後からスタイルを当てられるよう、コンポーネントは見た目を持たないパーツの集まりとして作る。`packages/components/avatar` が見本の実装。

## パーツ分割

- DOM 要素 1 つにつき、パーツコンポーネント 1 つにする。利用者が装飾したい要素は、必ず独立したパーツとして外に出す。
  - 例: Dialog → `Root` / `Trigger` / `Portal` / `Overlay` / `Content` / `Title` / `Description` / `Close`
- 1 パーツ 1 ファイル。ファイル名は `<name>-<part>.tsx`、コンポーネント名は `<Name><Part>`（例: `AvatarImage`）。
- パーツは namespace export で公開する。

```ts
// <name>.ts
export { AvatarRoot as Root } from './avatar-root';
export { AvatarImage as Image } from './avatar-image';

// index.ts
export * as Avatar from './avatar';
export type { AvatarRootProps, AvatarImageProps } from './...';
```

利用側は `<Avatar.Root><Avatar.Image /></Avatar.Root>` と書く。

- パーツ間の状態共有は `createContextId<XxxContext>('leve-ui.<name>')` で作る Context を使う。Root が `useContextProvider`、子パーツが `useContext` する。props のバケツリレーはしない。

## スタイルを持たない

- `class`、`style`、CSS ファイルをライブラリ側で出力・同梱しない。
- 例外として、機能上必要な最小限のインラインスタイル（スクリーンリーダー専用テキストの視覚的非表示、ポジショニングの座標など）は許可する。その場合は理由をコメントに書く。
- 表示/非表示は `hidden` 属性や条件付きレンダリングで行い、見た目の指定はしない。

## スタイリング用のフック（data 属性）

すべてのパーツに、以下の data 属性を出力する。

| 属性                       | 用途                                        | 例                                                                         |
| -------------------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| `data-leve-<name>-<part>` | パーツの識別（Root は `data-leve-<name>`） | `data-leve-avatar-image=""`                                               |
| `data-state`               | 状態                                        | `open` / `closed`、`checked` / `unchecked`、`loading` / `loaded` / `error` |
| `data-disabled`            | 無効状態                                    | `dataAttr(disabled)`（`@leve-ui/utils`）                                  |
| `data-orientation` など    | 必要に応じて                                | `horizontal` / `vertical`                                                  |

真偽値の data 属性は `@leve-ui/utils` の `dataAttr()` を使い、`false` のときは属性自体を出さない。

## Props

- 各パーツの props 型は `PropsOf<'要素名'> & { 独自 props }` とし、`<Name><Part>Props` として export する。
- 受け取った props は描画する要素にすべて渡す（`{...props}`）。こうすることで `class`、`style`、`aria-*`、`data-*`、イベントを利用者が自由に指定できる。
- ライブラリが必ず出す属性（`role`、必須の `aria-*`、`data-leve-*`、`data-state`）は `{...props}` の後に書く。
- イベントハンドラは上書きせず、配列で合成する: `onClick$={[internalHandler$, props.onClick$]}`。
- 状態を持つコンポーネントは、制御と非制御の両方に対応する。
  - 非制御: `default<State>`（例: `defaultOpen`）
  - 制御: `bind:<state>`（例: `bind:open`、`Signal<boolean>`）
  - 変更通知: `on<State>Change$`（例: `onOpenChange$`）
  - 実装には `@leve-ui/utils` の `useControllableState` を使い、自前で同期処理を書かない。props の型は `'bind:open'?: Signal<boolean>` のように書く（`bind:` の値は `props['bind:open']` で受け取る）。

```tsx
const [open, setOpen$] = useControllableState({
  value: props['bind:open'],
  defaultValue: props.defaultOpen ?? false,
  onChange$: props.onOpenChange$,
});
// 読む: open.value / 変える: setOpen$(!open.value)（onOpenChange$ はこの setter で変わったときだけ呼ばれる）
```
- 子要素は `<Slot />` で受け取る。

## Qwik 固有の注意

- 公開するコンポーネントはすべて `component$` で作る。
- サーバーで実行できない処理（DOM の計測、`focus()` など）は、`isServer` で分岐するか `useVisibleTask$` を使う。`useVisibleTask$` は本当に必要なときだけ使い、理由をコメントと `biome-ignore` に書く。
- SSR とクライアントで描画結果が変わらないようにする（ID は `useId()` を使い、`Math.random()` は使わない）。
- 親パーツの属性は子パーツより先に SSR 出力される。子が決める状態を親の属性に反映させない（Avatar の Root に `data-state` がないのはこのため）。
