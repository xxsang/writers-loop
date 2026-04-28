# Writer's Loop

**AI writing that improves from your decisions, not its own drafts.**

Writer's Loop is a portable writing skill for AI agents. It turns writing work
into a reviewable loop: frame the task, make a plan, draft, critique, propose
changes, revise, and learn only from choices the user actually reviews.

Use it when one-shot prompting is too fuzzy: coding plans, reports, proposals,
product specs, documentation, essays, speeches, fiction, style distillation, and
translation.

```text
frame -> ask -> plan -> approve/replan -> draft -> critique -> propose -> decide -> revise -> learn
```

Core rule:

```text
Learn from user decisions, not from raw AI drafts.
```

## Why It Exists

Most writing prompts collapse planning, drafting, editing, and preference
learning into one pass. That makes the output harder to steer and makes
"memory" unreliable.

Writer's Loop keeps the stages separate so an agent can:

- Understand the artifact, audience, goal, and constraints before writing.
- Ask only questions that would materially change the result.
- Wait for plan approval when quality or preference learning matters.
- Critique the draft before rewriting it.
- Propose targeted changes instead of silently rewriting everything.
- Distill writing style without copying private facts, names, or passages.
- Translate meaning, voice, formatting, terminology, code, URLs, paths, and IDs.
- Reuse preferences across sessions only after explicit opt-in.

## Try It In 30 Seconds

```text
Use $writers-loop for this:
[describe the writing task]

Audience: [who will read it]
Goal: [what it should achieve]

Ask only if blocked. Otherwise make a short plan, draft, and brief critique.
Do not save preferences unless I ask.
```

For more ready-to-copy prompts, see [docs/prompt-templates.md](docs/prompt-templates.md).

## What It Includes

- A disciplined loop for framing, planning, drafting, critique, revision, and evaluation.
- Artifact-specific guidance for technical plans, reports, proposals, docs, specs, essays, speeches, and fiction.
- Style distillation from user-owned or permitted samples.
- Translation guidance that preserves source style and exact technical tokens.
- Conservative preference learning from approved plans, rejected edits, manual rewrites, and explicit standing preferences.
- Optional local storage in `.writers-loop/` for users who want durable project-local memory.
- Agent installation paths for Claude Code, OpenAI Codex, ChatGPT-style hosted agents, Cursor, Gemini CLI, GitHub Copilot CLI, OpenCode, and generic local-skill agents.

## When Not To Use It

For tiny one-off copy edits, a simple prompt is usually enough. Writer's Loop is
for writing that benefits from structure, review, or reusable decisions.

Using an LLM for writing may also reduce the pleasure of writing. It can
compress the uncertainty, wandering, discovery, and ownership that make writing
satisfying. Use Writer's Loop as a scaffold, sparring partner, editor, or
translator. Keep the parts of writing you value doing yourself.

## Install

Writer's Loop is a GitHub-only open-source skill repository:

```text
https://github.com/xxsang/writers-loop
```

The installable skill lives at:

```text
skills/writers-loop/
```

Quick local install pattern:

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.codex/skills
cp -R writers-loop/skills/writers-loop ~/.codex/skills/
```

Use your agent's native plugin or extension flow when available. This repository
also includes plugin metadata for Codex, Claude, Cursor, Gemini, and OpenCode.
See [docs/installation.md](docs/installation.md) for Claude Code, OpenAI Codex CLI,
OpenAI Codex App, Cursor, Gemini CLI, GitHub Copilot CLI, OpenCode, and generic
local-skill installation steps.

No npm package install is required for normal use. The `package.json` is marked
`private: true`; Node scripts are for validation, evals, and optional local
storage tooling.

## Local Memory Is Opt-In

Writer's Loop works without memory. By default, preference learning is
session-only.

If users opt into durable storage, bundled tools write only inside the selected
project:

```text
.writers-loop/
|-- journal.jsonl
|-- prefs.md
`-- styles/
    `-- my-style.md
```

Privacy defaults:

- Do not create `.writers-loop/` unless the user opts in.
- Do not commit `.writers-loop/` to public repositories.
- Prefer redacted summaries over full private passages.
- Save only reviewed style packs to `.writers-loop/styles/`, not raw source samples.

See [docs/local-preference-storage.md](docs/local-preference-storage.md) for
commands such as `style:save`, and [PRIVACY.md](PRIVACY.md) for the full policy.

## Docs

| Need | Read |
| --- | --- |
| A short example | [docs/demo-transcript.md](docs/demo-transcript.md) |
| Full method | [docs/writers-loop-complete-guide.md](docs/writers-loop-complete-guide.md) |
| Copyable prompts | [docs/prompt-templates.md](docs/prompt-templates.md) |
| Using A Learned Style | [docs/prompt-templates.md#using-a-learned-style](docs/prompt-templates.md#using-a-learned-style) |
| Installation | [docs/installation.md](docs/installation.md) |
| Local preference storage | [docs/local-preference-storage.md](docs/local-preference-storage.md) |
| Privacy policy | [PRIVACY.md](PRIVACY.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Release checklist | [RELEASE.md](RELEASE.md) |

## Repository Layout

```text
skills/writers-loop/SKILL.md               Core skill instructions
skills/writers-loop/references/            Progressive-disclosure references
skills/writers-loop/scripts/journal.mjs    Optional local preference journal
skills/writers-loop/scripts/style-pack.mjs Optional local style-pack storage
docs/                                      User-facing guides and prompt templates
.codex-plugin/plugin.json                  Codex plugin metadata
.claude-plugin/plugin.json                 Claude plugin metadata
.cursor-plugin/plugin.json                 Cursor plugin metadata
gemini-extension.json                      Gemini extension metadata
.opencode/                                OpenCode install metadata
tools/                                    Maintainer validation and eval scripts
```

## Validate

Run all checks:

```bash
npm test
```

No install step is required. The package uses only Node.js built-in modules for
validation, secret scanning, evals, and optional preference storage.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep the skill portable, concise, and
useful across agents.

## License

MIT. Copyright (c) 2026 Writer's Loop contributors.
