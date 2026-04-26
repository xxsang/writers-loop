# Writer's Loop for OpenCode

Use this repository as a local instruction source:

1. Clone `https://github.com/xxsang/writers-loop`.
2. Read `AGENTS.md` for repository guidance.
3. Load `skills/writers-loop/SKILL.md` when the user asks for planning, drafting, critique, revision, translation, style distillation, or local preference learning.
4. Load only the referenced files needed for the current task from `skills/writers-loop/references/`.
5. For durable local preferences, use `skills/writers-loop/scripts/journal.mjs` and write only to the user's opted-in `.writers-loop/` directory.
