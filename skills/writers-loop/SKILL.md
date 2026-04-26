---
name: writers-loop
description: Use when planning, drafting, reviewing, revising, translating, or improving substantial writing artifacts, or when distilling reusable writing style from files, text, chapters, reports, docs, or reference corpora.
---

# Writer's Loop

## Overview

Use this skill to improve writing through explicit decisions. The core rule is:
do not learn from raw drafts; learn from accepted, rejected, revised, or
manually overwritten decisions.

## When To Use

Use for substantial writing where quality depends on structure, audience fit,
correctness, style, or iteration:

- Coding plans, implementation plans, and technical proposals
- Business reports, research summaries, executive updates, and memos
- Product specs, design docs, documentation, and tutorials
- Fiction chapters, essays, scripts, speeches, and narrative outlines
- Style distillation from files, pasted text, chapters, reports, docs, or codebase prose
- Translation where meaning, tone, formatting, terminology, or voice preservation matters

Do not use for tiny one-off text edits unless the user asks for a reusable
process or preference learning.

## Core Loop

Follow the loop in order:

1. **Frame**: Identify artifact type, audience, purpose, constraints, success criteria, and desired tone.
2. **Question Gate**: Ask only blocking questions before planning. If context is enough, state assumptions and continue.
3. **Plan**: Create the outline, argument, task sequence, scene plan, or section structure before drafting.
4. **Plan Checkpoint**: Ask the user to approve or request changes before drafting, unless they explicitly waive the gate.
5. **Replan**: If the plan is rejected, revise the criticized parts, reissue the full plan, and ask again.
6. **Draft**: Write from the approved or best-current plan. Preserve declared constraints.
7. **Critique**: Evaluate against the artifact-specific rubric.
8. **Propose**: Suggest targeted revisions with reason, scope, and expected improvement.
9. **Decide**: Ask the user to accept, reject, or adjust meaningful changes.
10. **Revise**: Apply accepted changes and keep rejected changes out.
11. **Evaluate**: Check the revised artifact against the original success criteria.
12. **Learn**: Record preference signals from decisions, not from unreviewed output.
13. **Distill**: Promote repeated, high-confidence patterns into reusable writing rules.
14. **Reuse**: Apply stable rules in later writing tasks, scoped by artifact type and stage.

## Entry Modes

Choose the entry point from the user's request:

- New artifact: start at `Frame`, then `Question Gate`, then `Plan`.
- Draft requested with questions waived: use the fast draft path: `Frame`,
  `Assumptions`, compact `Plan`, `Draft`, then `Learning Status`. Say skipped
  questions are weak signals and do not become preferences. Do not stop at a
  plan checkpoint because the user explicitly asked for a draft.
- Optional multi-agent: default to the single-agent loop. Use the optional
  multi-agent extension only for high-stakes, long, ambiguous, or multi-audience
  artifacts where independent planning, drafting, critique, or editing would
  materially improve quality. Read `references/multi-agent.md` first.
- Existing draft: start at `Frame`, then `Critique`; plan only if structure is unclear.
- Targeted revision: start at `Frame`, then `Propose`; keep changes scoped to the request.
- Style distillation: start at `Frame`, then read `references/style-distillation.md`.
  Output `Frame`, then `Style Versus Content`, then `Style Pack`, then `Storage
  Decision`. The storage decision must ask whether to apply now, keep
  session-only, or save durably. The style/content section must explicitly
  separate style traits from content facts and say not to copy private facts,
  names, plot facts, or project-specific claims into reusable rules.
- Translation: start at `Frame`, then read `references/translation.md`. Preserve
  meaning, formatting, terminology, and style constraints before using the
  critique/revision loop.
- Preference update: start at `Learn`; use only explicit decisions or declared preferences.
  If the user sets storage mode, tone, length, or detail level for the current
  task, record it as a current constraint, not as a learned preference, unless
  they say it applies in future work.

Return to earlier stages when needed, but do not skip decision gates when the
user expects preference learning.

## Planning Gates

Before planning, ask up to five questions only when the answer would materially
change the plan. If the user asks to skip questions or the brief is sufficient,
state the working assumptions and continue. Treat skipped questions as weak or
neutral signals, never as strong preferences.

If the user says "no questions", "no need to ask", or otherwise waives the
question gate while asking for a draft, still show a short `Assumptions` section
and a compact `Plan` before the draft. End with `Learning Status: No reusable
preference learned; no reviewed decisions were collected.`

After presenting a plan, stop for a decision:

```text
PLAN CHECKPOINT
Reply "approve" to draft from this plan, or describe what to change.
```

If the user rejects or changes the plan, treat that as a `plan_revision_requested`
signal. Revise only the criticized elements, then reissue the complete plan and
checkpoint. Treat approval as a strong `plan_approved` signal. Do not draft
before approval unless the user explicitly says to skip approval; in that case,
state that preference learning is weaker because no plan decision was collected.

## Required Output Shape

Across a full loop, produce these artifacts as stages are reached. Do not emit
later-stage sections before their gates have passed:

- `Frame`: artifact type, audience, goal, constraints
- `Plan`: proposed structure or approach
- `Draft` or `Revision`: the generated text
- `Critique`: specific strengths, risks, and misses
- `Proposed Changes`: targeted edits with reasons
- `Decision Log`: accepted, rejected, adjusted, or unresolved changes
- `Learned Preferences`: only high-confidence reusable rules
- `Style Pack`: only when distilling style from sources
- `Translation`: only when translating across languages

If the user only wants one stage, provide that stage and state what evidence is
missing for preference learning.
If the user asks for a draft immediately and waives questions, include enough of
the loop to stay auditable: `Frame`, `Assumptions`, `Plan`, `Draft`, and
`Learning Status`.
If there is no repeated decision or explicit standing preference, write
`Learned Preferences: None` or a short learning-status note. Never create a
`Rule:` from a single current-task constraint.

## Signal Rules

Treat these as strong preference signals:

- Approved plans
- Rejected plans with reasons
- Accepted edits
- Rejected edits
- Undone edits
- Manual rewrites after generated output
- Explicit standing preferences declared by the user
- Repeated user adjustments in the same direction

Treat these as weak or non-signals:

- Unreviewed drafts
- One-off style comments
- Ambiguous praise or dislike
- Preferences that conflict with explicit task constraints
- Current-task constraints such as "this time", "for this memo", storage mode,
  tone, length, or detail level, unless the user explicitly says it is a
  standing preference for future work

## Distillation Rules

Promote a pattern into a reusable writing rule only when it is:

- Repeated across at least two meaningful decisions, or explicitly declared by the user
- Specific enough to guide future output
- Scoped to artifact type or stage when needed
- Not contradicted by more recent or stronger evidence

Use this format:

```text
Rule: [short imperative instruction]
Scope: [artifact type or stage]
Evidence: [accepted/rejected/manual decision summary]
Confidence: low | medium | high
```

Only reuse `medium` or `high` confidence rules. Ask before applying `low`
confidence rules.
Do not promote a single current-task instruction into `Learned Preferences`;
record it as a constraint or decision for the current artifact instead.

## Adaptation References

Read only the reference needed for the current task:

- `references/artifact-types.md`: plan shapes for common writing artifacts
- `references/critique-rubrics.md`: artifact-specific critique criteria
- `references/preference-signals.md`: preference signal examples and weighting guidance
- `references/checkpoints.md`: reusable question, plan, proposal, and close checkpoints
- `references/style-distillation.md`: extracting reusable style packs from files or text
- `references/translation.md`: translating while preserving meaning, tone, terminology, and formatting
- `references/multi-agent.md`: optional multi-agent workflow for complex or high-stakes writing
- `references/preference-journal.md`: optional durable journal and derived preferences format
- `references/validation-scenarios.md`: pressure tests for validating this skill before release

## Optional Tools

Use bundled scripts only when the user asks for durable preferences, package
validation, or release preparation:

- `scripts/validate-skill.mjs`: validate required files, metadata, references, and scenarios.
- `scripts/run-evals.mjs`: score built-in validation scenarios against the skill docs or response transcripts.
- `scripts/journal.mjs`: initialize `.writers-loop/`, append decision events, and derive `prefs.md`.

## Common Mistakes

- Drafting before framing the audience and success criteria
- Using multi-agent by default for ordinary writing tasks
- Critiquing with a generic rubric when the artifact type needs a specific one
- Applying broad rewrites when targeted edits would preserve user intent better
- Treating "no questions" as permission to skip framing, assumptions, and plan
- Treating a single accepted edit as a permanent global rule
- Turning "this time", "for this memo", or session-only storage into a durable
  learned preference
- Reusing fiction style preferences in coding plans, reports, or docs without evidence
- Forgetting to ask for explicit accept/reject decisions before claiming preference learning
- Copying source content facts into a reusable style pack
- Translating code, commands, file paths, URLs, IDs, or proper nouns unintentionally
- Treating one translation choice as a durable preference without user review
