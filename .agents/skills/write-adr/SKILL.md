---
name: write-adr
description: levis-ui の設計判断を ADR（Architecture Decision Record）として adr/ に記録する手順。パッケージ構成・ビルド・ツール選定・公開 API の方針・複数コンポーネントに関わる設計原則・回避策など、ライブラリ全体に関わる判断をしたとき、または既存の ADR を覆す・廃止するときに使う。
---

# ADR を書く

運用ルールの正本は `adr/README.md`。

## ADR にするか判断する

書く: 公開 API の方針、パッケージ構成・ビルド・ツール選定、複数コンポーネントに関わる設計原則、一般的なやり方や APG から意図的に外れる判断、回避策。

書かない: 個別コンポーネントの仕様（docs サイトに書く）、一時的な作業メモ。

## 手順

1. 関係する既存の ADR を `adr/README.md` の一覧から探して読む。
2. 雛形を作る（番号の採番と一覧への追加はスクリプトが行う）。

   ```sh
   node .agents/skills/write-adr/scripts/new-adr.mjs "Short decision title in English"
   ```

3. 生成されたファイルを **英語で** 書く。
   - Context: 何を決める必要があったか、前提と制約。
   - Considered Options: 2 つ以上。却下した案の理由も書く。
   - Decision: "We will ..." / "We will not ..." で言い切る。
   - Consequences: 良いこと、悪いこと、今後守るべきこと。
   - Revisit When: 見直す条件があれば書く。
4. ステータスは `Proposed` のままユーザーに提示し、合意を得てから `Accepted` に変える（本文と `adr/README.md` の一覧の両方）。

## 既存の決定を覆すとき

- Accepted の ADR の本文は書き換えない（誤字の修正は可）。
- 新しい ADR を作り、`Related:` に古い ADR を書く。
- 古い ADR のステータスを `Superseded by [NNNN](NNNN-xxx.md)` に変え、一覧のステータスも更新する。
- 決定が不要になっただけなら、ステータスを `Deprecated` にする。

## コミット

`docs(adr): <内容>` の形式にする（例: `docs(adr): add 0014 on positioning library`）。
