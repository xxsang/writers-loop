# Style Learning And Style Distillation

Use this reference when the user asks to learn writing style from files,
chapters, pasted text, reports, docs, or codebase text.

## Goal

Create reusable style guidance that lets future drafts write in the user's own
style or a permitted reference style without copying private content, source
passages, plot facts, names, business facts, or domain-specific claims into a
style rule.

## Flow

1. Identify source type, target artifact type, audience, permission or ownership, and intended reuse.
2. Select representative samples instead of reading every token when the corpus is large.
3. Separate style from content facts.
4. Extract observable traits.
5. Produce a reusable style pack.
6. Validate the style pack against samples.
7. Ask whether to use it for the current task, save it, or keep it session-only.

Always include an explicit `Style Versus Content` section before the style pack.
This section must name what will be extracted as style and what will not be
copied into reusable rules.

Always start the response with a `Frame` section and end with a `Storage
Decision` section. The storage decision must ask whether to apply the style pack
now, keep it session-only, or save it durably.

## Source Handling

Use selected files, pasted text, chapters, reports, docs, or codebase prose.
If the user wants to clone or adapt another person's style, confirm the samples
are permitted for the requested use or keep the style pack session-only and
avoid durable storage until permission is clear.

When the source is a codebase, search for writing-heavy files first:

```text
README.md
docs/
*.md
*.mdx
prompts
templates
examples
fixtures
```

Avoid treating implementation code as prose style unless the user asks for code
comment or API documentation style.

For long corpora, sample from the beginning, middle, and end. Prefer multiple
representative documents over one oversized document.

## Style Versus Content

Extract:

```text
voice
tone
sentence rhythm
paragraph shape
level of abstraction
image density
argument structure
transition style
dialogue style
terminology conventions
formatting conventions
reader relationship
```

Do not extract:

```text
plot events
private facts
customer names
confidential claims
domain truths
source passages
temporary project constraints
one-off factual wording
```

## Style Pack Format

```text
Frame
- Source type:
- Target artifact type:
- Audience:
- Permission or ownership:
- Intended reuse:
- Constraints:

Style Versus Content
- Extract as style: [voice, rhythm, structure, terminology pattern, formatting pattern]
- Do not copy as reusable rules: [plot facts, private facts, names, source passages, project-specific claims]

Style Pack
Name:
Source:
Intended reuse:
Confidence:

Summary:
[2-4 sentence summary]

Observable Traits:
- [trait]

Do:
- [reusable instruction]

Avoid:
- [reusable anti-pattern]

Structure Rules:
- [section, scene, paragraph, or argument pattern]

Language Rules:
- [diction, syntax, terminology, rhythm]

Reusable Prompts:
- Drafting: [prompt]
- Critique: [prompt]
- Revision: [prompt]

Evidence Notes:
- [source evidence summary without long quotes]

Storage Decision:
Reply "apply now", "keep session-only", or "save durably".
```

## Confidence

Use `high` only when traits repeat across multiple samples.
Use `medium` when there is enough evidence but limited variety.
Use `low` when the corpus is small, inconsistent, or heavily edited by unknown authors.

Ask before applying low-confidence style rules.

## Applying A Style Pack

When using a style pack inside the main loop:

1. Add it to `Frame` as a style constraint.
2. Mention which style rules materially affect the `Plan`.
3. Draft with the style pack.
4. Critique for style match and content quality separately.
5. Treat user acceptance or rejection of style-matching edits as preference evidence.

## Common Mistakes

- Copying content facts into style rules.
- Copying source passages into reusable prompts or examples.
- Overfitting from one short sample.
- Treating genre conventions as the user's personal style.
- Treating another person's style samples as permitted when permission or intended reuse is unclear.
- Mixing style preferences across unrelated artifact types.
- Claiming a permanent preference when the user only asked to match a source once.
