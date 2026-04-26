# Release Checklist

Use this checklist before publishing Writer's Loop.

## Preflight

```bash
npm test
```

Confirm:

- `npm run validate` passes.
- `npm run scan:secrets` passes.
- `npm run eval` passes.
- `npm run eval:ab` passes.
- `git status --short` is clean.
- No `.writers-loop/`, `.env`, or `.artifacts/` files are tracked.

## First GitHub Publish

```bash
git remote add origin https://github.com/xxsang/writers-loop.git
git push -u origin main
```

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

## Post-Release Smoke Check

Clone into a temporary directory and run:

```bash
git clone https://github.com/xxsang/writers-loop.git /tmp/writers-loop-release-check
cd /tmp/writers-loop-release-check
npm test
```
