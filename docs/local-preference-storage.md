# Local Preference Storage

Writer's Loop works without memory. By default, preference learning is
session-only.

If users want styles, decisions, or learned preferences to persist across
sessions, they can opt into local filesystem storage. The bundled tools write
only inside the selected project:

```text
.writers-loop/
|-- journal.jsonl
|-- prefs.md
`-- styles/
    `-- my-style.md
```

## Initialize Storage

```bash
npm run journal:init -- /path/to/project
```

## Append A Decision Event

```bash
npm run journal:append -- /path/to/project '{"type":"plan_approved","signal":"positive","artifact":"coding-plan","stage":"planning","appliesTo":"coding-plan/planning","summary":"User approved plans with exact verification commands.","payload":{"preference":"Use exact verification commands in implementation plans"}}'
```

## Derive Reusable Preferences

```bash
npm run journal:derive -- /path/to/project
```

## Initialize Style-Pack Storage

```bash
npm run style:init -- /path/to/project
```

## Save A Reviewed Style Pack

```bash
npm run style:save -- /path/to/project my-style /path/to/reviewed-style-pack.md
```

`style:save` rejects files that look like raw source samples. Use `--force` only
after a style pack has been explicitly reviewed and approved:

```bash
npm run style:save -- --force /path/to/project my-style /path/to/reviewed-style-pack.md
```

## List And Inspect Saved Style Packs

```bash
npm run style:list -- /path/to/project
npm run style:show -- /path/to/project my-style
```

## Agent Prompt For Local Storage

```text
Use $writers-loop. Keep preference learning project-local. Store only reviewed decisions in .writers-loop/journal.jsonl, derive reusable preferences into .writers-loop/prefs.md, and do not save private source text unless I explicitly approve it.
```

## Privacy Rules

- Do not create `.writers-loop/` unless the user opts in.
- Do not commit `.writers-loop/` to public repositories.
- Prefer redacted summaries over full private passages.
- Save only reviewed style packs to `.writers-loop/styles/`, not raw source samples.
- Treat session-only storage as a current-task constraint, not a durable preference.

See [PRIVACY.md](../PRIVACY.md) for the full privacy policy.
