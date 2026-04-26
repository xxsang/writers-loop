# Checkpoints

Use these checkpoint formats when the user wants a disciplined loop or when
preference learning matters.

## Question Gate

Ask questions only when the answer changes the plan.

```text
QUESTION GATE
I need these answers before planning:
1. [blocking question]
2. [blocking question]

Reply with answers, or say "skip" and I will continue with stated assumptions.
```

If questions are skipped:

```text
ASSUMPTIONS
- [assumption]
- [assumption]

Skipped questions are weak signals; they will not become strong preferences.
```

If the user asks for a draft and waives questions, use this fast path instead
of stopping at the plan checkpoint:

```text
Frame
- Artifact type: [type]
- Audience: [audience]
- Goal: [goal]
- Constraints: [constraints]

ASSUMPTIONS
- [assumption]
- [assumption]

Skipped questions are weak signals; they will not become strong preferences.

Plan
1. [structure]
2. [structure]

Draft
[draft text]

Learning Status
No reusable preference learned; no reviewed decisions were collected.
```

## Plan Checkpoint

```text
PLAN CHECKPOINT
[plan]

Reply "approve" to draft from this plan, or describe what to change.
```

Plan decisions:

- `approve`: record `plan_approved`, then draft.
- `change/reject/revise`: record `plan_revision_requested`, revise the plan, reissue checkpoint.
- `skip approval`: draft, but mark plan-learning confidence as low.

## Revision Proposal

Offer one targeted proposal at a time when precision matters.

```text
REVISION PROPOSAL [1/3]: [short title]
Scope: [sentence | paragraph | section | scene | whole artifact]
Original: [target text or location]
Revision: [replacement or instruction]
Reason: [why this improves the artifact]
Risk: [what might be lost]

Reply "apply", "reject", or "adjust: [instruction]".
```

Decision meanings:

- `apply`: accepted edit; strong positive signal.
- `reject`: rejected edit; strong negative signal.
- `adjust`: partial signal; preserve the user's direction.
- `undo`: negative signal for the previously applied edit.

## Session Close

```text
SESSION COMPLETE
Applied: [N]
Rejected: [N]
Adjusted: [N]
Unresolved: [N]

Learned Preferences:
- [rule, scope, evidence, confidence]
```

Do not list learned preferences if there were no review decisions. Say what
evidence is still missing instead.
