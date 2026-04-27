# Writer's Loop Complete Guide

This is the long-form documentation for `writers-loop`. For a shorter
user-facing guide, start with the root `README.md`.

This repository contains the `writers-loop` skill, a general method for
planning, drafting, critiquing, revising, and learning writing preferences from
explicit user decisions.

Use this guide when you want a complete, methodical loop instead of a one-shot
draft. It applies to coding plans, reports, proposals, documentation, product
specs, design docs, essays, speeches, fiction, style distillation, translation,
and other substantial writing.

## Core Principle

The loop should improve writing through decisions, not guesses.

Do not treat raw generated text as evidence of the user's preferences. Learn
only from reviewed decisions such as approved plans, rejected plans, accepted
edits, rejected edits, adjusted proposals, manual rewrites, or explicit standing
preferences.

## Complete Loop

Use the full loop when quality, structure, audience fit, or preference learning
matters.

1. Frame the artifact.
2. Ask blocking questions if needed.
3. Plan before drafting.
4. Wait for plan approval.
5. Replan if the plan is rejected.
6. Draft from the approved plan.
7. Critique the draft with an artifact-specific rubric.
8. Propose targeted changes.
9. Ask the user to accept, reject, or adjust changes.
10. Revise only the accepted or adjusted changes.
11. Evaluate the revised artifact against the original goal.
12. Learn preferences only from explicit decisions.
13. Distill repeated patterns into reusable rules.
14. Reuse stable rules in later tasks with the right scope.

## Recommended Starting Prompt

```text
Use the writers-loop skill for this writing task.

Artifact type:
Audience:
Goal:
Constraints:
Desired tone:
Target length:
Source material or context:
Must include:
Must avoid:

Start with framing and any blocking questions.
Do not draft until I approve the plan.
After drafting, critique the result, propose targeted revisions, and ask me to
accept, reject, or adjust each meaningful change before learning preferences.
```

## If You Want Speed

Use this prompt when you want a draft immediately but still want the loop to stay
auditable.

```text
Use the writers-loop skill, but use the fast draft path.

Do not stop for questions unless something is truly blocking.
State your assumptions.
Give a compact plan.
Then draft.
End with a learning status note.

Do not record reusable preferences unless I later accept, reject, adjust, or
rewrite specific changes.
```

## Real Usage Prompt Templates

### Mode Selector

```text
Use the writers-loop skill.

Mode: easy start | full cycle | critique only | style distillation | translation | learned style
Task:
Audience:
Goal:
Source material:
Storage: session-only unless I explicitly opt in

If mode is full cycle, stop at PLAN CHECKPOINT before drafting.
If mode is easy start, state assumptions, draft, critique briefly, and do not
learn reusable preferences.
If mode is learned style and the style pack is not available, ask me to paste it
or confirm local storage access before drafting.
```

### Easy Start

```text
Use the writers-loop skill for this writing task.

Task:
Audience:
Goal:
Constraints:
Tone:
Target length:
Source material:

Ask only if blocked. Otherwise state assumptions, make a compact plan, draft,
critique briefly, and propose the top three improvements.
Do not save preferences unless I explicitly ask.
```

### Full Cycle

```text
Use the writers-loop skill for a full writing cycle.

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

### Use Cases

```text
Use the writers-loop skill to turn these notes into a report or memo.

Audience:
Decision this should support:
Desired action:
Notes:
Known evidence gaps:
Target length:

Plan with executive summary, context, findings, recommendation, risks, and next
steps. Name assumptions and uncertainty. Wait for plan approval before drafting.
```

```text
Use the writers-loop skill to distill a reusable writing style from these sources.

Sources:
Intended reuse:
Artifact type:
Audience:
Permission or ownership:
Must preserve:
Must avoid:

Create a style pack. Separate style from content facts. Do not copy plot,
private facts, names, source passages, or project-specific claims into reusable
rules. Ask whether to apply now, keep session-only, or save durably.
```

```text
Use the writers-loop skill to translate this text.

Source language:
Target language and locale:
Mode: natural
Audience:
Preserve:
Glossary:
Style constraints:
Text:

Preserve meaning, source writing style, voice, rhythm, imagery, register,
terminology, markdown formatting, code, commands, file paths, URLs, IDs, and
names unless I say otherwise.
```

```text
Use the writers-loop skill with the learned style pack: [style-name].

Write:
Audience:
Goal:
Constraints:
Current-task facts:

Load the style pack first.
If the style pack is not available, ask me to paste it or confirm local storage
access before drafting.
Apply it as a drafting constraint.
Use only current-task facts.
Do not copy source passages or source facts from the style pack.
Critique content quality and style match separately.
```

## Question Gate

The question gate prevents bad plans from being built on missing context.

Ask questions only when the answer would materially change the plan. Good
question topics include audience, purpose, constraints, success criteria,
available evidence, required format, tone, length, continuity, risk, or
evaluation criteria.

Useful prompt:

```text
Before planning, ask up to five blocking questions.
If the context is enough, state your assumptions and continue.
Treat skipped questions as weak signals, not reusable preferences.
```

## Planning

The plan should match the artifact type.

For a coding plan, ask for goal, architecture, file map, task sequence, tests,
and rollout notes.

For a report or memo, ask for executive summary, context, findings,
recommendation, risks, and next steps.

For a proposal, ask for problem, solution, benefits, costs, risks, timeline, and
decision request.

For documentation, ask for purpose, prerequisites, minimal working path, steps,
examples, troubleshooting, and reference details.

For a design doc or product spec, ask for context, goals, non-goals, proposed
design, alternatives, risks, open questions, rollout, and validation.

For fiction or narrative, ask for scene sequence, character intent, conflict
escalation, turning point, ending beat, and continuity hooks.

For an essay or speech, ask for thesis, supporting points, examples,
counterpoint, transitions, and close.

For style distillation, ask for source files or text, intended reuse, artifact
type, audience, preservation goals, and what must not be copied into reusable
rules.

For translation, ask for source language, target language and locale, translation
mode, audience, glossary, source-style targets, and formatting constraints.

Useful prompt:

```text
Create the plan only.
Use the plan shape appropriate for this artifact type.
End with:

PLAN CHECKPOINT
Reply "approve" to draft from this plan, or describe what to change.
```

## Replanning

If the plan is rejected, do not patch only one line and continue. The skill
should revise the criticized parts, reissue the complete plan, and wait again.

Useful prompt:

```text
Replan based on my rejection.
Preserve the parts I did not criticize.
Revise the weak parts.
Reissue the complete plan.
Do not draft yet.
```

## Critique

Critique is not the same as rewriting. Critique should identify what works, what
misses the goal, what risks confusing or losing the reader, and what should be
changed.

A useful critique should be specific enough to support decisions. It should name
the location, the problem, the reason it matters, and the likely improvement.

Use the universal critique rubric for every artifact:

1. Purpose: Does the text serve the stated goal?
2. Audience fit: Does it match the reader's context and expectations?
3. Structure: Is the order easy to follow?
4. Specificity: Are claims, steps, or scenes concrete enough?
5. Completeness: Are important requirements or constraints missing?
6. Coherence: Do sections support each other without contradiction?
7. Style: Does tone match the task?
8. Actionability: Does the reader know what to do next?

Then add the artifact-specific rubric. For example, a report critique should
check conclusion visibility, evidence quality, assumptions, uncertainty,
tradeoffs, and next steps. A fiction critique should check scene purpose,
character motivation, tension, POV, continuity, prose style, and ending effect.

Useful prompt:

```text
Critique this draft before revising it.
Use the universal rubric and the artifact-specific rubric.
Separate strengths, risks, and misses.
Do not rewrite yet.
End by proposing targeted changes for my decision.
```

## Revision Proposals

Revision proposals convert critique into user decisions. This is the bridge
between evaluation and preference learning.

Ask for targeted changes rather than broad rewrites unless the structure is
fundamentally wrong. Each proposal should include scope, reason, risk, and a
decision request.

Useful prompt:

```text
Propose targeted revisions using this format:

Change: [short label]
Scope: [sentence | paragraph | section | scene | whole artifact]
Original: [quote or describe the target]
Revision: [replacement or instruction]
Reason: [why this improves the artifact]
Risk: [what might be lost or changed]
Decision: accept | reject | adjust | unresolved

Wait for my decisions before revising.
```

## Style Distillation

Use style distillation when the user wants to learn a reusable writing style
from files, pasted text, chapters, reports, docs, or codebase prose.

Useful prompt:

```text
Use the writers-loop skill to distill writing style from these sources.

Sources:
Intended reuse:
Artifact type:
Audience:
Must preserve:
Must avoid:

Create a style pack.
Separate style from content facts.
Do not copy plot, private facts, names, or project-specific claims into reusable
style rules.
Include a `Style Versus Content` section before the style pack.
Ask before saving anything durable.
```

Expected output:

```text
Frame:
- Source type:
- Target artifact type:
- Audience:
- Intended reuse:
- Constraints:

Style Versus Content:
- Extract as style:
- Do not copy as reusable rules:

Style Pack
Name:
Source:
Intended reuse:
Confidence:
Summary:
Observable Traits:
Do:
Avoid:
Structure Rules:
Language Rules:
Reusable Prompts:
Evidence Notes:

Storage Decision:
Reply "apply now", "keep session-only", or "save durably".
```

Read `skills/writers-loop/references/style-distillation.md` for the full
style-pack method.

## Using A Learned Style

Use this when the user has a style pack in the conversation or in
`.writers-loop/styles/`.

Useful prompt:

```text
Use the writers-loop skill with the learned style pack: my-style.

Write:
Audience:
Goal:
Constraints:

Load the style pack first.
Apply it as a drafting constraint.
Use only current-task facts.
Do not copy source passages or source facts from the style pack.
After drafting, critique content quality and style match separately.
```

Expected loop:

```text
load style pack -> frame task -> plan content and style -> draft -> critique content -> review style match -> revise
```

Style packs and learned preferences are separate. A style pack is reusable
voice, rhythm, structure, diction, imagery, register, and formatting guidance.
Learned preferences are decision-backed rules from user review.

## Translation

Use translation mode when the user wants writing moved into another language
while preserving meaning and the original language's writing style: voice,
rhythm, imagery, register, pacing, emotional effect, terminology, formatting, or
voice.

Useful prompt:

```text
Use the writers-loop skill to translate this text.

Source language:
Target language and locale:
Mode: natural
Audience:
Preserve:
Glossary:
Style constraints:

Preserve the original writing style, voice, rhythm, imagery, register, and emotional effect in the target language.
Preserve markdown formatting, names, commands, file paths, code, URLs, and IDs
unless I explicitly say otherwise.
After translating, review fidelity, source-style preservation, terminology, and formatting.
```

Supported modes:

```text
literal
natural
localized
parallel
review-only
```

Read `skills/writers-loop/references/translation.md` for the full
translation method.

## Decision Language

Use clear decision words so the skill can learn correctly.

```text
accept change 1
reject change 2 because it sounds too formal
adjust change 3: keep the shorter opening but make the tone warmer
undo the last edit
approve the plan
replan with a more skeptical audience
this is a standing preference for future reports
this is only for this draft
```

## Preference Learning

Preference learning should be conservative.

Strong signals include approved plans, rejected plans with reasons, accepted
edits, rejected edits, undone edits, manual rewrites, explicit standing
preferences, and repeated corrections in the same direction.

Medium signals include scope changes, tone changes after review, choosing one
version from multiple candidates, preserving or removing a section, and adjusted
proposals.

Weak signals include vague praise, vague dislike, one-off style comments, and
accepting a draft without alternatives.

Non-signals include unreviewed model output, facts copied from the prompt,
domain requirements, and current-task constraints unless the user says they
apply in future work.

Useful prompt:

```text
Summarize preference signals from this session.
Learn only from my explicit decisions.
Separate current-task constraints from reusable preferences.
Do not promote a rule from a single one-off instruction.
```

## Distilling Rules

Promote a preference into a reusable rule only when it is repeated or explicitly
declared as standing guidance.

Use this format:

```text
Rule: [short imperative instruction]
Scope: [artifact type or stage]
Evidence: [accepted/rejected/manual decision summary]
Confidence: low | medium | high
```

Only reuse medium or high confidence rules automatically. Ask before applying
low confidence rules.

## Multi-Agent Extension

Use the optional multi-agent extension only when independent review would
materially improve quality. Good cases include long artifacts, high-stakes
decisions, complex continuity, multi-audience documents, or tasks where
planning, drafting, critique, and editing should be separated.

Useful prompt:

```text
Use the optional multi-agent extension if available.

Planner: produce the structure.
Drafter: write from the approved plan.
Critic: evaluate against the relevant rubric.
Editor: apply accepted changes.
Preference learner: summarize only decision-backed preferences.

If real subagents are unavailable, say so and use role-simulated passes instead.
```

## Complete Loop Prompt

Use this when you want the whole method.

```text
Use the writers-loop skill completely and methodologically.

Artifact type:
Audience:
Goal:
Constraints:
Desired tone:
Target length:
Context:
Must include:
Must avoid:

Run the loop in stages:
1. Frame the artifact.
2. Ask only blocking questions.
3. Plan using the right artifact-specific structure.
4. Stop at a plan checkpoint.
5. If I reject the plan, replan and ask again.
6. Draft only after approval.
7. Critique using the universal and artifact-specific rubrics.
8. Propose targeted revisions with reasons and risks.
9. Wait for my accept, reject, or adjust decisions.
10. Revise based only on accepted or adjusted changes.
11. Evaluate the final version against the original goal.
12. Summarize decision-backed preference signals.
13. Distill reusable rules only when evidence is strong enough.

Do not treat unreviewed drafts or one-off constraints as learned preferences.
```

## Minimal Loop Prompt

Use this when the task is small but you still want discipline.

```text
Use a compact writers-loop.

Frame the goal.
State assumptions.
Give a short plan.
Draft.
Critique briefly.
Propose the top three changes.
Ask me to accept, reject, or adjust them.
Only then revise and summarize any decision-backed preferences.
```

## Recommended Practice

For important work, do not ask for the final artifact first. Ask for the plan
first, approve or replan, then draft. After the draft, ask for critique before
revision. After critique, make explicit decisions on proposed changes. This is
the part that makes preference learning reliable.

For recurring work, close each session with a short decision log and candidate
preferences. Over time, promote repeated patterns into scoped rules such as
`report/planning`, `coding-plan/critique`, `documentation/drafting`, or
`fiction/revision`.
