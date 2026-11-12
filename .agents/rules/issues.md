---
trigger: always_on
description: GitHub issue のラベル・Milestone の付け方と、issue を作るときのルール
---

# Issue の管理（ラベル・Milestone）

issue は GitHub で管理する。issue のタイトルと本文は **英語** で書く（利用者や Contributor が読むため。`adr/0021`）。コメントは日本語でもよい。

## ラベル

ラベルはプレフィックスで分類する。新しいラベルは、既存のプレフィックスに合うものだけを作る。

### `type:`（必ず 1 つ付ける）

| ラベル             | 用途                                                    |
| ------------------ | ------------------------------------------------------- |
| `type: component`  | 新しいコンポーネント                                    |
| `type: feature`    | 既存コンポーネントへの機能追加                          |
| `type: bug`        | 不具合                                                  |
| `type: a11y`       | アクセシビリティの問題（WAI-ARIA / APG からの逸脱など） |
| `type: foundation` | `packages/utils` などの共通処理                         |
| `type: adr`        | ライブラリ全体の設計判断が必要なもの                    |
| `type: docs`       | ドキュメントのみ                                        |
| `type: tooling`    | CI・ビルド・リリース・リポジトリの設定                  |

### `scope:`（関わる場所。1 つ以上）

- コンポーネント: `scope: <name>`（`packages/components/<name>` のディレクトリ名。例: `scope: dialog`）。コンポーネントの issue を作るときに、なければ作る。
- その他: `scope: utils`、`scope: docs`、`scope: storybook`、`scope: e2e`
- commitlint の scope と同じ名前にする。

### `status:`（進み具合。必要に応じて 1 つ）

| ラベル                 | 意味                                               |
| ---------------------- | -------------------------------------------------- |
| `status: needs triage` | メンテナーが未確認（テンプレートから自動で付く）   |
| `status: needs design` | APG パターン・パーツ構成・API を検討中             |
| `status: needs adr`    | ADR が Accepted になるまで着手できない             |
| `status: blocked`      | 他の issue を待っている（本文に `Blocked by #N`）  |
| `status: ready`        | 着手できる                                         |
| `status: in progress`  | 着手中（対応を開始する際に必ず付ける）             |

### `size:`（規模の目安）

- `size: S`: パーツが少なく、状態もほとんどない（例: Separator、Toggle）
- `size: M`: 状態やキーボード操作がある（例: Tabs、Dialog）
- `size: L`: 状態やキーボード操作の仕組みが複雑（例: Combobox、Date Picker）

### その他

`breaking change`、`good first issue`、`help wanted`、`question`、`duplicate`、`invalid`、`wontfix`

## Milestone

コンポーネントは依存関係の順に Milestone へ割り当てる。前の Milestone の共通処理を使うものは、それが終わるまで `status: blocked` にする。

| Milestone        | 内容                                                         |
| ---------------- | ------------------------------------------------------------ |
| M0: Foundation   | `packages/utils` の共通処理と、ライブラリ全体の ADR          |
| M1: Standalone   | 重ねて表示しない単体のコンポーネント                         |
| M2: Overlay      | Dialog・Popover・Menu など、重ねて表示するコンポーネント     |
| M3: Inputs       | 入力系のコンポーネント                                       |
| M4: Collections  | Listbox・Select・Combobox など、一覧から選ぶコンポーネント   |
| M5: Advanced     | Date Picker・Tour など大きなもの                             |

## issue に着手するときのルール

- **issue の対応を開始する際は、必ず `status: in progress` ラベルを付ける（義務）。**
  - `status: ready` など既存のステータスラベルが付いている場合は、`status: in progress` に付け替える。
  - 重複作業の防止と進行状況の可視化のため、作業開始前のラベル更新を必須とする。

## コンポーネントの issue に書くこと

`.github/ISSUE_TEMPLATE/component_request.yml` の項目に沿う。

- 対応する APG パターンのリンク（ない場合は、採用するネイティブ要素や方針）
- パーツ案（DOM 要素 1 つ = パーツ 1 つ。`component-architecture.md` を参照）
- 必要なキーボード操作
- 依存する共通処理や ADR（`Blocked by #N`）
