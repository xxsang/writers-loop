# Release Checklist

Use this checklist before publishing a Writer's Loop release.

## Preflight

```bash
npm test
```

Confirm:

- `npm run validate` passes.
- `npm run scan:secrets` passes.
- `npm run eval` passes.
- `npm run eval:ab` passes.
- `npm run eval:ab:live:dry` passes.
- `npm run test:real` passes.
- `git status --short` is clean except for intentionally ignored local files.
- No `.writers-loop/`, `.env`, `.artifacts/`, or private draft files are tracked.
- README installation commands match the current repository layout.
- `package.json` remains `private: true` because distribution is GitHub-only.

## Manual Forward-Test

For a repeatable live A/B forward-test, run:

```bash
npm run eval:ab:live -- --model gpt-5.2
```

Expected: generates control and treatment responses for every scenario in
`tools/evals/ab-prompts.json`, then reports a positive treatment delta through
`tools/run-evals.mjs`. Use `--scenario <id>` for a targeted smoke run and
`--resume --output <existing-run-dir>` to continue an interrupted run.

Before tagging a public release, run these prompts in a fresh agent thread with
the installed skill. Save only notes, not private draft content.

```text
Use $writers-loop to write an implementation plan for adding OAuth login to an existing app. Keep it practical.
```

Expected: frames the task, plans concrete ownership and verification, and stops
at `PLAN CHECKPOINT` without claiming preferences.

```text
Draft a product launch email with the writers-loop skill. No need to ask questions.
```

Expected: uses the fast draft path, states assumptions, says skipped questions
are weak signals, and does not learn from the unreviewed draft.

```text
Use the writers-loop skill. Keep preference learning session-only; do not create project files.
```

Expected: does not create `.writers-loop/`, names durable storage as opt-in, and
treats session-only as a current-task constraint.

```text
Use the writers-loop skill to distill a reusable writing style from these markdown samples. Do not copy project facts into style rules.
```

Expected: separates style from content facts, produces a style pack, and asks
whether to apply now, keep session-only, or save durably.

## Repository Visibility

Before a public release, confirm the GitHub repository is public and points to:

```text
https://github.com/xxsang/writers-loop
```

If the repository is still private, installation commands using the GitHub URL will work only for users with access.

## Tag Release

```bash
git tag v0.1.0
git push origin v0.1.0
```

## GitHub Release Notes

Suggested release title:

```text
Writer's Loop v0.1.0
```

Suggested summary:

```text
Initial public release of Writer's Loop, a portable AI-agent writing skill for planning, critique, revision, translation, style distillation, and optional local preference learning.
```

Suggested release notes:

```text
- Portable skill instructions for Claude Code, OpenAI Codex, ChatGPT-style hosted agents, Cursor, Gemini CLI, GitHub Copilot CLI, OpenCode, and generic local-skill agents.
- Conservative preference learning from explicit user decisions, not raw AI drafts.
- Optional project-local preference journal stored in .writers-loop/.
- Style distillation and translation references.
- Validation, secret scanning, scenario eval, and real usage scripts with no package dependencies.
```

## Post-Release Smoke Check

Clone into a temporary directory and run:

```bash
git clone https://github.com/xxsang/writers-loop.git /tmp/writers-loop-release-check
cd /tmp/writers-loop-release-check
npm test
```
