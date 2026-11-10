---
trigger: always_on
description: モノレポのディレクトリ構成とファイル配置のルール
---

# プロジェクトのディレクトリ構成

```
levis-ui/
├── apps/                          # 公開しないアプリ（すべて "private": true）
│   ├── docs/                      # @levis-ui/docs       ドキュメントサイト（Qwik City）
│   ├── storybook/                 # @levis-ui/storybook  Storybook
│   │   └── stories/<name>.stories.tsx
│   └── e2e/                       # @levis-ui/e2e        Playwright
│       └── tests/<name>.spec.ts
├── packages/                      # npm に公開するパッケージ
│   ├── levis-ui/                  # levis-ui             全部入り（再エクスポートのみ）
│   ├── components/
│   │   └── <name>/                # @levis-ui/<name>     個別コンポーネント
│   │       └── src/
│   │           ├── index.ts               # 公開 API（namespace export と型）
│   │           ├── <name>.ts              # パーツの束ね（Root, Trigger, ...）
│   │           ├── <name>-context.ts      # Context 定義
│   │           ├── <name>-<part>.tsx      # パーツごとのコンポーネント
│   │           └── <name>.test.tsx        # ユニットテスト
│   └── utils/                     # @levis-ui/utils      コンポーネント間で共有する内部ユーティリティ
├── tooling/                       # 共有設定（private）
│   ├── tsconfig/                  # @levis-ui/tsconfig   base / library / app
│   └── vite-config/               # @levis-ui/vite-config
├── adr/                           # 設計判断の記録（ADR、英語で書く）
│   ├── README.md                  # 運用ルールと一覧
│   ├── template.md
│   └── NNNN-<title>.md
├── .changeset/
├── .agents/
│   ├── rules/                     # AI 向けの制約（常に読み込まれる）
│   └── skills/<name>/SKILL.md     # AI 向けの作業手順（必要なときに読み込まれる）
├── .claude/rules -> ../.agents/rules
├── .claude/skills -> ../.agents/skills
├── AGENTS.md                      # AI エージェント向けの入口（正本）
├── CLAUDE.md -> AGENTS.md
├── biome.json
├── LICENSE                        # MIT（各公開パッケージにもコピーを置く）
├── commitlint.config.ts
├── lefthook.yml                   # git フック（commitlint / Biome）
├── pnpm-workspace.yaml
└── turbo.json
```

## 配置のルール

- コンポーネントの実装は `packages/components/<name>/` にだけ置く。`packages/levis-ui` には実装を書かず、再エクスポートだけを行う。
- 2 つ以上のコンポーネントで使うロジック（ID 生成、フォーカス管理、キーボード操作、制御/非制御の状態管理など）は `packages/utils` に置く。コンポーネントパッケージ同士で直接依存させない（循環依存の防止）。
- ストーリーは `apps/storybook/stories/`、E2E は `apps/e2e/tests/` に置く。パッケージ内には置かない。
- ディレクトリ名・ファイル名は kebab-case。パッケージ名は `@levis-ui/<ディレクトリ名>` にする。
- 上記にないトップレベルのディレクトリやワークスペースを新設する場合は、作業前にユーザーに確認する。

## 新しいコンポーネントの追加

新しいコンポーネントは、必ず `create-component` スキル（`.agents/skills/create-component/`）の手順で追加する。手作業で他のコンポーネントをコピーしない。

## パッケージ設定の約束事

- ライブラリの `exports` には `@levis-ui/source` 条件（`./src/index.ts`）を先頭に置く。docs / storybook はこの条件で src を直接読むため、ビルドなしで変更が反映される。
- `@builder.io/qwik` は `peerDependencies` に置き、`devDependencies` にも同じバージョンを入れる。
- ビルド設定は `@levis-ui/vite-config` の `defineLibraryConfig` を使い、各パッケージで独自設定を増やさない。
- ライセンスは MIT（`adr/0016`）。公開パッケージには必ず以下を揃える。
  - `package.json` に `"license": "MIT"`
  - パッケージのフォルダに `LICENSE`（ルートの `LICENSE` のコピー。npm はパッケージのフォルダ内の LICENSE だけを同梱するため）
  - `package.json` の `repository`（`directory` にパッケージのパス）、`homepage`、`bugs`
- ルートの `LICENSE` を変更した場合は、すべての公開パッケージの `LICENSE` も同じ内容に更新する。
