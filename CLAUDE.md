# Claude Project Context

This repository provides the `writers-loop` skill.

Use `skills/writers-loop/SKILL.md` when the user asks for planning, drafting, critique, revision, translation, style distillation, or local preference learning for substantial writing.

Rules for Claude agents:

- Learn preferences only from explicit user decisions, not from raw generated drafts.
- Ask only blocking questions before planning.
- Stop at a plan checkpoint unless the user asks for a fast draft path.
- Keep durable storage opt-in; write only to `.writers-loop/` when the user approves project-local storage.
- Use `skills/writers-loop/references/` only as needed for the current task.
