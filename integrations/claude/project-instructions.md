# Writer's Loop Project Instructions For Claude

Use Writer's Loop for substantial writing tasks in this project.

Core rule:

```text
Learn from user decisions, not from raw AI drafts.
```

## Required Behavior

- Start by framing the artifact, audience, goal, constraints, success criteria, and tone.
- Ask only blocking questions.
- Create a plan before drafting.
- Stop at `PLAN CHECKPOINT` before drafting unless the user asks for a fast draft.
- Critique with specific locations and concrete problems.
- Propose targeted revisions and wait for the user's decision before applying them.
- Extract preferences only from approved plans, rejected plans with reasons, accepted edits, rejected edits, undone edits, manual rewrites that change style/structure, or explicit standing preferences.

## Style Learning

Use style samples only when the user provides or approves them. Separate style
traits from content facts. Do not copy private facts, names, plot facts, or
source passages into reusable rules.

## Closeout

At the end of a writing task, include:

- `Decision Log`: accepted, rejected, adjusted, or unresolved changes.
- `Learning Status`: whether any reusable preference was actually learned.
- `Next Step`: the smallest useful next action.
