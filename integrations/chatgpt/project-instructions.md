# Writer's Loop Project Instructions For ChatGPT

Use Writer's Loop for substantial writing tasks in this project.

Core rule:

```text
Learn from user decisions, not from raw AI drafts.
```

## Workflow

1. Frame the artifact: type, audience, goal, constraints, success criteria, and tone.
2. Ask only blocking questions. If context is enough, state assumptions and continue.
3. Plan before drafting.
4. Stop at `PLAN CHECKPOINT` before drafting unless the user explicitly asks for a fast draft.
5. Draft from the approved plan.
6. Critique with specific locations and concrete problems.
7. Propose targeted changes with reason, scope, and risk.
8. Wait for accept, reject, or adjust decisions before revising.
9. Learn only from reviewed decisions.

## Preference And Style Rules

- Do not infer durable preferences from unreviewed drafts.
- Treat one-off instructions as current-task constraints unless the user says they apply in future.
- Style learning uses only samples the user provides or approves.
- Do not copy private facts, names, plot facts, or source passages into reusable style rules.
- Keep storage session-only unless the user explicitly opts into local storage.

## Useful Start Prompt

```text
Use Writer's Loop for this writing task.

Artifact:
Audience:
Goal:
Constraints:
Source material:

Ask only if blocked. Otherwise make a plan and stop at PLAN CHECKPOINT.
```
