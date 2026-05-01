#!/usr/bin/env node
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const styleTool = path.join(repoRoot, "skills", "writers-loop", "scripts", "style-pack.mjs");
const journalTool = path.join(repoRoot, "skills", "writers-loop", "scripts", "journal.mjs");
const evalTool = path.join(repoRoot, "tools", "run-evals.mjs");
const liveEvalTool = path.join(repoRoot, "tools", "run-live-ab-evals.mjs");
const projectDir = mkdtempSync(path.join(os.tmpdir(), "writers-loop-real-"));

function run(args, options = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: node ${args.join(" ")}\n${result.stderr}${result.stdout}`);
  }
  return result.stdout.trim();
}

function runFailure(args, expectedMessage, options = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
  });
  if (result.status === 0) {
    throw new Error(`Command should have failed: node ${args.join(" ")}`);
  }
  const output = `${result.stderr}${result.stdout}`;
  if (!expectedMessage.test(output)) {
    throw new Error(`Failure did not match ${expectedMessage}: ${output}`);
  }
  return output.trim();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const packSource = path.join(projectDir, "reviewed-style-pack.md");
writeFileSync(
  packSource,
  [
    "Summary:",
    "Use compact paragraphs, direct openings, visible tradeoffs, and restrained transitions.",
    "",
    "Observable Traits:",
    "- Leads with the decision before background.",
    "- Uses concrete verbs and low-ceremony section labels.",
    "",
    "Do:",
    "- Start with the point.",
    "- Name the tradeoff.",
    "",
    "Avoid:",
    "- Do not copy source facts or passages.",
    "",
    "Reusable Prompts:",
    "- Drafting: write in the lean notes style while preserving current-task facts.",
  ].join("\n"),
  "utf8",
);

const rawSource = path.join(projectDir, "raw-source.md");
writeFileSync(
  rawSource,
  [
    "# Raw Draft",
    "",
    "We keep the main path short. Start with the decision, then name the tradeoff.",
    "If a reader needs background, give it after the recommendation.",
  ].join("\n"),
  "utf8",
);

run([styleTool, "init", projectDir]);
assert(existsSync(path.join(projectDir, ".writers-loop", "styles")), "styles directory was not created");

run([styleTool, "save", projectDir, "Lean Notes", packSource]);
const savedStyle = path.join(projectDir, ".writers-loop", "styles", "lean-notes.md");
assert(existsSync(savedStyle), "style pack was not saved");
const savedText = readFileSync(savedStyle, "utf8");
assert(savedText.includes("# Style Pack: Lean Notes"), "saved style pack is missing title");
assert(savedText.includes("Do not copy source facts or passages"), "saved style pack is missing source-copying guardrail");

run([styleTool, "save", projectDir, "Relative Source", "reviewed-style-pack.md"]);
const relativeStyle = path.join(projectDir, ".writers-loop", "styles", "relative-source.md");
assert(existsSync(relativeStyle), "style:save did not resolve relative source paths from project dir");

runFailure([styleTool, "save", projectDir, "Raw Source", rawSource], /does not look reviewed/);
const rawStyle = path.join(projectDir, ".writers-loop", "styles", "raw-source.md");
assert(!existsSync(rawStyle), "style:save saved raw source without --force");
run([styleTool, "save", "--force", projectDir, "Raw Source", rawSource]);
assert(existsSync(rawStyle), "style:save --force did not save explicitly reviewed source");

const listOutput = run([styleTool, "list", projectDir]);
assert(listOutput.includes("lean-notes"), "style:list did not include saved style pack");

const showOutput = run([styleTool, "show", projectDir, "Lean Notes"]);
assert(showOutput.includes("Style Pack: Lean Notes"), "style:show did not print saved style pack");

run([styleTool, "save", "Default Cwd", packSource], { cwd: projectDir });
const defaultCwdStyle = path.join(projectDir, ".writers-loop", "styles", "default-cwd.md");
assert(existsSync(defaultCwdStyle), "style:save did not support default current directory");
const defaultListOutput = run([styleTool, "list"], { cwd: projectDir });
assert(defaultListOutput.includes("default-cwd"), "style:list did not support default current directory");
const defaultShowOutput = run([styleTool, "show", "Default Cwd"], { cwd: projectDir });
assert(
  defaultShowOutput.includes("Style Pack: Default Cwd"),
  "style:show did not support default current directory",
);

run([journalTool, "init", projectDir]);
run([
  journalTool,
  "append",
  projectDir,
  JSON.stringify({
    type: "preference_declared",
    signal: "positive",
    artifact: "documentation",
    stage: "drafting",
    appliesTo: "documentation/drafting",
    summary: "User declared a standing preference for direct openings.",
    payload: { preference: "Lead with the main point before background" },
  }),
]);
run([
  journalTool,
  "append",
  projectDir,
  JSON.stringify({
    type: "question_skipped",
    signal: "neutral",
    artifact: "email",
    stage: "planning",
    scope: "email/planning",
    summary: "User skipped questions",
  }),
]);
run([
  journalTool,
  "append",
  projectDir,
  JSON.stringify({
    type: "question_skipped",
    signal: "neutral",
    artifact: "email",
    stage: "planning",
    scope: "email/planning",
    summary: "User skipped questions",
  }),
]);
run([journalTool, "derive", projectDir]);
assert(existsSync(path.join(projectDir, ".writers-loop", "journal.jsonl")), "journal was not created");
assert(existsSync(path.join(projectDir, ".writers-loop", "prefs.md")), "derived prefs were not created");
const prefsText = readFileSync(path.join(projectDir, ".writers-loop", "prefs.md"), "utf8");
assert(
  prefsText.includes("Lead with the main point before background"),
  "journal did not derive explicit standing preference",
);
assert(
  prefsText.includes("## documentation/drafting"),
  "journal did not derive preferences under appliesTo scope",
);
assert(
  !prefsText.includes("User skipped questions"),
  "journal promoted skipped questions into derived preferences",
);
assert(existsSync(savedStyle), "journal operations removed saved style pack");

const skillText = readFileSync(path.join(repoRoot, "skills", "writers-loop", "SKILL.md"), "utf8");
assert(skillText.includes("Using a learned style"), "SKILL.md does not document using a learned style");
assert(skillText.includes("Style Pack"), "SKILL.md does not mention style packs");

const readme = readFileSync(path.join(repoRoot, "README.md"), "utf8");
assert(readme.includes("Using A Learned Style"), "README does not document using a learned style");
assert(readme.includes(".writers-loop/styles/"), "README does not document style storage path");

const evalCoverageDir = path.join(projectDir, "missing-scenario-coverage");
run([
  evalTool,
  "--scenario",
  "optional-multi-agent,local-style-pack-storage",
  "--output",
  evalCoverageDir,
]);

const liveEvalDir = path.join(projectDir, "live-ab-dry-run");
run([
  liveEvalTool,
  "--dry-run",
  "--scenario",
  "coding-plan,translation",
  "--output",
  liveEvalDir,
]);
const liveManifestPath = path.join(liveEvalDir, "manifest.json");
assert(existsSync(liveManifestPath), "live A/B dry run did not write manifest");
const liveManifest = JSON.parse(readFileSync(liveManifestPath, "utf8"));
assert(liveManifest.totalRuns === 4, "live A/B dry run did not plan control and treatment for each scenario");
assert(
  liveManifest.scenarioIds.includes("coding-plan") &&
    liveManifest.scenarioIds.includes("translation"),
  "live A/B dry run did not include selected scenarios",
);
assert(
  existsSync(path.join(liveEvalDir, "prompts", "treatment", "coding-plan.txt")),
  "live A/B dry run did not write treatment prompt file",
);

console.log(`Real usage tests passed: ${projectDir}`);
