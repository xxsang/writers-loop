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

## Documentation Contributions

You don't need to write code to contribute. Improvements to reference files, installation guides, and usage examples are welcome.

- Keep language plain and direct — the audience includes non-technical writers.
- If you update an installation path or command, verify it against the actual file layout.
- Reference files in `skills/writers-loop/references/` follow a consistent heading structure; match it.

A good documentation PR: improves clarity, removes ambiguity, or adds a missing example. A bad one: adds marketing language, duplicates existing content, or introduces platform-specific assumptions without a corresponding installation path.

## Review Standard

A change is ready when the skill remains portable, the README matches the installed files, and validation passes without extra setup.
