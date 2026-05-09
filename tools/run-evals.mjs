#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  RESPONSE_CRITERIA,
  RESPONSE_THRESHOLDS,
  SCENARIOS,
} from "./evals/scenarios.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const skillDir = path.join(repoRoot, "skills", "writers-loop");

function parseArgs(argv) {
  const args = {
    output: path.join(os.tmpdir(), "writers-loop-skill-evals"),
    responses: null,
    abControl: null,
    abTreatment: null,
    scenarios: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--output") {
      args.output = path.resolve(argv[index + 1]);
      index += 1;
    } else if (value === "--responses") {
      args.responses = path.resolve(argv[index + 1]);
      index += 1;
    } else if (value === "--ab-control") {
      args.abControl = path.resolve(argv[index + 1]);
      index += 1;
    } else if (value === "--ab-treatment") {
      args.abTreatment = path.resolve(argv[index + 1]);
      index += 1;
    } else if (value === "--scenario" || value === "--scenarios") {
      args.scenarios = argv[index + 1]
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      index += 1;
    } else if (value === "--help") {
      console.log(`Usage:
  node tools/run-evals.mjs [--output DIR] [--responses responses.json] [--scenario id[,id]]
  node tools/run-evals.mjs --ab-control control.json --ab-treatment treatment.json [--output DIR] [--scenario id[,id]]

Without --responses, scores the skill package documentation for coverage.
With --responses, scores response text by scenario id.
With --ab-control and --ab-treatment, scores paired response sets and reports deltas.`);
      process.exit(0);
    }
  }
  if (args.responses && (args.abControl || args.abTreatment)) {
    throw new Error(
      "Use either --responses or --ab-control/--ab-treatment, not both.",
    );
  }
  if (
    (args.abControl && !args.abTreatment) ||
    (!args.abControl && args.abTreatment)
  ) {
    throw new Error("A/B mode requires both --ab-control and --ab-treatment.");
  }
  if (args.scenarios) {
    const knownIds = new Set(SCENARIOS.map((scenario) => scenario.id));
    const unknown = args.scenarios.filter((id) => !knownIds.has(id));
    if (unknown.length > 0) {
      throw new Error(`Unknown scenario id(s): ${unknown.join(", ")}`);
    }
  }
  return args;
}

function readSkillCorpus() {
  const files = [
    "SKILL.md",
    "references/artifact-types.md",
    "references/business-writing.md",
    "references/checkpoints.md",
    "references/critique-rubrics.md",
    "references/fiction-narrative.md",
    "references/multi-agent.md",
    "references/preference-journal.md",
    "references/preference-signals.md",
    "references/style-distillation.md",
    "references/technical-writing.md",
    "references/translation.md",
    "references/validation-scenarios.md",
  ];
  return files
    .map((file) => readFileSync(path.join(skillDir, file), "utf8"))
    .join("\n\n");
}

function readResponses(filePath) {
  if (!filePath) return null;
  const parsed = JSON.parse(readFileSync(filePath, "utf8"));
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Responses JSON must be an object keyed by scenario id.");
  }
  return parsed;
}

function responseCriteriaFor(scenario) {
  return RESPONSE_CRITERIA[scenario.id]
    ? {
        ...scenario,
        criteria: RESPONSE_CRITERIA[scenario.id],
        threshold: RESPONSE_THRESHOLDS[scenario.id] ?? 7,
      }
    : scenario;
}

function selectScenarios(ids) {
  if (!ids) return SCENARIOS;
  const allowed = new Set(ids);
  return SCENARIOS.filter((scenario) => allowed.has(scenario.id));
}

function scoreResponseSet(responses, scenarios = SCENARIOS) {
  return scenarios.map((scenario) => {
    const text = String(responses[scenario.id] ?? "");
    return scoreScenario(responseCriteriaFor(scenario), text);
  });
}

function summarizeCondition(scenarios) {
  return {
    passed: scenarios.filter((scenario) => scenario.passed).length,
    minimumScore: Math.min(...scenarios.map((scenario) => scenario.score)),
    meanScore:
      scenarios.reduce((total, scenario) => total + scenario.score, 0) /
      scenarios.length,
    scenarios,
  };
}

function validateAbPairs(control, treatment, scenarios = SCENARIOS) {
  const missing = [];
  for (const scenario of scenarios) {
    if (!control[scenario.id] || !treatment[scenario.id]) {
      missing.push(scenario.id);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing A/B response pairs: ${missing.join(", ")}`);
  }
}

function buildAbSummary(
  controlResponses,
  treatmentResponses,
  scenarios = SCENARIOS,
) {
  validateAbPairs(controlResponses, treatmentResponses, scenarios);
  const controlScenarios = scoreResponseSet(controlResponses, scenarios);
  const treatmentScenarios = scoreResponseSet(treatmentResponses, scenarios);
  const deltas = treatmentScenarios.map((treatment, index) => {
    const control = controlScenarios[index];
    return {
      id: treatment.id,
      title: treatment.title,
      controlScore: control.score,
      treatmentScore: treatment.score,
      maxScore: treatment.maxScore,
      delta: treatment.score - control.score,
      controlPassed: control.passed,
      treatmentPassed: treatment.passed,
    };
  });
  const treatmentWins = deltas.filter((delta) => delta.delta > 0).length;
  const controlWins = deltas.filter((delta) => delta.delta < 0).length;
  const ties = deltas.filter((delta) => delta.delta === 0).length;
  const meanDelta =
    deltas.reduce((total, delta) => total + delta.delta, 0) / deltas.length;
  const treatment = summarizeCondition(treatmentScenarios);
  const comparison = {
    treatmentWins,
    controlWins,
    ties,
    meanDelta,
    missingPairCount: 0,
    deltas,
  };

  return {
    generatedAt: new Date().toISOString(),
    mode: "ab-responses",
    totalScenarios: scenarios.length,
    passed:
      treatment.passed === scenarios.length &&
      treatmentWins > controlWins &&
      meanDelta > 0,
    conditions: {
      control: summarizeCondition(controlScenarios),
      treatment,
    },
    comparison,
  };
}

function scoreScenario(scenario, text) {
  const criteria = scenario.criteria.map(([name, pattern, options = {}]) => {
    const matched =
      typeof pattern === "function" ? pattern(text) : pattern.test(text);
    return {
      name,
      passed: options.forbidden ? !matched : matched,
      critical: Boolean(options.critical),
      forbidden: Boolean(options.forbidden),
    };
  });
  const score = criteria.filter((criterion) => criterion.passed).length;
  const threshold = scenario.threshold ?? 7;
  const criticalFailures = criteria.filter(
    (criterion) => criterion.critical && !criterion.passed,
  );
  return {
    id: scenario.id,
    title: scenario.title,
    score,
    maxScore: scenario.criteria.length,
    threshold,
    passed: score >= threshold && criticalFailures.length === 0,
    criticalFailures: criticalFailures.map((criterion) => criterion.name),
    criteria,
  };
}

function renderMarkdown(summary) {
  if (summary.mode === "ab-responses") {
    const lines = [
      "# Writer's Loop Skill A/B Eval Report",
      "",
      `Generated at: ${summary.generatedAt}`,
      `Mode: ${summary.mode}`,
      "",
      `Treatment passed: ${summary.conditions.treatment.passed}/${summary.totalScenarios}`,
      `Control passed: ${summary.conditions.control.passed}/${summary.totalScenarios}`,
      `Treatment wins: ${summary.comparison.treatmentWins}`,
      `Control wins: ${summary.comparison.controlWins}`,
      `Ties: ${summary.comparison.ties}`,
      `Mean delta: ${summary.comparison.meanDelta.toFixed(2)}`,
      "",
      "## Paired Results",
      "",
    ];
    for (const delta of summary.comparison.deltas) {
      lines.push(`### ${delta.title}`);
      lines.push("");
      lines.push(
        `Control: ${delta.controlScore}/${delta.maxScore}; Treatment: ${delta.treatmentScore}/${delta.maxScore}; Delta: ${delta.delta}`,
      );
      lines.push("");
    }
    return lines.join("\n");
  }

  const lines = [
    "# Writer's Loop Skill Eval Report",
    "",
    `Generated at: ${summary.generatedAt}`,
    `Mode: ${summary.mode}`,
    "",
    `Passed: ${summary.passed}/${summary.totalScenarios}`,
    `Minimum score: ${summary.minimumScore}`,
    "",
  ];
  for (const scenario of summary.scenarios) {
    lines.push(`## ${scenario.title}`);
    lines.push("");
    lines.push(`Score: ${scenario.score}/${scenario.maxScore}`);
    lines.push("");
    for (const criterion of scenario.criteria) {
      lines.push(`- ${criterion.passed ? "PASS" : "FAIL"}: ${criterion.name}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

try {
  const args = parseArgs(process.argv.slice(2));
  const selectedScenarios = selectScenarios(args.scenarios);
  const summary = args.abControl
    ? buildAbSummary(
        readResponses(args.abControl),
        readResponses(args.abTreatment),
        selectedScenarios,
      )
    : (() => {
        const responses = readResponses(args.responses);
        const skillCorpus = responses ? null : readSkillCorpus();
        const scenarios = selectedScenarios.map((scenario) => {
          const text = responses
            ? String(responses[scenario.id] ?? "")
            : skillCorpus;
          const scenarioForMode = responses
            ? responseCriteriaFor(scenario)
            : scenario;
          return scoreScenario(scenarioForMode, text);
        });
        return {
          generatedAt: new Date().toISOString(),
          mode: responses ? "responses" : "documentation-coverage",
          totalScenarios: scenarios.length,
          passed: scenarios.filter((scenario) => scenario.passed).length,
          minimumScore: Math.min(
            ...scenarios.map((scenario) => scenario.score),
          ),
          scenarios,
        };
      })();

  mkdirSync(args.output, { recursive: true });
  writeFileSync(
    path.join(args.output, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    path.join(args.output, "report.md"),
    renderMarkdown(summary),
    "utf8",
  );

  if (summary.mode === "ab-responses") {
    console.log(
      `Skill eval summary: treatment=${summary.conditions.treatment.passed}/${summary.totalScenarios}, control=${summary.conditions.control.passed}/${summary.totalScenarios}, meanDelta=${summary.comparison.meanDelta.toFixed(2)}, mode=${summary.mode}`,
    );
    if (!summary.passed) {
      process.exit(1);
    }
  } else {
    console.log(
      `Skill eval summary: passed=${summary.passed}/${summary.totalScenarios}, minimumScore=${summary.minimumScore}, mode=${summary.mode}`,
    );
    if (summary.passed !== summary.totalScenarios) {
      process.exit(1);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
