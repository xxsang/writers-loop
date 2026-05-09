#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  RESPONSE_CRITERIA,
  RESPONSE_THRESHOLDS,
  SCENARIOS,
  SCENARIO_IDS,
} from "./evals/scenarios.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(scriptDir, "..");

const promptFile = "tools/evals/ab-prompts.json";
const schemaFile = "tools/evals/responses.schema.json";
const responseFiles = [
  "tools/evals/control-responses.codex.json",
  "tools/evals/skill-loaded-responses.json",
  "tools/evals/treatment-responses.codex.json",
];

function readJson(repoRoot, relativePath) {
  return JSON.parse(readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function sameOrder(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function scenarioMetadataFailures() {
  const failures = [];
  const seen = new Set();
  for (const scenario of SCENARIOS) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scenario.id)) {
      failures.push(`Invalid scenario id: ${scenario.id}`);
    }
    if (seen.has(scenario.id)) {
      failures.push(`Duplicate scenario id: ${scenario.id}`);
    }
    seen.add(scenario.id);
    if (!scenario.title || typeof scenario.title !== "string") {
      failures.push(`Scenario ${scenario.id} must have a title.`);
    }
    if (!Array.isArray(scenario.criteria) || scenario.criteria.length === 0) {
      failures.push(`Scenario ${scenario.id} must have documentation criteria.`);
    }
  }
  for (const id of Object.keys(RESPONSE_CRITERIA)) {
    if (!SCENARIO_IDS.includes(id)) {
      failures.push(`Response criteria has unknown scenario id: ${id}`);
    }
  }
  for (const id of Object.keys(RESPONSE_THRESHOLDS)) {
    if (!SCENARIO_IDS.includes(id)) {
      failures.push(`Response threshold has unknown scenario id: ${id}`);
    }
    const threshold = RESPONSE_THRESHOLDS[id];
    const maxScore = RESPONSE_CRITERIA[id]?.length ?? 0;
    if (!Number.isInteger(threshold) || threshold < 1) {
      failures.push(`Response threshold for ${id} must be a positive integer.`);
    } else if (maxScore > 0 && threshold > maxScore) {
      failures.push(`Response threshold for ${id} exceeds criteria count.`);
    }
  }
  return failures;
}

export function validateScenarioRegistry(repoRoot = defaultRepoRoot) {
  const failures = scenarioMetadataFailures();

  if (!existsSync(path.join(repoRoot, schemaFile))) {
    failures.push(`Missing scenario schema file: ${schemaFile}`);
    return failures;
  }

  const schema = readJson(repoRoot, schemaFile);
  const prompts = existsSync(path.join(repoRoot, promptFile))
    ? readJson(repoRoot, promptFile)
    : {};

  if (!sameOrder(schema.required ?? [], SCENARIO_IDS)) {
    failures.push(`${schemaFile} required ids must match scenarios.mjs order.`);
  }
  if (!sameOrder(Object.keys(prompts), SCENARIO_IDS)) {
    failures.push(`${promptFile} ids must match scenarios.mjs order.`);
  }

  for (const id of SCENARIO_IDS) {
    if (!schema.properties?.[id]) {
      failures.push(`${schemaFile} must define property: ${id}`);
    }
    if (!prompts[id]) {
      failures.push(`${promptFile} must include scenario id: ${id}`);
    } else if (
      typeof prompts[id].control !== "string" ||
      typeof prompts[id].treatment !== "string"
    ) {
      failures.push(`${promptFile} scenario must include control and treatment strings: ${id}`);
    }
  }

  for (const id of Object.keys(schema.properties ?? {})) {
    if (!SCENARIO_IDS.includes(id)) {
      failures.push(`${schemaFile} has unexpected property: ${id}`);
    }
  }
  for (const id of Object.keys(prompts)) {
    if (!SCENARIO_IDS.includes(id)) {
      failures.push(`${promptFile} has unexpected scenario id: ${id}`);
    }
  }

  for (const responseFile of responseFiles) {
    if (!existsSync(path.join(repoRoot, responseFile))) {
      failures.push(`Missing response fixture: ${responseFile}`);
      continue;
    }
    const responses = readJson(repoRoot, responseFile);
    if (!sameOrder(Object.keys(responses), SCENARIO_IDS)) {
      failures.push(`${responseFile} ids must match scenarios.mjs order.`);
    }
    for (const id of SCENARIO_IDS) {
      if (!(id in responses)) {
        failures.push(`${responseFile} must include response id: ${id}`);
      } else if (typeof responses[id] !== "string") {
        failures.push(`${responseFile} response must be a string: ${id}`);
      }
    }
    for (const id of Object.keys(responses)) {
      if (!SCENARIO_IDS.includes(id)) {
        failures.push(`${responseFile} has unexpected response id: ${id}`);
      }
    }
  }

  return failures;
}

export function formatScenarioList() {
  return SCENARIOS.map((scenario) => {
    const responseCriteria = RESPONSE_CRITERIA[scenario.id]?.length ?? 0;
    const threshold = RESPONSE_THRESHOLDS[scenario.id] ?? 7;
    return [
      scenario.id,
      scenario.title,
      `doc=${scenario.criteria.length}`,
      `response=${responseCriteria}`,
      `threshold=${threshold}`,
    ].join("\t");
  }).join("\n");
}

function parseArgs(argv) {
  const args = { check: false, list: false, repoRoot: defaultRepoRoot };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--check") {
      args.check = true;
    } else if (value === "--list") {
      args.list = true;
    } else if (value === "--repo-root") {
      args.repoRoot = path.resolve(argv[index + 1]);
      index += 1;
    } else if (value === "--help") {
      console.log(`Usage:
  node tools/check-scenarios.mjs --check [--repo-root DIR]
  node tools/check-scenarios.mjs --list`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }
  if (!args.check && !args.list) {
    args.check = true;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.list) {
    console.log(formatScenarioList());
  }
  if (args.check) {
    const failures = validateScenarioRegistry(args.repoRoot);
    if (failures.length > 0) {
      console.error("Scenario registry check failed:");
      for (const failure of failures) {
        console.error(`- ${failure}`);
      }
      process.exit(1);
    }
    console.log(`Scenario registry check passed: ${SCENARIO_IDS.length}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
