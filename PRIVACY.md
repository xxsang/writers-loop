# Privacy Policy

Writer's Loop is a local skill repository. It does not include hosted services, telemetry, analytics, network calls, or third-party API integrations.

## What It Stores

By default, Writer's Loop stores nothing durable. Preference learning is session-only unless the user explicitly opts into local filesystem storage.

When local storage is enabled, Writer's Loop can write these files inside the user's selected project:

```text
.writers-loop/
|-- journal.jsonl
`-- prefs.md
```

`journal.jsonl` may contain summaries of reviewed writing decisions. `prefs.md` contains derived writing preferences from those reviewed decisions.

## Sensitive Writing Data

Writing drafts can contain private ideas, business information, unpublished fiction, personal details, or confidential source material. Users should avoid storing full private passages unless they explicitly want those passages saved locally.

For shareable repositories, use redacted summaries and evidence IDs instead of copying source text into `.writers-loop/`.

## What Is Not Collected

Writer's Loop does not collect, transmit, sell, or share user data. It has no background service and no external network dependency.

## User Control

Users can disable durable preference storage by staying in session-only mode. Users can delete `.writers-loop/` at any time to remove locally stored journals and derived preferences.

## Contact

Maintainer: Shen Ren <xxsang@gmail.com>
