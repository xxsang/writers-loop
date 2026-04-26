# Validation Scenarios

Use these pressure scenarios before releasing or changing the skill. The goal is
to verify that an agent follows the loop and does not invent preferences from
unreviewed drafts.

For package checks, also run:

```bash
npm run validate
npm run scan:secrets
npm run eval
npm run eval:ab
```

The A/B command exits non-zero when the treatment does not pass every scenario.
That is intentional: a failed A/B run is evidence for revising the skill,
the evaluator, or the scenario design.

Public release files should include `package.json`, plugin manifests, root
documentation, MIT license text, and contribution guidance.

## Scenario 1: Coding Plan

Prompt:

```text
Use the writers-loop skill to write an implementation plan for adding OAuth login to an existing app. Keep it practical.
```

Expected behavior:
- Frames audience, goal, constraints, and verification.
- Produces a concrete implementation plan.
- Critiques for missing tests, unclear ownership, and rollout risk.
- Does not claim learned preferences until decisions are made.

Failure signs:
- Produces only a generic checklist.
- Skips critique.
- Distills a permanent preference from the first draft.

## Scenario 2: Executive Report

Prompt:

```text
Use the writers-loop skill to turn these notes into a report for leadership: revenue is down 8%, churn is up in SMB, enterprise expansion is stable, support tickets mention onboarding confusion.
```

Expected behavior:
- Frames audience and decision.
- Plans an executive report structure.
- Drafts with a clear recommendation.
- Critiques evidence gaps and next-step clarity.
- Proposes targeted revisions.

Failure signs:
- Buries the recommendation.
- Treats all notes as equally important.
- Uses a fiction or coding-plan rubric.

## Scenario 3: Fiction Chapter

Prompt:

```text
Use the writers-loop skill to revise this chapter opening for a quieter, more tense style: [draft]
```

Expected behavior:
- Frames genre, tone, POV, and continuity needs.
- Critiques pacing, voice, and specificity.
- Proposes local revisions before broad rewrites.
- Distills style preferences only from accepted or repeated decisions.

Failure signs:
- Rewrites the whole chapter without asking.
- Treats one tone request as a global preference.
- Ignores continuity or POV.

## Scenario 4: Preference Conflict

Prompt:

```text
Last time I wanted concise reports. This time I need a detailed research memo with all caveats. Use the writers-loop skill.
```

Expected behavior:
- Treats the new explicit requirement as controlling.
- Keeps prior concise-report preference scoped.
- Does not apply a global brevity rule blindly.

Failure signs:
- Forces concision despite the detailed memo requirement.
- Archives the old preference without evidence.

## Scenario 5: No Learning Evidence

Prompt:

```text
Draft a product launch email with the writers-loop skill. No need to ask questions.
```

Expected behavior:
- Frames from available context and states assumptions.
- States that skipped questions are weak signals.
- Produces plan and draft.
- Notes that preference learning requires review decisions.

Failure signs:
- Claims learned preferences from the generated email alone.
- Skips planning entirely.
- Treats "no questions" as permission to omit assumptions.

## Scenario 6: Rejected Plan

Prompt:

```text
Use the writers-loop skill to plan a migration report. After the first plan, I will reject the structure and ask for a risk-first version.
```

Expected behavior:
- Presents the first plan and stops at a plan checkpoint.
- On rejection, records the rejection as planning evidence.
- Revises only the criticized structure.
- Reissues the complete plan and checkpoint before drafting.

Failure signs:
- Drafts immediately after the rejected plan.
- Revises only a fragment and loses the rest of the plan.
- Treats the rejected structure as a reusable preference.

## Scenario 7: Durable Storage Opt-In

Prompt:

```text
Use the writers-loop skill. Keep preference learning session-only; do not create project files.
```

Expected behavior:
- Tracks decisions in the conversation only.
- Does not create `.writers-loop/`.
- Explains that durable reuse requires explicit opt-in.

Failure signs:
- Writes journal or preference files anyway.
- Claims cross-session reuse without persistence.

## Scenario 8: Optional Multi-Agent

Prompt:

```text
Use the writers-loop skill to prepare a board memo for a risky acquisition. Use multiple agents only if it is worth the overhead.
```

Expected behavior:
- Defaults to the single-agent loop unless multi-agent is justified.
- If multi-agent is used, states why the artifact needs independent roles.
- Keeps Controller ownership of merge policy and final synthesis.
- Uses distinct roles such as Planner, Drafter, Critic, Editor, and Preference Distiller.
- Does not claim preference learning from agent critiques alone.

Failure signs:
- Uses multi-agent for a trivial task without justification.
- Lets agent votes override user constraints.
- Treats internal critic suggestions as durable preferences.

## Scenario 9: Style Learning And Style Distillation

Prompt:

```text
Use the writers-loop skill to learn the writing style from these markdown files and produce a reusable style pack. Treat these as permitted reference samples. Do not copy project facts or source passages into the style rules.
```

Expected behavior:
- Reads `references/style-distillation.md`.
- Samples or selects representative prose instead of blindly overloading context.
- Separates style, structure, terminology, and content facts.
- Produces a style pack with traits, do rules, avoid rules, prompts, evidence notes, and confidence.
- Asks whether the style pack should be applied now, kept session-only, or saved.
- If permission or intended reuse is unclear for another person's style, asks before durable storage.

Failure signs:
- Copies plot, business facts, names, or private claims into style rules.
- Copies source passages into reusable prompts or examples.
- Overfits from a single short sample.
- Claims durable style preferences without user opt-in or repeated decisions.

## Scenario 10: Translation With Style Preservation

Prompt:

```text
Use the writers-loop skill to translate this Chinese fiction passage into natural English while preserving the original Chinese restrained cinematic style, rhythm, imagery, emotional temperature, and markdown formatting: [text]
```

Expected behavior:
- Reads `references/translation.md`.
- Frames source language, target language, locale, audience, mode, and formatting constraints.
- Identifies source-style targets such as voice, rhythm, imagery, register, pacing, and emotional effect.
- Preserves names, formatting, code-like tokens, and fixed terms unless told otherwise.
- Uses a glossary for repeated or ambiguous terms.
- Reviews meaning fidelity, source-style preservation, and target-language naturalness before proposing revisions.
- Does not treat one translation choice as a permanent preference without user review.

Failure signs:
- Produces generic polished English that loses the requested voice.
- Preserves meaning but flattens the source rhythm, imagery, register, or emotional temperature.
- Translates file paths, commands, IDs, or other fixed tokens.
- Omits ambiguity notes for terms with multiple plausible translations.
