# Contributing

Contributions should make Writer's Loop more useful without making the core skill noisy.

## Before You Open a PR

- Run `npm test`.
- Test at least one rejected-plan flow.
- Test at least one no-learning-evidence flow.
- If storage behavior changed, test `npm run journal:init`, `npm run journal:append`, and `npm run journal:derive` in a temporary directory.

## Scope

Good contributions:

- Clearer skill instructions.
- Better validation scenarios.
- Safer preference storage behavior.
- Agent installation improvements.
- Documentation that helps users decide when not to use an LLM.

Avoid:

- Project-specific writing preferences.
- Network-only tooling required for normal use.
- Large dependencies for optional evaluations.
- Rules that learn from unreviewed generated text.

## Review Standard

A change is ready when the skill remains portable, the README matches the installed files, and validation passes without extra setup.
