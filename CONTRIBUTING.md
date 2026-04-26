# Contributing

Contributions should make Writer's Loop clearer, safer, or more useful without making the core skill noisy.

## Before You Open a PR

- Run `npm test`.
- Test at least one rejected-plan flow.
- Test at least one no-learning-evidence flow.
- If storage behavior changed, test `npm run journal:init`, `npm run journal:append`, and `npm run journal:derive` in a temporary directory.
- Confirm no `.writers-loop/`, `.env`, private drafts, or local agent settings are tracked.

## Good Contributions

- Clearer skill instructions.
- Better validation scenarios.
- Safer preference storage behavior.
- Agent installation improvements.
- Documentation that helps users decide when not to use an LLM.
- Examples that show the decision loop without inventing user preferences.

## Avoid

- Project-specific writing preferences.
- Network-only tooling required for normal use.
- Large dependencies for optional evaluations.
- Rules that learn from unreviewed generated text.
- Marketing language that hides limitations.
- Platform-specific assumptions without a matching installation path.

## Documentation Standard

You do not need to write code to contribute. Improvements to reference files, installation guides, and usage examples are welcome.

- Keep language plain and direct; the audience includes non-technical writers.
- If you update an installation path or command, verify it against the actual file layout.
- Keep `skills/writers-loop/SKILL.md` concise and move longer guidance into `skills/writers-loop/references/`.
- Preserve the distinction between current-task constraints and reusable preferences.

A good documentation PR improves clarity, removes ambiguity, or adds a missing example. A weak documentation PR adds duplicated content, vague praise, or unverified platform claims.

## Review Standard

A change is ready when the skill remains portable, the README matches the installed files, privacy behavior remains opt-in, and validation passes without extra setup.
