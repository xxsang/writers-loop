# Agent Guidelines

This repository contains the Writer's Loop skill.

When modifying the skill or docs:

- Keep `skills/writers-loop/SKILL.md` concise and use references for longer guidance.
- Do not add project-specific preferences to the reusable skill.
- Do not claim preference learning from unreviewed drafts.
- Keep durable preference storage opt-in and local to `.writers-loop/`.
- Save reviewed style packs only to `.writers-loop/styles/` after explicit opt-in.
- Keep installation instructions aligned with the actual repository layout.
- Avoid runtime dependencies unless they are required by normal users.
- Run `npm test` before publishing, tagging, or opening a PR.
