# Demo Transcript

This short transcript shows the intended Writer's Loop behavior.

## User

```text
Use $writers-loop to draft a launch email for a small developer tool.
Audience: existing beta users.
Goal: announce public availability and ask them to try the new release.
Tone: direct, warm, not overpromotional.
Must include: thanks for beta feedback, link placeholder, short call to action.
Must avoid: exaggerated claims.
```

## Agent

```text
Frame
- Artifact type: launch email
- Audience: existing beta users
- Goal: announce public availability and invite users to try the release
- Constraints: direct, warm, not overpromotional; include thanks, link placeholder, and a short call to action

Question Gate
No blocking questions. I will assume the product name can remain a placeholder.

Plan
1. Subject line
2. Brief thanks for beta feedback
3. Public release announcement
4. What changed, in one concrete sentence
5. Link placeholder
6. Short call to action

PLAN CHECKPOINT
Reply "approve" to draft from this plan, or describe what to change.
```

## User

```text
approve, but make it shorter
```

## Agent

```text
Decision Log
- Plan approved.
- Adjustment requested: keep the email short.

Draft
Subject: [Product] is now public

Hi [Name],

Thank you for being part of the beta. Your feedback helped shape the release we are opening up today.

[Product] is now publicly available, with a cleaner setup flow and the fixes beta users asked for most.

Try it here: [link]

If you have a few minutes, I would value one more round of feedback.

Thanks,
[Sender]

Critique
Strengths:
- Direct and warm.
- Thanks beta users without overclaiming.
- Includes a clear link and call to action.

Risks:
- "fixes beta users asked for most" may be too vague if users expect specifics.
- The call to action asks for feedback but not specifically to try the release.

Proposed Changes
1. Replace the vague fixes sentence with a more concrete but still placeholder-safe line.
2. Make the call to action explicitly ask users to try the public release.

Decision Request
Reply with "accept 1", "accept 2", "reject", or adjustments.
```

## User

```text
accept 2, reject 1 because we do not have the exact feature list finalized
```

## Agent

```text
Revision
Subject: [Product] is now public

Hi [Name],

Thank you for being part of the beta. Your feedback helped shape the release we are opening up today.

[Product] is now publicly available, with a cleaner setup flow and the fixes beta users asked for most.

Try the public release here: [link]

If you have a few minutes after trying it, I would value one more round of feedback.

Thanks,
[Sender]

Learned Preferences
None. The accepted shorter-call-to-action change is useful for this email, but it is only one reviewed decision. The rejected feature-specific revision is a current-task constraint unless repeated or declared as a future preference.
```
