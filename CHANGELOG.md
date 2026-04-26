# Changelog

All notable changes to Writer's Loop are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-04-26

### Added
- Core `SKILL.md` with plan → draft → critique → revise loop
- Preference learning from explicit user decisions (opt-in durable storage via `journal.mjs`)
- Style learning workflow to adapt the user's own style or permitted reference styles without copying source facts or passages
- Translation guidance for cross-language writing work that preserves source-language voice, rhythm, imagery, register, and emotional effect
- Multi-agent extension reference for parallelising critique and revision
- Installation support for Claude Code, OpenAI Codex, Cursor, Gemini CLI, GitHub Copilot CLI, and OpenCode
- Plugin manifests for Codex, Claude, and Cursor platforms
- Validation tooling (`validate-skill.mjs`, `scan-secrets.mjs`) with 43+ automated checks
- A/B evaluation framework (`run-evals.mjs`) with 9 scenario fixtures
- CI via GitHub Actions (`validate.yml`) running on every PR and push to main
- Reference files covering artifact types, critique rubrics, checkpoints, preference signals, and validation scenarios
- Long-form user guide (`docs/writers-loop-complete-guide.md`)
- Release-ready public README, privacy policy, security policy, and contribution guidance
- Agent context files for Claude and Gemini (`CLAUDE.md`, `GEMINI.md`)
