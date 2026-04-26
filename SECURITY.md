# Security Policy

Writer's Loop stores durable preferences only when a user explicitly opts in.

## Sensitive Data

Local journals may contain draft text, business context, private style preferences, or excerpts from user documents. Do not commit `.writers-loop/` directories. The repository `.gitignore` excludes them by default.

## Reporting Issues

Open a private security advisory or contact Shen Ren before disclosing issues that could expose local preference files or user writing data.

## Supported Version

Until the first public release, only the main branch is supported.
