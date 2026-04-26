# Writer's Loop

Writer's Loop is a portable AI-agent skill for substantial writing work. It helps an agent frame the task, ask only blocking questions, plan before drafting, critique the result, propose targeted revisions, and learn reusable preferences only from explicit user decisions.

Use it for coding plans, reports, proposals, product specs, documentation, essays, speeches, fiction, style distillation, and translation.

The core loop:

```text
frame -> ask -> plan -> approve/replan -> draft -> critique -> propose -> decide -> revise -> learn
```

The core rule:

```text
Learn from user decisions, not from raw AI drafts.
```

## Distribution

Writer's Loop is released as a **GitHub-only** open-source skill repository at:

```text
https://github.com/xxsang/writers-loop
```

The `package.json` is intentionally marked `private: true`; it is for local validation scripts, not npm publication.

## Why This Name

The previous working name was replaced with **Writer's Loop** because it is shorter, clearer, and describes the method directly. The skill is not just critique. It is a loop for writing, review, revision, and local preference reuse.

## Writing Pleasure Disclaimer

Using an LLM for writing may reduce the pleasure of writing. It can compress the uncertainty, wandering, discovery, and ownership that make writing satisfying. Use Writer's Loop as a scaffold, sparring partner, editor, or translator. Do not let it replace the parts of writing you value doing yourself.

## Quick Start

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

For a compact pass:

```text
Use a compact $writers-loop loop.
Frame the goal, state assumptions, draft, critique briefly, propose the top three changes, ask me to accept, reject, or adjust them, then revise.
```

## Installation

This repository follows the broad agent-coverage pattern used by [Superpowers](https://github.com/obra/superpowers): use a marketplace command where your agent supports repository extensions, or copy the skill folder manually where marketplace distribution has not been configured yet.

### Claude Code

Writer's Loop is not yet published to the Claude plugin marketplace. Use manual local install for now:

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

If Writer's Loop appears in your Codex plugin search, install it from the plugin UI:

```text
/plugins
```

Until it is listed, use manual local install:

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.codex/skills
cp -R writers-loop/skills/writers-loop ~/.codex/skills/
```

### OpenAI Codex App

Use the app's plugin flow once the repository is listed. For local development, clone the repo and copy `skills/writers-loop` into your Codex skills directory, then refresh skill discovery.

### Cursor

If Cursor plugin marketplace support is available for this repository, install from agent chat:

```text
/add-plugin writers-loop
```

Until it is listed, keep this repo open and refer Cursor to `AGENTS.md` and `skills/writers-loop/SKILL.md`, or copy `skills/writers-loop` into your configured local skills directory.

### Gemini CLI

Gemini-compatible extension metadata is included in `gemini-extension.json`.

```bash
gemini extensions install https://github.com/xxsang/writers-loop
```

To update later:

```bash
gemini extensions update writers-loop
```

### GitHub Copilot CLI

A Copilot plugin marketplace is not configured for this repo yet. For now, clone the repo and point Copilot-enabled workflows at `AGENTS.md`, or copy `skills/writers-loop` into your local skills directory if your setup supports local skills.

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/xxsang/writers-loop/refs/heads/main/.opencode/INSTALL.md
```

### Generic Manual Install

For any agent with local skill-folder support:

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.local/share/agent-skills
cp -R writers-loop/skills/writers-loop ~/.local/share/agent-skills/
```

If the agent does not support skills, paste the contents of `skills/writers-loop/SKILL.md` into the agent context and load only the referenced files needed for the task.

## Local Preference Storage

Writer's Loop works without memory. By default, preference learning is session-only.

If users want styles, decisions, or learned preferences to persist across sessions, they can opt into local filesystem storage. The journal tool writes only inside the target project:

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

## Style Distillation

Use this when you want a reusable style pack from files, chapters, reports, documentation, or pasted text:

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

Use this when translation quality depends on meaning, tone, terminology, formatting, or voice preservation:

```text
Use $writers-loop to translate this text.

Source language:
Target language and locale:
Mode: natural
Audience:
Preserve:
Glossary:
Style constraints:

Preserve markdown formatting, names, commands, file paths, code, URLs, and IDs unless I explicitly say otherwise.
After translating, review fidelity, style, terminology, and formatting.
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

No install step is required. The package uses only Node.js built-in modules for validation, secret scanning, evals, and preference storage.

## Repository Layout

```text
skills/writers-loop/SKILL.md             Core skill instructions
skills/writers-loop/references/          Progressive-disclosure references
skills/writers-loop/scripts/journal.mjs  Optional user-facing local preference journal
tools/validate-skill.mjs                 Maintainer release-readiness checks
tools/scan-secrets.mjs                   Maintainer secret scanner
tools/run-evals.mjs                      Maintainer scenario coverage and A/B response checks
tools/evals/                             Maintainer eval prompts and saved response fixtures
docs/writers-loop-complete-guide.md      Long-form user guide
```

## Contact

Maintainer: Shen Ren <xxsang@gmail.com>

## Contributing

See `CONTRIBUTING.md`. Keep the skill portable, concise, and useful across agents.

## License

MIT. Copyright (c) 2026 Shen Ren.
