# Writer's Loop

[English](README.md) | [简体中文](README_zh.md) | 日本語 | [Español](README_es.md)

**あなたの文体・承認・編集から改善していく AI ライティング。**

[![Validate](https://github.com/xxsang/writers-loop/actions/workflows/validate.yml/badge.svg)](https://github.com/xxsang/writers-loop/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![No npm install](https://img.shields.io/badge/npm%20install-not%20required-brightgreen)](package.json)
[![Memory](https://img.shields.io/badge/memory-local%20opt--in-blue)](PRIVACY.md)

<p align="center">
  <img src="assets/writers-loop-overview.svg" alt="Writer's Loop overview" width="720">
</p>

Writer's Loop は、AI エージェント向けのポータブルなライティングスキルです。
文章作成を、目的確認、計画、下書き、批評、修正提案、意思決定、改稿という
確認可能な流れに分けます。学習するのは、ユーザーが提供または承認した文体
サンプルと、実際にレビューされた意思決定だけです。

基本ルール:

```text
ユーザーの意思決定から学習し、未レビューの AI 下書きからは学習しない。
```

## 向いている用途

- 技術計画、実行計画、製品仕様、設計文書
- レポート、メモ、提案書、調査まとめ
- ドキュメント、チュートリアル、スピーチ、エッセイ、小説
- 文体の抽出と再利用
- 意味、語調、書式、用語、文体を保つ翻訳

ごく小さな単発の文言修正には、通常のプロンプトで十分です。Writer's Loop は、
構造、レビュー、改稿、再利用可能な判断が重要な文章に向いています。

LLM を使った文章作成は、書く楽しさを減らすこともあります。文章を書くうえで
面白い不確実さ、寄り道、発見、自分の手で作っている感覚を圧縮してしまうためです。
Writer's Loop は足場、壁打ち相手、編集者、翻訳者として使い、自分にとって大切な
書く部分は自分で残してください。

## 30 秒で始める

```text
Use $writers-loop for this:
[writing task]

Audience: [reader]
Goal: [desired outcome]

Ask only if blocked. Otherwise make a short plan, draft, and brief critique.
Do not save preferences unless I ask.
```

## エージェントへの一行セットアップ

Claude Code、Codex、Cursor、Gemini CLI、OpenCode などのローカルエージェントを使う場合:

```text
Help me install Writer's Loop from https://github.com/xxsang/writers-loop, then use $writers-loop for my writing task without saving preferences unless I explicitly opt in.
```

Codex などのエージェントがリポジトリプラグインのインストールに対応している場合は、
公開リポジトリ URL `https://github.com/xxsang/writers-loop` をそのまま使えます。
通常利用に `npm install` は不要です。

## プライバシーとローカルメモリ

Writer's Loop は長期メモリなしで使えます。デフォルトでは、好みの学習は現在の
セッション内だけです。

明示的にローカル永続化を選んだ場合だけ、選択したプロジェクト内に次のフォルダを作ります。

```text
.writers-loop/
├── journal.jsonl
├── prefs.md
└── styles/
    └── my-style.md
```

- `.writers-loop/` は自動作成されません。
- `.writers-loop/` を公開リポジトリにコミットしないでください。
- 保存するのはレビュー済みのスタイルパックだけで、元の私的サンプルではありません。

## ドキュメント

| 目的 | リンク |
| --- | --- |
| 英語版 README | [README.md](README.md) |
| インストール | [docs/installation.md](docs/installation.md) |
| プロンプトテンプレート | [docs/prompt-templates.md](docs/prompt-templates.md) |
| ライティングツール連携 | [docs/writing-tools.md](docs/writing-tools.md) |
| ローカル設定と好みの保存 | [docs/local-preference-storage.md](docs/local-preference-storage.md) |
| プライバシーポリシー | [PRIVACY.md](PRIVACY.md) |

## 検証

```bash
npm test
```

通常利用に `npm install` は不要です。Node スクリプトは検証、評価、任意のローカル保存ツールにだけ使います。

## License

MIT License. See [LICENSE](LICENSE).

Copyright (c) 2026 Writer's Loop contributors.
