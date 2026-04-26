# Translation

Use this reference when the user asks to translate writing into another language
and quality depends on meaning, tone, style, terminology, formatting, or cultural
fit.

## Goal

Translate the artifact while preserving intended meaning and the right writing
effect for the target audience. Do not flatten voice into generic prose.

## Flow

1. Frame source language, target language, locale, audience, purpose, and format.
2. Ask blocking questions only if language, locale, fidelity level, or glossary is missing.
3. Identify fixed terms, names, commands, file paths, code, citations, and formatting.
4. Build a small glossary for repeated or high-risk terms.
5. Translate in the requested mode.
6. Review for meaning fidelity.
7. Review for style and naturalness.
8. Propose targeted changes when quality matters.
9. Revise only accepted or adjusted changes.

## Translation Modes

Use one mode explicitly:

```text
literal: preserve source structure closely
natural: prioritize fluent target-language reading
localized: adapt idioms, examples, and cultural framing
parallel: show source and translation side by side
review-only: critique an existing translation without rewriting
```

Default to `natural` unless the user asks for literal translation or legal,
technical, academic, or citation-sensitive fidelity.

## Question Gate

Ask only questions that change the translation:

```text
Target language and locale?
Literal, natural, localized, or parallel mode?
Should names, titles, terms, commands, or formatting stay unchanged?
Is there a glossary or style reference?
Who is the target reader?
```

If the user already provided enough context, state assumptions and translate.

## Preserve Exactly Unless Told Otherwise

Preserve these by default:

```text
code blocks
inline code
file paths
CLI commands
URLs
IDs
API names
proper nouns
citations
tables and headings
markdown structure
```

For fiction, preserve character names unless the user asks for localization.
For technical writing, preserve product names and protocol terms unless a
standard translated term exists.

## Glossary Format

```text
Glossary
- Source term:
  Translation:
  Rule:
  Confidence:
```

Use glossary entries for repeated terms, ambiguous terms, domain terms, and
names with intentional translation choices.

## Translation Output Shape

For short tasks:

```text
Translation
[translated text]

Notes
- [only important choices or ambiguities]
```

For substantial tasks:

```text
Frame
- Source language:
- Target language:
- Mode:
- Audience:
- Constraints:

Glossary
- [term choices]

Translation
[translated text]

Review
- Fidelity:
- Style:
- Terminology:
- Formatting:

Proposed Changes
- [targeted changes if revision is needed]
```

## Review Rubric

Check:

```text
meaning fidelity
tone preservation
voice preservation
terminology consistency
idiom handling
reader naturalness
format preservation
omissions or additions
ambiguity handling
```

## Interaction With Style Distillation

If the user provides style references or asks to preserve a known voice, read
`references/style-distillation.md` first, create or load a style pack, then use
that pack as a translation constraint.

If the user asks to translate and improve, translate first, then use the main
critique and revision loop.

## Common Mistakes

- Translating code, commands, file paths, or IDs.
- Losing the source tone by making everything generic and polished.
- Over-localizing when the user asked for faithful translation.
- Keeping source-language idioms that sound unnatural in the target language.
- Failing to flag ambiguous terms.
- Treating one translation choice as a permanent preference without user review.
