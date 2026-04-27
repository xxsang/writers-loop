# Artifact Types

Use this reference to adapt the core loop to the artifact being written.

Plan shapes below are ordered. Produce sections in the listed sequence unless
the user specifies otherwise. If the artifact type is not listed here, use the
universal rubric in `references/critique-rubrics.md` and ask if it is sufficient.

## Coding Plan

Frame:
- Goal, current codebase context, constraints, risk, test expectations

Plan shape:
- Goal
- Architecture
- File map
- Task sequence
- Tests and verification
- Rollout or migration notes

Critique focus:
- Scope control
- File ownership
- Testability
- Sequencing
- Missing edge cases
- Ambiguous handoffs

Reusable preferences:
- Preferred planning granularity
- TDD strictness
- Risk tolerance
- Commit and review cadence

## Report Or Memo

Frame:
- Audience, decision to support, evidence available, desired action

Plan shape:
- Executive summary
- Context
- Findings
- Evidence gaps
- Recommendation
- Risks
- Next steps

Critique focus:
- Clear conclusion
- Evidence quality
- Evidence gaps, limits, and caveats
- Logical flow
- Tradeoff visibility
- Actionability

Reusable preferences:
- Level of formality
- Data density
- Whether to lead with recommendation or context

## Proposal

Frame:
- Stakeholders, ask, value, constraints, objections

Plan shape:
- Problem
- Proposed solution
- Benefits
- Costs
- Risks
- Timeline
- Decision request

Critique focus:
- Specific ask
- Credible value
- Objection handling
- Feasible timeline
- Risk honesty

Reusable preferences:
- Preferred persuasion style
- Appetite for quantified tradeoffs
- Preferred level of detail

## Technical Documentation

Frame:
- User role, task, prerequisites, expected outcome

Plan shape:
- What this is for
- Minimal working path
- Step-by-step instructions
- Examples
- Troubleshooting
- Reference details

Critique focus:
- Correctness
- Completeness
- User path clarity
- Example quality
- Hidden assumptions

Reusable preferences:
- Example-first or concept-first
- Concision level
- Troubleshooting depth

## Design Doc Or Product Spec

Frame:
- Problem, users, goals, non-goals, constraints, success metrics

Plan shape:
- Context
- Goals and non-goals
- Proposed design
- Alternatives
- Risks
- Open questions
- Rollout and validation

Critique focus:
- Problem clarity
- Constraint coverage
- Alternatives
- Failure modes
- Measurable success

Reusable preferences:
- Decision record depth
- Preference for diagrams or prose
- Risk documentation style

## Fiction Or Narrative

Frame:
- Genre, audience, POV, tone, continuity, emotional target

Plan shape:
- Scene sequence
- Character intent
- Conflict escalation
- Turning point
- Ending beat
- Continuity hooks

Critique focus:
- Character motivation
- Pacing
- Voice
- Continuity
- Continuity check for unchanged facts, timeline, POV, and setting
- Use the phrase "preserve user intent"; preserve plot facts, voice, continuity, and declared constraints before improving style
- Scene specificity
- Emotional payoff

Reusable preferences:
- POV distance
- Prose density
- Dialogue style
- Tolerance for exposition

## Essay Or Speech

Frame:
- Audience, thesis, occasion, stance, length

Plan shape:
- Thesis
- Supporting points
- Evidence or examples
- Counterpoint
- Close

Critique focus:
- Thesis clarity
- Rhythm
- Transitions
- Evidence fit
- Ending strength

Reusable preferences:
- Rhetorical intensity
- Personal voice
- Formality
- Evidence style

## Poetry

Limited support — the universal rubric does not fully apply. Use a custom rubric.

Frame:
- Form (free verse, fixed form, prose poem), line-break intent, sound targets,
  emotional target, occasion

Plan shape:
- Central image or tension
- Line-break and stanza logic
- Sound pattern (rhyme, near-rhyme, repetition, silence)
- Ending approach

Critique focus (replace universal rubric for poetry):
- Does each line earn its break?
- Does sound reinforce meaning, or work against it?
- Is compression serving the poem, or losing necessary weight?
- Is the central image or tension sustained without over-explanation?
- Does the ending close, open, or resist — and does that match intent?

Note: "Specificity" and "clarity" from the universal rubric may conflict with
compression or ambiguity that is intentional. Flag candidates for discussion
rather than required fixes.

Reusable preferences:
- Tolerance for ambiguity
- Preference for image density or plainness
- Line-length tendencies

## Academic Or Whitepaper

Limited support — peer review and citation conventions are domain-specific.
Adapt the plan shape and rubric to the target venue's requirements.

Frame:
- Venue or journal, audience expertise level, contribution claim, citation style

Plan shape:
- Abstract
- Introduction and contribution claim
- Related work
- Method or argument
- Results or evidence
- Discussion and limitations
- Conclusion
- References

Critique focus:
- Is the contribution claim specific and falsifiable?
- Does the evidence support the claim at the stated confidence level?
- Are limitations named honestly?
- Is related work fairly characterised?
- Does the terminology stay consistent throughout?
- Are citations correctly scoped (not overclaiming what sources say)?

Reusable preferences:
- Passive vs. active voice preference
- Tolerance for hedging language
- Preferred level of formality in discussion

## Constrained Or Brand-Governed Writing

Use when external style constraints apply that the writer cannot override:
legal filings, clinical notes, regulatory copy, brand guidelines, corporate
communication standards.

Frame:
- External constraint source (brand guide, legal template, regulatory standard),
  non-negotiable rules, permitted variation, audience, purpose

Plan shape:
- Required sections or headings (from constraint source)
- Permitted creative range within each section
- Terms or phrases that must or must not appear

Critique focus:
- Does the draft comply with all non-negotiable constraints?
- Are permitted variations used well within the allowed range?
- Are required terms present and correctly used?
- Are prohibited terms absent?

Note: Do not treat constraint compliance as a reusable personal preference.
Brand rules, legal templates, and regulatory requirements are external
guardrails, not the user's writing choices.

Reusable preferences:
- Preferred tone within the permitted range
- Preferred structure when the constraint leaves room
