# Preference Signals

Use this reference when deciding what can be learned from a writing loop.

## Signal Strength

Strong signals:
- User approves a plan after review
- User rejects a plan with a concrete reason
- User accepts a proposed edit
- User rejects a proposed edit
- User undoes an accepted edit
- User manually rewrites generated output
- User explicitly declares a standing preference
- User repeats the same correction across tasks

Medium signals:
- User asks for a narrower or broader scope
- User changes tone, length, or structure after seeing a draft
- User asks to preserve or remove a section
- User selects one version from two or more candidates
- User adjusts a proposal without accepting or rejecting it outright

Weak signals:
- User says "good" or "bad" without a reason
- User edits for a one-off constraint
- User changes a fact rather than a style or process preference
- User accepts a draft without reviewing alternatives

Non-signals:
- Model-generated text that was never reviewed
- Constraints copied from the prompt
- Domain requirements that should not become personal preferences
- Current-task constraints such as "this time", "for this memo", storage mode,
  tone, length, or detail level, unless the user explicitly declares a standing
  preference for future work

## Promotion Guidance

Promote a preference when:

- It appears in two or more strong signals
- It is explicitly stated by the user as a standing preference, not merely as a
  constraint for the current artifact
- It improves a measurable outcome such as acceptance rate, clarity, or reduced rewrites

Keep as a note when:

- It appears once
- It conflicts with another signal
- It may be artifact-specific but the scope is not clear

Discard or archive when:

- Newer evidence contradicts it
- It causes repeated rejected edits
- It is too vague to guide future writing
- It only applies to a single temporary requirement

## Scoping Rules

Prefer narrow scope first:

- `coding-plan/planning`
- `report/critique`
- `fiction/revision`
- `documentation/drafting`

Promote to global only when the same preference repeats across artifact types.

Examples:

```text
Rule: Lead with the recommendation before background.
Scope: report/planning
Evidence: Two accepted report revisions moved conclusions earlier.
Confidence: high
```

```text
Rule: Use concrete file paths and commands in implementation plans.
Scope: coding-plan/planning
Evidence: User rejected vague tasks and accepted a plan with exact files and tests.
Confidence: high
```

```text
Rule: Preserve restrained tone during emotional scenes.
Scope: fiction/revision
Evidence: User accepted two edits reducing melodramatic phrasing.
Confidence: medium
```

## Conflict Handling

When signals conflict:

- Prefer explicit user statements over inferred patterns.
- Prefer recent evidence over old evidence.
- Prefer repeated strong decisions over one isolated decision.
- Prefer artifact-specific rules over global rules.
- Ask before applying a rule if confidence is low or the scope is unclear.

## Decision Log Template

```text
Decision Log
- Accepted: [change] because [reason]
- Rejected: [change] because [reason]
- Adjusted: [change] to [new direction]
- Manual rewrite observed: [summary]

Candidate Preferences
- [rule], scope [scope], confidence [low|medium|high], evidence [summary]
```
