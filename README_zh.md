# Writer's Loop

[English](README.md) | 简体中文 | [日本語](README_ja.md) | [Español](README_es.md)

**让 AI 写作根据你的风格、认可与修改持续改进。**

[![Validate](https://github.com/xxsang/writers-loop/actions/workflows/validate.yml/badge.svg)](https://github.com/xxsang/writers-loop/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![No npm install](https://img.shields.io/badge/npm%20install-not%20required-brightgreen)](package.json)
[![Memory](https://img.shields.io/badge/memory-local%20opt--in-blue)](PRIVACY.md)

<p align="center">
  <img src="assets/writers-loop-overview.svg" alt="Writer's Loop 概览" width="720">
</p>

Writer's Loop 是一个可移植的 AI 写作技能。它把写作拆成可审查的流程：
先明确目标，再规划、起草、评审、提出修改、确认决策，最后只从用户明确认可
或修改过的内容中学习。

核心规则：

```text
只从用户决策中学习，不从未经审查的 AI 草稿中学习。
```

## 适合什么场景

- 技术方案、执行计划、产品规格、设计文档
- 报告、备忘录、提案、研究总结
- 文档、教程、演讲稿、文章、小说
- 写作风格提炼与复用
- 需要保留语气、格式、术语和风格的翻译

不适合很小的一次性改字。Writer's Loop 更适合需要结构、评审、修改和可复用决策的写作。

使用 LLM 写作也可能减少写作本身的乐趣：它会压缩那些让写作有意思的不确定性、
游走、发现和拥有感。把 Writer's Loop 当作脚手架、陪练、编辑或翻译工具；
你珍视的写作部分，仍然保留给自己完成。

## 30 秒开始

```text
Use $writers-loop for this:
[描述写作任务]

Audience: [读者是谁]
Goal: [这份文本要达成什么目标]

Ask only if blocked. Otherwise make a short plan, draft, and brief critique.
Do not save preferences unless I ask.
```

## 用一句话让 Agent 完成安装

如果你使用 Claude Code、Codex、Cursor、Gemini CLI、OpenCode 或类似本地 agent，可以直接说：

```text
Help me install Writer's Loop from https://github.com/xxsang/writers-loop, then use $writers-loop for my writing task without saving preferences unless I explicitly opt in.
```

如果你的 Codex 或其他 agent 支持仓库插件安装，可以直接使用公开仓库地址：
`https://github.com/xxsang/writers-loop`。正常使用不需要 `npm install`。

## 隐私和本地记忆

Writer's Loop 默认不需要长期记忆。偏好学习默认只在当前会话中使用。

只有在你明确选择本地持久化时，工具才会在当前项目里创建：

```text
.writers-loop/
├── journal.jsonl
├── prefs.md
└── styles/
    └── my-style.md
```

- 不会自动创建 `.writers-loop/`。
- 不要把 `.writers-loop/` 提交到公开仓库。
- 只保存经过审查的风格包，不保存原始私人样本。

## 文档

| 需要 | 链接 |
| --- | --- |
| 英文完整 README | [README.md](README.md) |
| 安装说明 | [docs/installation.md](docs/installation.md) |
| Prompt 模板 | [docs/prompt-templates.md](docs/prompt-templates.md) |
| 写作工具集成 | [docs/writing-tools.md](docs/writing-tools.md) |
| 本地偏好存储 | [docs/local-preference-storage.md](docs/local-preference-storage.md) |
| 隐私政策 | [PRIVACY.md](PRIVACY.md) |

## 验证

```bash
npm test
```

正常使用不需要 `npm install`。仓库中的 Node 脚本只用于验证、评测和可选的本地存储工具。

## License

MIT License. See [LICENSE](LICENSE).

Copyright (c) 2026 Writer's Loop contributors.
