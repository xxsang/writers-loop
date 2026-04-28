# Writing Tool Integrations

Writer's Loop does not need a plugin to be useful in writing tools. This repo
ships copy-ready instructions and templates that work with tools that can hold
project instructions, reference files, Markdown pages, or AI-accessible docs.

Support levels here are conservative:

- **Native instruction workspace**: the tool has project instructions and files.
- **AI-connected workspace**: the tool can be used by an AI assistant through an
  official connector, MCP server, or CLI.
- **Template workspace**: the tool can host Writer's Loop templates, but the AI
  work happens in a connected assistant or by copy/paste.

## Supported Tools

| Tool | Support level | What users get | Integration files |
| --- | --- | --- | --- |
| ChatGPT Projects / GPTs | Native instruction workspace | Project/GPT instructions plus uploaded Writer's Loop reference files | `integrations/chatgpt/project-instructions.md` |
| Claude Projects | Native instruction workspace | Project instructions plus project knowledge files | `integrations/claude/project-instructions.md` |
| Obsidian | Template workspace | Local Markdown templates for briefs, critique, and style packs | `integrations/obsidian/templates/` |
| Notion | AI-connected workspace | A page template that works with Notion AI or Notion MCP | `integrations/notion/writers-loop-page-template.md` |
| Feishu / Lark Docs | AI-connected workspace | A doc template usable manually or through Feishu CLI's document skill | `integrations/feishu/writers-loop-doc-template.md` |
| Logseq | Template workspace | An outliner template for Frame, Plan, Decisions, and Revision | `integrations/logseq/templates/writers-loop.md` |

## ChatGPT Projects Or GPTs

Use this when you want Writer's Loop to stay available across repeated writing
sessions in ChatGPT.

1. Create a ChatGPT Project or GPT.
2. Paste `integrations/chatgpt/project-instructions.md` into project/GPT
   instructions.
3. Add these files as project files or GPT knowledge:
   - `skills/writers-loop/SKILL.md`
   - `skills/writers-loop/references/artifact-types.md`
   - `skills/writers-loop/references/critique-rubrics.md`
   - `skills/writers-loop/references/checkpoints.md`
   - `skills/writers-loop/references/style-distillation.md`
   - `skills/writers-loop/references/translation.md`
   - `docs/prompt-templates.md`
4. Start with:

```text
Use Writer's Loop for this writing task.

Artifact:
Audience:
Goal:
Constraints:
Source material:
```

Official references: [ChatGPT Projects](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt),
[creating and editing GPTs](https://help.openai.com/en/articles/8843948-knowledge-in-gpts).

## Claude Projects

Use this when you want a Claude workspace dedicated to one book, report,
publication workflow, client, research project, or content system.

1. Create a Claude Project.
2. Paste `integrations/claude/project-instructions.md` into project
   instructions.
3. Add the same Writer's Loop files listed above to project knowledge.
4. Ask Claude to use Writer's Loop and stop at plan or proposal checkpoints.

Official references: [Claude Projects](https://support.anthropic.com/en/articles/9517075-what-are-projects),
[creating and managing Claude Projects](https://support.anthropic.com/en/articles/9519177-how-can-i-create-and-manage-projects).

## Obsidian

Use this when you want a local writing vault with explicit decision records.
Obsidian does not run Writer's Loop as a native skill. The support here is
template-based and local-first.

1. Copy `integrations/obsidian/templates/` into your Obsidian template folder.
2. Enable the Obsidian **Templates** core plugin.
3. Create a note for each writing artifact.
4. Insert `writers-loop-brief.md` before asking an AI assistant for help.
5. Use `critique-and-revision.md` to record accepted, rejected, and adjusted
   changes.
6. Use `style-pack.md` only after the source style pack has been reviewed.

Official references: [Obsidian Templates](https://help.obsidian.md/Plugins/Templates),
[Obsidian URI](https://help.obsidian.md/uri), [Obsidian community plugins](https://help.obsidian.md/community-plugins).

## Notion

Use this when the writing artifact already lives in Notion or when a team uses
Notion AI/MCP as its writing surface.

1. Create a Notion page.
2. Paste `integrations/notion/writers-loop-page-template.md`.
3. Fill in Frame, Source Material, and Constraints.
4. Use Notion AI or an external assistant connected through Notion MCP to draft
   from the page.
5. Keep decisions in the Decision Log section before deriving preferences.

Official references: [Notion AI for docs](https://www.notion.com/help/guides/notion-ai-for-docs),
[Notion MCP](https://www.notion.com/help/notion-mcp), [Notion AI Connectors](https://www.notion.com/help/notion-ai-connectors).

## Feishu / Lark Docs

Use this when a team writes in Feishu/Lark Docs and wants an AI agent to create
or update Writer's Loop documents.

Manual path:

1. Create a new Feishu/Lark doc.
2. Paste `integrations/feishu/writers-loop-doc-template.md`.
3. Fill in the Frame and Decision Log.
4. Ask the team's AI assistant to draft, critique, and revise from that doc.

Agent path:

1. Install the official Feishu/Lark CLI and AI agent skills.
2. Authenticate with least-privilege scopes.
3. Use the CLI document skill to create or update docs from Markdown.

Example:

```bash
npm install -g @larksuite/cli
npx skills add larksuite/cli -y -g
lark-cli config init
lark-cli auth login --recommend
lark-cli docs +create --title "Writer's Loop Brief" --markdown "$(cat integrations/feishu/writers-loop-doc-template.md)"
```

Official reference: [Feishu/Lark CLI](https://feishu-cli.com/).

## Logseq

Use this when you want an outliner-based decision log. Logseq does not run
Writer's Loop as a native skill. The support here is a reusable block template.

1. Copy `integrations/logseq/templates/writers-loop.md` into a Logseq page.
2. Keep the `template:: writers-loop` block.
3. Insert it with Logseq's template workflow when starting a writing artifact.
4. Paste the filled brief into ChatGPT, Claude, Codex, or another AI assistant.
5. Bring accepted/rejected decisions back into the Logseq note.

Official reference: [Logseq documentation repository](https://github.com/logseq/docs).

## What This Is Not

- Not an Obsidian, Notion, Feishu, or Logseq plugin.
- Not automatic scraping of private drafts.
- Not native skill support where the tool does not provide it.
- Not durable preference storage unless the user explicitly opts in.
