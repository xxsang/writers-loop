# Prompt Templates

These prompts are starting points. Keep storage session-only unless you
explicitly want durable project-local memory.

## Mode Selector

Use this when you are not sure which workflow fits:

```text
Use $writers-loop.

Mode: easy start | full cycle | critique only | style distillation | translation | learned style
Task:
Audience:
Goal:
Source material:
Storage: session-only unless I explicitly opt in

If mode is full cycle, stop at PLAN CHECKPOINT before drafting.
If mode is easy start, state assumptions, draft, critique briefly, and do not learn reusable preferences.
If mode is learned style and the style pack is not available, ask me to paste it or confirm local storage access before drafting.
```

## Easy Start

Use this when you want a useful draft without a long setup:

```text
Use $writers-loop for this writing task.

Task:
Audience:
Goal:
Constraints:
Tone:
Target length:
Source material:

Ask only if blocked. Otherwise state assumptions, make a compact plan, draft, critique briefly, and propose the top three improvements.
Do not save preferences unless I explicitly ask.
```

## Full Cycle

Use this when quality, review, or preference learning matters:

```text
Use $writers-loop for a full writing cycle.

Artifact type:
Audience:
Goal:
Constraints:
Desired tone:
Target length:
Source material:
Must include:
Must avoid:

Start with Frame and only blocking questions.
Then create a plan and stop at PLAN CHECKPOINT.
Do not draft until I approve the plan.
After drafting, critique with the artifact-specific rubric.
Propose targeted revisions with reason, scope, and risk.
Wait for my accept, reject, or adjust decisions before revising.
Learn preferences only from reviewed decisions, not from the draft itself.
Keep storage session-only unless I explicitly opt into local storage.
```

## Report Or Memo

```text
Use $writers-loop to turn these notes into a report or memo.

Audience:
Decision this should support:
Desired action:
Notes:
Known evidence gaps:
Target length:

Plan with executive summary, context, findings, recommendation, risks, and next steps.
Name assumptions and uncertainty.
Wait for plan approval before drafting unless I say to use the fast path.
```

## Style Distillation

```text
Use $writers-loop to distill a reusable writing style from these sources.

Sources:
Intended reuse:
Artifact type:
Audience:
Permission or ownership:
Must preserve:
Must avoid:

Create a style pack.
Separate style from content facts.
Do not copy plot, private facts, names, source passages, or project-specific claims into reusable rules.
Ask whether to apply now, keep session-only, or save durably.
```

## Translation

```text
Use $writers-loop to translate this text.

Source language:
Target language and locale:
Mode: natural
Audience:
Preserve:
Glossary:
Style constraints:
Text:

Preserve meaning, source writing style, voice, rhythm, imagery, register, terminology, markdown formatting, code, commands, file paths, URLs, IDs, and names unless I say otherwise.
After translating, review fidelity, source-style preservation, terminology, and formatting.
```

## Using A Learned Style

Use this when a style pack has already been created in the conversation or saved
locally in `.writers-loop/styles/`:

```text
Use $writers-loop with the learned style pack: [style-name].

Write:
Audience:
Goal:
Constraints:
Current-task facts:

Load the style pack first.
If the style pack is not available, ask me to paste it or confirm local storage access before drafting.
Apply it as a drafting constraint.
Use only current-task facts.
Do not copy source passages or source facts from the style pack.
Critique content quality and style match separately.
```

Expected flow:

```text
load style pack -> frame task -> plan content and style -> draft -> critique content -> review style match -> revise
```

Style packs are not the same as learned preferences. A style pack describes
reusable voice and structure from samples. Preferences are decision-backed rules
learned from user accept, reject, adjust, undo, or manual rewrite events.
