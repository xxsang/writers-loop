# Writer's Loop

Writer's Loop is a portable set of AI-agent writing skills, not a single prompt. It gives agents a reusable writing process for planning, drafting, critique, revision, style learning, translation, and optional project-local preference learning.

Use it when writing needs structure, taste, memory, or review instead of a one-shot draft. It works for coding plans, reports, proposals, product specs, documentation, essays, speeches, fiction, style learning, style distillation, and translation.

The core loop:

```text
frame -> ask -> plan -> approve/replan -> draft -> critique -> propose -> decide -> revise -> learn
```

The core rule:

```text
Learn from user decisions, not from raw AI drafts.
```

## What It Includes

- A disciplined writing loop for framing, planning, drafting, critique, revision, and evaluation.
- Artifact-specific guidance for technical plans, reports, proposals, docs, specs, essays, speeches, and fiction.
- Style learning that builds a reusable style profile from your own writing, or from permitted reference samples, so future drafts can write in that style without copying source facts or passages.
- Translation guidance that preserves meaning and the original language's writing style, including voice, rhythm, imagery, register, terminology, formatting, code, paths, URLs, and names.
- Conservative preference learning from approved plans, rejected edits, manual rewrites, and explicit standing preferences.
- Optional local storage in `.writers-loop/` for users who want durable project-local preference memory.
- Installation guidance for Claude Code, OpenAI Codex, ChatGPT-style hosted agents, Cursor, Gemini CLI, GitHub Copilot CLI, OpenCode, and generic local-skill agents.

## Why Use It

Most writing prompts collapse planning, drafting, editing, and preference learning into one pass. Writer's Loop keeps those stages separate so the agent can:

- Understand the artifact, audience, goal, and constraints before writing.
- Ask only questions that would materially change the plan.
- Wait for plan approval when quality or preference learning matters.
- Critique the draft before rewriting it.
- Propose targeted changes instead of silently rewriting everything.
- Clone or adapt your own writing style, or a permitted reference writer's style, from samples for future drafts while keeping private facts, names, and source passages out of reusable rules.
- Translate across languages while carrying the source language's writing style into the target language instead of flattening it into generic polished prose.
- Avoid pretending that generated text reveals user preferences.
- Reuse reviewed preferences across sessions only when the user explicitly opts in.
- Store private style notes locally when durable storage is used, instead of adding a hosted memory service.

## Writing Pleasure Disclaimer

Using an LLM for writing may reduce the pleasure of writing. It can compress the uncertainty, wandering, discovery, and ownership that make writing satisfying. Use Writer's Loop as a scaffold, sparring partner, editor, or translator. Do not let it replace the parts of writing you value doing yourself.

## Distribution

Writer's Loop is a **GitHub-only** open-source skill repository:

```text
https://github.com/xxsang/writers-loop
```

The `package.json` is marked `private: true` because the package is not intended for npm publication. The Node scripts are local validation and optional journal tools; users do not need package dependencies to use the skill.

The installable skill lives at:

```text
skills/writers-loop/
```

The Codex plugin manifest lives at:

```text
.codex-plugin/plugin.json
```

Do not create a duplicate `plugins/writers-loop` tree for this repository. This repo is already the plugin root.

## Quick Start

Minimum prompt:

```text
Use $writers-loop for this:
[describe the writing task]

Audience: [who will read it]
Goal: [what it should achieve]

Ask only if blocked. Otherwise make a short plan, draft, and brief critique.
Do not save preferences unless I ask.
```

Ask your agent:

```text
Use $writers-loop for this writing task.

Artifact type:
Audience:
Goal:
Constraints:
Desired tone:
Target length:
Context or source material:
Must include:
Must avoid:

Start by asking only blocking questions.
Then create a plan and wait for my approval before drafting.
After drafting, critique it, propose targeted changes, and ask me to accept, reject, or adjust each change before learning preferences.
```

For a faster pass:

```text
Use a compact $writers-loop loop.
Frame the goal, state assumptions, draft, critique briefly, propose the top three changes, ask me to accept, reject, or adjust them, then revise.
```

See `docs/demo-transcript.md` for a short example and `docs/writers-loop-complete-guide.md` for the full method.

## Installation

Writer's Loop follows the broad agent-coverage pattern used by [Superpowers](https://github.com/obra/superpowers): use a native plugin or extension command when your agent supports one, otherwise install by copying `skills/writers-loop` into the agent's local skills directory or by loading `SKILL.md` as context.

### Claude Code

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.claude/skills
cp -R writers-loop/skills/writers-loop ~/.claude/skills/
```

Then ask:

```text
Use $writers-loop to help me write this document.
```

### OpenAI Codex CLI

If your Codex build supports plugin installation, use the plugin UI:

```text
/plugins
```

Manual install:

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.codex/skills
cp -R writers-loop/skills/writers-loop ~/.codex/skills/
```

### OpenAI Codex App

Use the app's plugin flow when repository-based plugin installation is available. For local use, clone this repo, copy `skills/writers-loop` into `~/.codex/skills/`, and refresh skill discovery.

### ChatGPT and Other Hosted Agents

Hosted agents generally cannot install local skill folders. Attach or paste `skills/writers-loop/SKILL.md` into the conversation or project instructions, then add only the reference files needed for the task.

### Cursor

If your Cursor setup supports repository plugins, install from agent chat or the plugin UI. Otherwise, keep this repo open and point Cursor to:

```text
AGENTS.md
skills/writers-loop/SKILL.md
```

You can also copy `skills/writers-loop` into your configured local skills directory.

### Gemini CLI

Gemini-compatible extension metadata is included in `gemini-extension.json`.

```bash
gemini extensions install https://github.com/xxsang/writers-loop
```

To update later:

```bash
gemini extensions update writers-loop
```

If your Gemini CLI version does not support repository extensions, load `GEMINI.md` and `skills/writers-loop/SKILL.md` as project context.

### GitHub Copilot CLI

Copilot does not use this repository's skill format directly. Clone the repo and point Copilot-enabled workflows at `AGENTS.md`, or copy `skills/writers-loop` into any local skill directory supported by your setup.

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/xxsang/writers-loop/refs/heads/main/.opencode/INSTALL.md
```

### Other Agents

For any agent with local skill-folder support:

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.local/share/agent-skills
cp -R writers-loop/skills/writers-loop ~/.local/share/agent-skills/
```

If the agent does not support skills, paste or attach `skills/writers-loop/SKILL.md` and load only the referenced files needed for the task.

## Local Preference Storage

Writer's Loop works without memory. By default, preference learning is session-only.

If users want styles, decisions, or learned preferences to persist across sessions, they can opt into local filesystem storage. The journal tool writes only inside the selected project:

```text
.writers-loop/
|-- journal.jsonl
`-- prefs.md
```

Initialize storage:

```bash
npm run journal:init -- /path/to/project
```

Append a decision event:

```bash
npm run journal:append -- /path/to/project '{"type":"plan_approved","signal":"positive","artifact":"coding-plan","stage":"planning","scope":"coding-plan/planning","summary":"User approved plans with exact verification commands.","payload":{"preference":"Use exact verification commands in implementation plans"}}'
```

Derive reusable preferences:

```bash
npm run journal:derive -- /path/to/project
```

Agent prompt for local storage:

```text
Use $writers-loop. Keep preference learning project-local. Store only reviewed decisions in .writers-loop/journal.jsonl, derive reusable preferences into .writers-loop/prefs.md, and do not save private source text unless I explicitly approve it.
```

Privacy rules:

- Do not create `.writers-loop/` unless the user opts in.
- Do not commit `.writers-loop/` to public repositories.
- Prefer redacted summaries over full private passages.
- Treat session-only storage as a current-task constraint, not a durable preference.

See `PRIVACY.md` for the full privacy policy.

## Style Learning And Style Distillation

Use this when you want the agent to learn your writing style, or a permitted reference writer's style, from files, chapters, reports, documentation, or pasted text:

```text
Use $writers-loop to distill a writing style from these sources.

Sources:
Intended reuse:
Artifact type:
Audience:
Must preserve:
Must avoid:

Create a style pack.
Separate style from content facts.
Do not copy plot, private facts, names, or project-specific claims into reusable style rules.
Ask before saving anything durable.
```

## Translation

Use this when translation quality depends on meaning, the original language's writing style, tone, terminology, formatting, or voice preservation:

```text
Use $writers-loop to translate this text.

Source language:
Target language and locale:
Mode: natural
Audience:
Preserve:
Glossary:
Style constraints:

Preserve the original writing style, voice, rhythm, imagery, register, and emotional effect in the target language.
Preserve markdown formatting, names, commands, file paths, code, URLs, and IDs unless I explicitly say otherwise.
After translating, review fidelity, source-style preservation, terminology, and formatting.
```

## Validation

Run all checks:

```bash
npm test
```

Run checks separately:

```bash
npm run validate
npm run scan:secrets
npm run eval
npm run eval:ab
```

No install step is required. The package uses only Node.js built-in modules for validation, secret scanning, evals, and optional preference storage.

## Repository Layout

```text
skills/writers-loop/SKILL.md             Core skill instructions
skills/writers-loop/references/          Progressive-disclosure references
skills/writers-loop/scripts/journal.mjs  Optional local preference journal
docs/writers-loop-complete-guide.md      Long-form user guide
docs/demo-transcript.md                  Short example of the loop in use
AGENTS.md                                General agent guidance
CLAUDE.md                                Claude-specific project context
GEMINI.md                                Gemini-specific project context
PRIVACY.md                               Local data and preference storage policy
RELEASE.md                               Release checklist
SECURITY.md                              Security reporting and supported versions
tools/                                  Maintainer validation and eval scripts
```

## Contributing

See `CONTRIBUTING.md`. Keep the skill portable, concise, and useful across agents.

## Maintainer

Shen Ren <xxsang@gmail.com>

## License

MIT. Copyright (c) 2026 Shen Ren.
