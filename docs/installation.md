# Installation

Writer's Loop is a GitHub-only open-source skill repository:

```text
https://github.com/xxsang/writers-loop
```

The installable skill lives at:

```text
skills/writers-loop/
```

The repository is already the plugin root. Do not create a duplicate
`plugins/writers-loop` tree.

The `package.json` is marked `private: true` because the package is not intended
for npm publication. The Node scripts are local validation, eval, and optional
storage tools; normal users do not need package dependencies to use the skill.

## Fast Public GitHub Install

Because the repository is public, the easiest path is to install from the repo
URL in agents that support repository plugins:

```text
https://github.com/xxsang/writers-loop
```

The repo root is already the plugin root and includes `.codex-plugin/`,
`.claude-plugin/`, `.cursor-plugin/`, `gemini-extension.json`, and `skills/`.

For Codex local skill-folder installs:

```bash
tmp="$(mktemp -d)" &&
  git clone --depth 1 https://github.com/xxsang/writers-loop.git "$tmp/writers-loop" &&
  mkdir -p ~/.codex/skills/writers-loop &&
  cp -R "$tmp/writers-loop/skills/writers-loop/"* ~/.codex/skills/writers-loop/
```

For Claude Code local skill-folder installs:

```bash
tmp="$(mktemp -d)" &&
  git clone --depth 1 https://github.com/xxsang/writers-loop.git "$tmp/writers-loop" &&
  mkdir -p ~/.claude/skills/writers-loop &&
  cp -R "$tmp/writers-loop/skills/writers-loop/"* ~/.claude/skills/writers-loop/
```

Normal use still does not require `npm install`.

## Claude Code

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.claude/skills
cp -R writers-loop/skills/writers-loop ~/.claude/skills/
```

Then ask:

```text
Use $writers-loop to help me write this document.
```

This repository also includes Claude plugin metadata at
`.claude-plugin/plugin.json` for setups that support repository plugins.

## OpenAI Codex CLI

If your Codex build supports repository plugin installation, use the plugin UI
with the public GitHub URL:

```text
https://github.com/xxsang/writers-loop
```

Manual install:

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.codex/skills
cp -R writers-loop/skills/writers-loop ~/.codex/skills/
```

The Codex plugin manifest lives at:

```text
.codex-plugin/plugin.json
```

## OpenAI Codex App

Use the app's plugin flow when repository-based plugin installation is
available and enter `https://github.com/xxsang/writers-loop`. For local use,
clone this repo, copy `skills/writers-loop` into `~/.codex/skills/`, and refresh
skill discovery.

## ChatGPT And Other Hosted Agents

Hosted agents generally cannot install local skill folders. Attach or paste
`skills/writers-loop/SKILL.md` into the conversation or project instructions,
then add only the reference files needed for the task.

## Cursor

If your Cursor setup supports repository plugins, install from agent chat or the
plugin UI. This repository includes Cursor plugin metadata at
`.cursor-plugin/plugin.json`.

Manual context path:

```text
AGENTS.md
skills/writers-loop/SKILL.md
```

You can also copy `skills/writers-loop` into your configured local skills
directory.

## Gemini CLI

Gemini-compatible extension metadata is included in `gemini-extension.json`.

```bash
gemini extensions install https://github.com/xxsang/writers-loop
```

To update later:

```bash
gemini extensions update writers-loop
```

If your Gemini CLI version does not support repository extensions, load
`GEMINI.md` and `skills/writers-loop/SKILL.md` as project context.

## GitHub Copilot CLI

Copilot does not use this repository's skill format directly. Clone the repo and
point Copilot-enabled workflows at `AGENTS.md`, or copy `skills/writers-loop`
into any local skill directory supported by your setup.

## OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/xxsang/writers-loop/refs/heads/main/.opencode/INSTALL.md
```

OpenCode metadata lives under:

```text
.opencode/
```

## Other Agents

For any agent with local skill-folder support:

```bash
git clone https://github.com/xxsang/writers-loop.git
mkdir -p ~/.local/share/agent-skills
cp -R writers-loop/skills/writers-loop ~/.local/share/agent-skills/
```

If the agent does not support skills, paste or attach
`skills/writers-loop/SKILL.md` and load only the referenced files needed for the
task.
