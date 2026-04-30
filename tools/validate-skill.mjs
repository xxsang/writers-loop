#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSkillDir = path.resolve(scriptDir, "..", "skills", "writers-loop");
const skillDir = path.resolve(process.argv[2] ?? defaultSkillDir);
const repoRoot = path.resolve(skillDir, "../..");
const expectedSkillName = "writers-loop";

const requiredFiles = [
  "SKILL.md",
  "agents/openai.yaml",
  "references/artifact-types.md",
  "references/checkpoints.md",
  "references/critique-rubrics.md",
  "references/multi-agent.md",
  "references/preference-journal.md",
  "references/preference-signals.md",
  "references/style-distillation.md",
  "references/translation.md",
  "references/validation-scenarios.md",
  "scripts/journal.mjs",
  "scripts/style-pack.mjs",
];

const requiredRepoFiles = [
  "README.md",
  "README_zh.md",
  "README_ja.md",
  "README_es.md",
  "LICENSE",
  "package.json",
  ".gitignore",
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  "CONTRIBUTING.md",
  "PRIVACY.md",
  "RELEASE.md",
  "SECURITY.md",
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  "gemini-extension.json",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/workflows/validate.yml",
  ".opencode/INSTALL.md",
  "assets/writers-loop-overview.svg",
  "docs/demo-transcript.md",
  "tools/evals/ab-prompts.json",
  "tools/evals/control-responses.codex.json",
  "tools/evals/responses.schema.json",
  "tools/evals/skill-loaded-responses.json",
  "tools/evals/treatment-responses.codex.json",
  "tools/run-evals.mjs",
  "tools/run-real-usage-tests.mjs",
  "tools/scan-secrets.mjs",
  "tools/validate-skill.mjs",
];

const requiredLoopTerms = [
  "Frame",
  "Question Gate",
  "Plan Checkpoint",
  "Replan",
  "Draft",
  "Critique",
  "Propose",
  "Decide",
  "Revise",
  "Evaluate",
  "Learn",
  "Distill",
  "Reuse",
];

function read(relativePath) {
  return readFileSync(path.join(skillDir, relativePath), "utf8");
}

function readRepo(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readRepoJson(relativePath) {
  return JSON.parse(readRepo(relativePath));
}

function walkFiles(root, base = root) {
  const entries = readdirSync(root);
  return entries.flatMap((entry) => {
    const absolute = path.join(root, entry);
    const relative = path.relative(base, absolute);
    if (statSync(absolute).isDirectory()) {
      return walkFiles(absolute, base);
    }
    return [relative];
  });
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const result = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^"|"$/g, "");
    result[key] = value;
  }
  return result;
}

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(path.join(skillDir, file))) {
    failures.push(`Missing required file: ${file}`);
  }
}

for (const file of requiredRepoFiles) {
  if (!existsSync(path.join(repoRoot, file))) {
    failures.push(`Missing required repository file: ${file}`);
  }
}

if (existsSync(skillDir)) {
  for (const file of walkFiles(skillDir, skillDir)) {
    if (path.basename(file) === ".DS_Store") {
      failures.push(`Remove macOS metadata file: ${file}`);
    }
    const allowedSkillScripts = new Set([
      "scripts/journal.mjs",
      "scripts/style-pack.mjs",
    ]);
    if (
      file.startsWith("scripts/") &&
      file.endsWith(".mjs") &&
      !allowedSkillScripts.has(file)
    ) {
      failures.push(
        `Only user-facing journal.mjs and style-pack.mjs belong in the installable skill scripts: ${file}`,
      );
    }
  }
}

if (existsSync(path.join(repoRoot, ".artifacts"))) {
  failures.push("Remove generated .artifacts before release.");
}

const skillMarkdown = existsSync(path.join(skillDir, "SKILL.md"))
  ? read("SKILL.md")
  : "";
const frontmatter = parseFrontmatter(skillMarkdown);

if (!frontmatter) {
  failures.push("SKILL.md must start with YAML frontmatter.");
} else {
  if (frontmatter.name !== expectedSkillName) {
    failures.push(`Unexpected skill name: ${frontmatter.name}`);
  }
  if (!frontmatter.description?.startsWith("Use when ")) {
    failures.push('Description must start with "Use when ".');
  }
  if ((frontmatter.description ?? "").length > 500) {
    failures.push("Description should stay under 500 characters.");
  }
}

for (const term of requiredLoopTerms) {
  if (!skillMarkdown.includes(term)) {
    failures.push(`SKILL.md is missing loop term: ${term}`);
  }
}

for (const reference of readdirSync(path.join(skillDir, "references")).filter(
  (file) => file.endsWith(".md"),
)) {
  const referencePath = `references/${reference}`;
  if (!skillMarkdown.includes(referencePath)) {
    failures.push(`SKILL.md does not mention ${referencePath}`);
  }
}

const openaiYaml = existsSync(path.join(skillDir, "agents/openai.yaml"))
  ? read("agents/openai.yaml")
  : "";
if (!openaiYaml.includes("$writers-loop")) {
  failures.push(
    "agents/openai.yaml default_prompt must mention $writers-loop.",
  );
}

if (existsSync(repoRoot)) {
  const allPublicText = walkFiles(repoRoot, repoRoot)
    .filter((file) => {
      const absolute = path.join(repoRoot, file);
      return statSync(absolute).isFile();
    })
    .filter((file) => !file.startsWith(".git/"))
    .filter((file) => !file.startsWith(".artifacts/"))
    .filter((file) => !file.startsWith(".writers-loop/"))
    .filter((file) => file !== "tools/validate-skill.mjs")
    .filter((file) => file !== "tools/scan-secrets.mjs")
    .map((file) => `${file}\n${readFileSync(path.join(repoRoot, file), "utf8")}`)
    .join("\n\n");

  for (const forbidden of [
    "write-critic-revise",
    "Write, Critic, Revise",
    "NovelCreator",
    "YOUR_ORG",
    "OPENROUTER_API_KEY",
    "build-release-tree.mjs",
    "run-live-ab.mjs",
  ]) {
    if (allPublicText.includes(forbidden)) {
      failures.push(`Remove old/private marker from public files: ${forbidden}`);
    }
  }
}

if (existsSync(path.join(repoRoot, "README.md"))) {
  const readme = readRepo("README.md");
  for (const requiredText of [
    "Writer's Loop",
    "pleasure of writing",
    "Claude Code",
    "OpenAI Codex CLI",
    "OpenAI Codex App",
    "Cursor",
    "Gemini CLI",
    "GitHub Copilot CLI",
    "OpenCode",
    ".writers-loop/",
    "https://github.com/xxsang/writers-loop",
    "GitHub-only",
    "PRIVACY.md",
    "RELEASE.md",
    "docs/demo-transcript.md",
    "Using A Learned Style",
    ".writers-loop/styles/",
    "style:save",
    "README_zh.md",
    "README_ja.md",
    "README_es.md",
    "assets/writers-loop-overview.svg",
  ]) {
    if (!readme.includes(requiredText)) {
      failures.push(`README.md must mention: ${requiredText}`);
    }
  }
}

for (const [localizedReadme, requiredTexts] of [
  [
    "README_zh.md",
    [
      "Writer's Loop",
      "只从用户决策中学习",
      "README.md",
      "docs/installation.md",
      "docs/prompt-templates.md",
      "docs/writing-tools.md",
      ".writers-loop/",
      "PRIVACY.md",
    ],
  ],
  [
    "README_ja.md",
    [
      "Writer's Loop",
      "ユーザーの意思決定から学習",
      "README.md",
      "docs/installation.md",
      "docs/prompt-templates.md",
      "docs/writing-tools.md",
      ".writers-loop/",
      "PRIVACY.md",
    ],
  ],
  [
    "README_es.md",
    [
      "Writer's Loop",
      "decisiones del usuario",
      "README.md",
      "docs/installation.md",
      "docs/prompt-templates.md",
      "docs/writing-tools.md",
      ".writers-loop/",
      "PRIVACY.md",
    ],
  ],
]) {
  if (!existsSync(path.join(repoRoot, localizedReadme))) continue;
  const localized = readRepo(localizedReadme);
  for (const requiredText of [
    ...requiredTexts,
    "assets/writers-loop-overview.svg",
  ]) {
    if (!localized.includes(requiredText)) {
      failures.push(`${localizedReadme} must mention: ${requiredText}`);
    }
  }
}

if (existsSync(path.join(repoRoot, "LICENSE"))) {
  const license = readRepo("LICENSE");
  if (!license.includes("MIT License")) {
    failures.push("LICENSE must use MIT License text.");
  }
  if (!license.includes("Copyright (c) 2026 Writer's Loop contributors")) {
    failures.push("LICENSE must credit Writer's Loop contributors.");
  }
}

if (existsSync(path.join(repoRoot, "package.json"))) {
  const packageJson = JSON.parse(readRepo("package.json"));
  if (packageJson.name !== expectedSkillName) {
    failures.push(`package.json name must be ${expectedSkillName}.`);
  }
  if (packageJson.private !== true) {
    failures.push("package.json should be private because distribution is GitHub-only.");
  }
  if (packageJson.dependencies || packageJson.devDependencies) {
    failures.push("Remove package dependencies that are not needed by users.");
  }
  for (const scriptName of [
    "style:init",
    "style:save",
    "style:list",
    "style:show",
    "test:real",
  ]) {
    if (!packageJson.scripts?.[scriptName]) {
      failures.push(`package.json scripts must include ${scriptName}.`);
    }
  }
  if (!String(packageJson.homepage ?? "").includes("github.com/xxsang/writers-loop")) {
    failures.push("package.json homepage must point to xxsang/writers-loop.");
  }
  if (
    !String(packageJson.repository?.url ?? "").includes(
      "github.com/xxsang/writers-loop",
    )
  ) {
    failures.push("package.json repository must point to xxsang/writers-loop.");
  }
}

if (existsSync(path.join(repoRoot, ".codex-plugin/plugin.json"))) {
  const pluginJson = readRepoJson(".codex-plugin/plugin.json");
  if (pluginJson.name !== expectedSkillName) {
    failures.push(`.codex-plugin/plugin.json name must be ${expectedSkillName}.`);
  }
  if (pluginJson.skills !== "./skills/") {
    failures.push('.codex-plugin/plugin.json skills must be "./skills/".');
  }
  if (pluginJson.author?.name !== "Writer's Loop contributors") {
    failures.push(".codex-plugin/plugin.json author.name must be Writer's Loop contributors.");
  }
  if (pluginJson.author?.email !== undefined) {
    failures.push(".codex-plugin/plugin.json author.email must not expose a personal email.");
  }
  if (pluginJson.author?.url !== "https://github.com/xxsang/writers-loop") {
    failures.push(".codex-plugin/plugin.json author.url must point to the repository.");
  }
  if (
    !String(pluginJson.homepage ?? "").includes("github.com/xxsang/writers-loop")
  ) {
    failures.push(".codex-plugin/plugin.json homepage must point to xxsang/writers-loop.");
  }
  if (
    !String(pluginJson.repository ?? "").includes("github.com/xxsang/writers-loop")
  ) {
    failures.push(".codex-plugin/plugin.json repository must point to xxsang/writers-loop.");
  }
  const defaultPrompt = pluginJson.interface?.defaultPrompt;
  if (!Array.isArray(defaultPrompt) || defaultPrompt.length === 0) {
    failures.push(".codex-plugin/plugin.json interface.defaultPrompt is required.");
  } else if (defaultPrompt.length > 3) {
    failures.push(".codex-plugin/plugin.json interface.defaultPrompt must have at most 3 entries.");
  } else {
    for (const prompt of defaultPrompt) {
      if (prompt.length > 128) {
        failures.push(
          ".codex-plugin/plugin.json interface.defaultPrompt entries must be 128 characters or fewer.",
        );
      }
    }
  }
  for (const field of [
    "displayName",
    "shortDescription",
    "longDescription",
    "developerName",
    "category",
    "capabilities",
    "websiteURL",
    "privacyPolicyURL",
    "brandColor",
  ]) {
    if (pluginJson.interface?.[field] === undefined) {
      failures.push(`.codex-plugin/plugin.json interface.${field} is required.`);
    }
  }
  if (
    pluginJson.interface?.privacyPolicyURL !==
    "https://github.com/xxsang/writers-loop/blob/main/PRIVACY.md"
  ) {
    failures.push(".codex-plugin/plugin.json privacyPolicyURL must point to PRIVACY.md.");
  }
}

if (existsSync(path.join(repoRoot, ".gitignore"))) {
  const gitignore = readRepo(".gitignore");
  for (const entry of [".claude/", ".env", ".env.*", "!.env.example"]) {
    if (!gitignore.split("\n").includes(entry)) {
      failures.push(`.gitignore must include ${entry}.`);
    }
  }
}

const validationScenarios = existsSync(
  path.join(skillDir, "references/validation-scenarios.md"),
)
  ? read("references/validation-scenarios.md")
  : "";
const scenarioCount = (validationScenarios.match(/^## Scenario /gm) ?? [])
  .length;
if (scenarioCount < 7) {
  failures.push(
    `Expected at least 7 validation scenarios; found ${scenarioCount}.`,
  );
}

if (failures.length > 0) {
  console.error("Skill validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Skill validation passed: ${skillDir}`);
