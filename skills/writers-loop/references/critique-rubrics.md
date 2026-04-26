# Critique Rubrics

Use the rubric that matches the artifact. Keep critique specific and tied to
revision proposals.

## Universal Rubric

Check every substantial artifact for:

- Purpose: Does the text serve the stated goal?
- Audience fit: Does it match the reader's context and expectations?
- Structure: Is the order easy to follow?
- Specificity: Are claims, steps, or scenes concrete enough?
- Completeness: Are important requirements or constraints missing?
- Coherence: Do sections support each other without contradiction?
- Style: Does tone match the task?
- Actionability: Does the reader know what to do next?

## Coding Plan Rubric

- Can an engineer execute it without hidden context?
- Are files, interfaces, tests, and commands concrete?
- Does each task have one clear responsibility?
- Are risky migrations or shared contracts isolated?
- Is verification proportional to risk?
- Are placeholders and vague steps removed?

## Report Rubric

- Is the conclusion visible early?
- Are findings separated from interpretation?
- Is evidence strong enough for the recommendation?
- Are assumptions and uncertainty named?
- Are tradeoffs explicit?
- Are next steps concrete?

## Proposal Rubric

- Is the ask explicit?
- Is the benefit credible and specific?
- Are costs and risks honestly represented?
- Are objections anticipated?
- Is the implementation path believable?
- Does the close make the decision easy?

## Documentation Rubric

- Can the target user complete the task?
- Are prerequisites clear?
- Does the first example work as written?
- Are edge cases and failures explained where useful?
- Is reference detail separated from the main path?
- Is terminology consistent?

## Design Doc Rubric

- Are goals and non-goals explicit?
- Does the design solve the stated problem?
- Are alternatives and tradeoffs covered?
- Are failure modes named?
- Are rollout and validation paths realistic?
- Are open questions separated from decisions?

## Fiction Rubric

- Does every scene have a purpose?
- Are character choices motivated?
- Does tension escalate?
- Is POV stable unless intentionally shifted?
- Are continuity facts respected?
- Does prose style match the desired tone?
- Does the ending create the intended effect?

## Revision Proposal Format

Use this format for targeted changes:

```text
Change: [short label]
Scope: [sentence | paragraph | section | scene | whole artifact]
Original: [quote or describe the target]
Revision: [replacement or instruction]
Reason: [why this improves the artifact]
Risk: [what might be lost or changed]
Decision: accept | reject | adjust | unresolved
```
