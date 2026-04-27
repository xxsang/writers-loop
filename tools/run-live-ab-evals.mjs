#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const defaultPromptFile = path.join(repoRoot, "tools", "evals", "ab-prompts.json");
const skillPath = path.join(repoRoot, "skills", "writers-loop", "SKILL.md");

const DEFAULT_MODEL =
  process.env.WRITERS_LOOP_LIVE_MODEL || process.env.CODEX_MODEL || "gpt-5.2";

function safeTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function parseArgs(argv) {
  const args = {
    codexBin: process.env.CODEX_BIN || "codex",
    concurrency: 1,
    dryRun: false,
    localSkillPrefix: true,
    model: DEFAULT_MODEL,
    output: path.join(repoRoot, ".artifacts", "live-ab", safeTimestamp()),
    promptFile: defaultPromptFile,
    resume: false,
    scenarios: null,
    skipScore: false,
    timeoutMs: 600000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--codex-bin") {
      args.codexBin = argv[index + 1];
      index += 1;
    } else if (value === "--concurrency") {
      args.concurrency = Number.parseInt(argv[index + 1], 10);
      index += 1;
    } else if (value === "--dry-run") {
      args.dryRun = true;
    } else if (value === "--model") {
      args.model = argv[index + 1];
      index += 1;
    } else if (value === "--no-local-skill-prefix") {
      args.localSkillPrefix = false;
    } else if (value === "--output") {
      args.output = path.resolve(argv[index + 1]);
      index += 1;
    } else if (value === "--prompt-file") {
      args.promptFile = path.resolve(argv[index + 1]);
      index += 1;
    } else if (value === "--resume") {
      args.resume = true;
    } else if (value === "--scenario" || value === "--scenarios") {
      args.scenarios = argv[index + 1]
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      index += 1;
    } else if (value === "--skip-score") {
      args.skipScore = true;
    } else if (value === "--timeout-ms") {
      args.timeoutMs = Number.parseInt(argv[index + 1], 10);
      index += 1;
    } else if (value === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }

  if (!Number.isInteger(args.concurrency) || args.concurrency < 1) {
    throw new Error("--concurrency must be an integer >= 1.");
  }
  if (!Number.isInteger(args.timeoutMs) || args.timeoutMs < 10000) {
    throw new Error("--timeout-ms must be an integer >= 10000.");
  }
  if (!args.model) {
    throw new Error("--model is required.");
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node tools/run-live-ab-evals.mjs [options]

Generates fresh control and treatment responses for every scenario in
tools/evals/ab-prompts.json by calling codex exec, then scores the pair with
tools/run-evals.mjs.

Options:
  --model MODEL             Codex model to use. Default: ${DEFAULT_MODEL}
  --scenario IDS            Comma-separated scenario ids to run.
  --output DIR              Output directory. Default: .artifacts/live-ab/<timestamp>
  --prompt-file FILE        Prompt pair file. Default: tools/evals/ab-prompts.json
  --codex-bin PATH          Codex CLI binary. Default: codex
  --concurrency N           Parallel live generations. Default: 1
  --timeout-ms N            Per-generation timeout. Default: 600000
  --resume                  Reuse existing last-message files in --output.
  --skip-score              Generate responses but do not run run-evals.mjs.
  --dry-run                 Validate prompts and write the run manifest only.
  --no-local-skill-prefix   Do not prepend the local SKILL.md path to treatment prompts.
  --help                    Show this help.`);
}

function loadPromptPairs(promptFile, selectedIds) {
  const parsed = JSON.parse(readFileSync(promptFile, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Prompt file must be an object keyed by scenario id.");
  }

  const allIds = Object.keys(parsed);
  const ids = selectedIds ?? allIds;
  const unknown = ids.filter((id) => !allIds.includes(id));
  if (unknown.length > 0) {
    throw new Error(`Unknown scenario id(s): ${unknown.join(", ")}`);
  }

  return ids.map((id) => {
    const pair = parsed[id];
    if (
      !pair ||
      typeof pair.control !== "string" ||
      typeof pair.treatment !== "string"
    ) {
      throw new Error(`Scenario ${id} must include control and treatment prompts.`);
    }
    return { id, control: pair.control, treatment: pair.treatment };
  });
}

function treatmentPrompt(rawPrompt, useLocalSkillPrefix) {
  if (!useLocalSkillPrefix) return rawPrompt;
  const relativeSkillPath = path.relative(repoRoot, skillPath);
  return [
    `Use the local Writer's Loop skill at ${relativeSkillPath}.`,
    "Read SKILL.md and any relevant references before answering.",
    "This is a live treatment eval: visibly follow the skill's required output shape.",
    "Do not answer as a bare direct completion when the skill requires Frame, Review, Storage Decision, Learning Status, or checkpoints.",
    "If preserving source formatting, preserve it inside the skill's content section rather than omitting skill metadata.",
    "",
    "User request:",
    rawPrompt,
  ].join("\n");
}

function buildTasks(promptPairs, args) {
  return promptPairs.flatMap((pair) => [
    {
      condition: "control",
      id: pair.id,
      prompt: pair.control,
    },
    {
      condition: "treatment",
      id: pair.id,
      prompt: treatmentPrompt(pair.treatment, args.localSkillPrefix),
    },
  ]);
}

function pathsFor(outputDir, task) {
  return {
    log: path.join(outputDir, "logs", task.condition, `${task.id}.log`),
    prompt: path.join(outputDir, "prompts", task.condition, `${task.id}.txt`),
    response: path.join(outputDir, "responses", task.condition, `${task.id}.txt`),
  };
}

function codexCommand(args, responsePath) {
  return [
    "exec",
    "--model",
    args.model,
    "--ephemeral",
    "--sandbox",
    "read-only",
    "-C",
    repoRoot,
    "--color",
    "never",
    "-o",
    responsePath,
    "-",
  ];
}

function writeManifest(outputDir, args, promptPairs, tasks) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    dryRun: args.dryRun,
    model: args.model,
    codexBin: args.codexBin,
    promptFile: args.promptFile,
    localSkillPrefix: args.localSkillPrefix,
    timeoutMs: args.timeoutMs,
    concurrency: args.concurrency,
    scenarioIds: promptPairs.map((pair) => pair.id),
    totalRuns: tasks.length,
    runs: tasks.map((task) => {
      const taskPaths = pathsFor(outputDir, task);
      return {
        scenario: task.id,
        condition: task.condition,
        promptFile: taskPaths.prompt,
        responseFile: taskPaths.response,
        logFile: taskPaths.log,
        command: [args.codexBin, ...codexCommand(args, taskPaths.response)],
      };
    }),
  };
  writeFileSync(
    path.join(outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
}

function ensureOutputDirs(outputDir) {
  for (const dir of [
    outputDir,
    path.join(outputDir, "logs", "control"),
    path.join(outputDir, "logs", "treatment"),
    path.join(outputDir, "prompts", "control"),
    path.join(outputDir, "prompts", "treatment"),
    path.join(outputDir, "responses", "control"),
    path.join(outputDir, "responses", "treatment"),
  ]) {
    mkdirSync(dir, { recursive: true });
  }
}

function readExistingResponse(responsePath) {
  if (!existsSync(responsePath)) return null;
  const text = readFileSync(responsePath, "utf8");
  return text.trim() ? text : null;
}

function runCodex(task, args, outputDir) {
  const taskPaths = pathsFor(outputDir, task);
  writeFileSync(taskPaths.prompt, task.prompt, "utf8");

  if (args.resume) {
    const existing = readExistingResponse(taskPaths.response);
    if (existing) {
      console.log(`[resume] ${task.condition}/${task.id}`);
      return Promise.resolve({ ...task, text: existing, resumed: true });
    }
  }

  const commandArgs = codexCommand(args, taskPaths.response);
  console.log(`[run] ${task.condition}/${task.id}`);

  return new Promise((resolve, reject) => {
    const child = spawn(args.codexBin, commandArgs, {
      cwd: repoRoot,
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let log = "";
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 5000).unref();
    }, args.timeoutMs);

    child.stdout.on("data", (chunk) => {
      log += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      log += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      writeFileSync(taskPaths.log, log, "utf8");
      reject(error);
    });
    child.on("close", (code, signal) => {
      clearTimeout(timeout);
      writeFileSync(taskPaths.log, log, "utf8");
      if (timedOut) {
        reject(
          new Error(
            `${task.condition}/${task.id} timed out after ${args.timeoutMs}ms.`,
          ),
        );
        return;
      }
      if (code !== 0) {
        reject(
          new Error(
            `${task.condition}/${task.id} failed with code ${code ?? signal}. See ${taskPaths.log}`,
          ),
        );
        return;
      }
      const text = readExistingResponse(taskPaths.response);
      if (!text) {
        reject(
          new Error(
            `${task.condition}/${task.id} did not produce a final response file.`,
          ),
        );
        return;
      }
      resolve({ ...task, text, resumed: false });
    });

    child.stdin.end(task.prompt);
  });
}

async function runWithConcurrency(tasks, args, outputDir) {
  const results = [];
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const task = tasks[next];
      next += 1;
      results.push(await runCodex(task, args, outputDir));
    }
  }

  const workers = Array.from(
    { length: Math.min(args.concurrency, tasks.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

function writeResponseJson(outputDir, promptPairs, results) {
  const byCondition = { control: {}, treatment: {} };
  for (const result of results) {
    byCondition[result.condition][result.id] = result.text;
  }

  for (const condition of ["control", "treatment"]) {
    const missing = promptPairs
      .map((pair) => pair.id)
      .filter((id) => !byCondition[condition][id]);
    if (missing.length > 0) {
      throw new Error(`Missing ${condition} response(s): ${missing.join(", ")}`);
    }
  }

  const controlPath = path.join(outputDir, "responses.control.json");
  const treatmentPath = path.join(outputDir, "responses.treatment.json");
  writeFileSync(
    controlPath,
    `${JSON.stringify(byCondition.control, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    treatmentPath,
    `${JSON.stringify(byCondition.treatment, null, 2)}\n`,
    "utf8",
  );
  return { controlPath, treatmentPath };
}

function scoreResponses(args, outputDir, responsePaths, promptPairs) {
  const scoreOutput = path.join(outputDir, "score");
  const commandArgs = [
    path.join(repoRoot, "tools", "run-evals.mjs"),
    "--ab-control",
    responsePaths.controlPath,
    "--ab-treatment",
    responsePaths.treatmentPath,
    "--output",
    scoreOutput,
    "--scenario",
    promptPairs.map((pair) => pair.id).join(","),
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, commandArgs, {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      writeFileSync(path.join(outputDir, "score.log"), output, "utf8");
      process.stdout.write(output);
      if (code !== 0) {
        reject(new Error(`Live A/B scoring failed. See ${scoreOutput}`));
        return;
      }
      resolve();
    });
  });
}

try {
  const args = parseArgs(process.argv.slice(2));
  const promptPairs = loadPromptPairs(args.promptFile, args.scenarios);
  const tasks = buildTasks(promptPairs, args);
  ensureOutputDirs(args.output);

  for (const task of tasks) {
    writeFileSync(pathsFor(args.output, task).prompt, task.prompt, "utf8");
  }
  writeManifest(args.output, args, promptPairs, tasks);

  if (args.dryRun) {
    console.log(
      `Live A/B dry run wrote manifest for ${promptPairs.length} scenario(s), ${tasks.length} generation(s): ${args.output}`,
    );
    process.exit(0);
  }

  const results = await runWithConcurrency(tasks, args, args.output);
  const responsePaths = writeResponseJson(args.output, promptPairs, results);

  if (!args.skipScore) {
    await scoreResponses(args, args.output, responsePaths, promptPairs);
  }

  console.log(`Live A/B outputs written to ${args.output}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
