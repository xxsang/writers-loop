#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const skillDir = path.join(repoRoot, "skills", "writers-loop");

const SCENARIOS = [
  {
    id: "coding-plan",
    title: "Coding Plan",
    criteria: [
      [
        "frames goal and constraints",
        /Frame[\s\S]*artifact type|goal, constraints/i,
      ],
      [
        "uses coding-plan adaptation",
        /Coding Plan[\s\S]*affected files|Coding Plan[\s\S]*test/i,
      ],
      [
        "requires concrete plan",
        /concrete plan|concrete.*implementation|exact file paths/i,
      ],
      [
        "critiques testability",
        /testability|tests and verification|verification commands/i,
      ],
      ["covers rollout risk", /risks|rollout|migration/i],
      [
        "uses decision-based learning",
        /do not learn from raw drafts|decisions, not raw drafts/i,
      ],
      ["has validation command", /validate-skill\.mjs/i],
      [
        "has public release packaging",
        /plugin manifests|package\.json|public release files/i,
      ],
    ],
  },
  {
    id: "executive-report",
    title: "Executive Report",
    criteria: [
      [
        "frames audience and decision",
        /audience|decision to support|desired action/i,
      ],
      [
        "has report plan shape",
        /Executive summary[\s\S]*Context[\s\S]*Findings/i,
      ],
      ["requires recommendation", /Recommendation/i],
      [
        "checks evidence quality",
        /Evidence quality|evidence gaps|evidence strong/i,
      ],
      ["checks tradeoffs", /Tradeoff|tradeoffs/i],
      ["checks next steps", /Next steps/i],
      ["avoids wrong rubric", /artifact-specific rubric|report rubric/i],
      [
        "keeps preferences scoped",
        /report\/planning|Artifact-specific rules beat global rules/i,
      ],
    ],
  },
  {
    id: "fiction-chapter",
    title: "Fiction Chapter",
    criteria: [
      ["frames genre and tone", /Genre|tone|emotional target/i],
      ["checks POV", /POV|perspective/i],
      ["checks continuity", /continuity|Continuity/i],
      ["uses fiction rubric", /Fiction Rubric|character motivation|pacing/i],
      [
        "prefers local revisions",
        /targeted revisions|local edits|broad rewrites/i,
      ],
      [
        "guards against global tone rule",
        /single accepted edit|global rule|scope is unclear/i,
      ],
      [
        "covers scene specificity",
        /scene specificity|scene sequence|scene has a purpose/i,
      ],
      ["preserves user intent", /preserve user intent|declared constraints/i],
    ],
  },
  {
    id: "preference-conflict",
    title: "Preference Conflict",
    criteria: [
      [
        "explicit instruction wins",
        /Explicit user instruction beats inferred preference/i,
      ],
      ["recent evidence wins", /Recent repeated evidence beats old evidence/i],
      ["scoped rules win", /Artifact-specific rules beat global rules/i],
      ["asks on low confidence", /Ask before applying|low confidence/i],
      [
        "does not archive without evidence",
        /Discard or archive[\s\S]*Newer evidence contradicts/i,
      ],
      ["tracks conflicts", /Conflict Rules|Conflict Handling/i],
      [
        "uses task constraints",
        /conflict with explicit task constraints|current task requirement/i,
      ],
      [
        "supports detailed override",
        /detailed research memo|Preference Conflict/i,
      ],
    ],
  },
  {
    id: "no-learning-evidence",
    title: "No Learning Evidence",
    criteria: [
      [
        "unreviewed drafts are non-signals",
        /Unreviewed drafts|unreviewed output/i,
      ],
      [
        "generated text alone is non-signal",
        /Model-generated text that was never reviewed/i,
      ],
      [
        "states missing evidence",
        /state what evidence is missing|evidence is still missing/i,
      ],
      ["supports skipped questions", /question_skipped|skip questions/i],
      [
        "skipped questions are weak",
        /skipped questions as weak|weak or neutral signals/i,
      ],
      [
        "does not promote one-off comments",
        /One-off style comments|appears once/i,
      ],
      ["requires decisions", /accepted, rejected, revised|review decisions/i],
      ["validates scenario", /No Learning Evidence/i],
    ],
  },
  {
    id: "rejected-plan",
    title: "Rejected Plan",
    criteria: [
      ["has plan checkpoint", /PLAN CHECKPOINT|Plan Checkpoint/i],
      [
        "blocks drafting before approval",
        /Do not draft before approval|No draft before approval|before approval/i,
      ],
      ["records rejection", /plan_revision_requested/i],
      [
        "revises criticized elements",
        /Revise only the criticized|criticized elements/i,
      ],
      ["reissues full plan", /reissue the complete plan|reissue.*full plan/i],
      ["asks again", /ask again|checkpoint/i],
      [
        "does not learn rejected structure",
        /Treating a single accepted edit|rejected structure/i,
      ],
      ["validates scenario", /Rejected Plan/i],
    ],
  },
  {
    id: "durable-storage",
    title: "Durable Storage Opt-In",
    criteria: [
      ["defaults session-only", /Default to `session-only`|session-only/i],
      [
        "does not write without opt-in",
        /Do not create or update these files unless|do not write files/i,
      ],
      ["supports project-local", /project-local/i],
      ["supports portable redaction", /portable|redacted summaries/i],
      [
        "warns about privacy",
        /sensitive draft text|private preferences|privacy/i,
      ],
      ["has journal init", /journal\.mjs init/i],
      ["has derive command", /journal\.mjs derive/i],
      ["validates scenario", /Durable Storage Opt-In/i],
    ],
  },
  {
    id: "style-distillation",
    title: "Style Distillation",
    criteria: [
      [
        "has style distillation reference",
        /references\/style-distillation\.md/i,
      ],
      [
        "separates style from content",
        /Separate style from content|Style Versus Content/i,
      ],
      [
        "avoids copying facts",
        /Do not extract[\s\S]*plot events|copying source content facts/i,
      ],
      [
        "defines style pack",
        /Style Pack[\s\S]*Observable Traits[\s\S]*Reusable Prompts/i,
      ],
      ["handles codebase prose", /codebase prose|README\.md|docs\//i],
      [
        "uses confidence levels",
        /Confidence[\s\S]*high[\s\S]*medium[\s\S]*low/i,
      ],
      ["applies via main loop", /Applying A Style Pack|add it to `Frame`/i],
      ["validates scenario", /Style Distillation/i],
    ],
  },
  {
    id: "translation",
    title: "Translation",
    criteria: [
      ["has translation reference", /references\/translation\.md/i],
      [
        "frames language and locale",
        /source language, target language, locale|Target language and locale/i,
      ],
      [
        "defines translation modes",
        /literal[\s\S]*natural[\s\S]*localized[\s\S]*parallel/i,
      ],
      [
        "preserves technical tokens",
        /code blocks[\s\S]*file paths[\s\S]*CLI commands|Translating code, commands/i,
      ],
      ["uses glossary", /Glossary[\s\S]*Source term[\s\S]*Translation/i],
      [
        "reviews fidelity and style",
        /meaning fidelity[\s\S]*tone preservation[\s\S]*voice preservation/i,
      ],
      [
        "connects to style distillation",
        /style-distillation\.md[\s\S]*style pack/i,
      ],
      ["validates scenario", /Translation/i],
    ],
  },
];

const RESPONSE_CRITERIA = {
  "coding-plan": [
    [
      "frames artifact and constraints",
      /Frame[\s\S]*(Artifact|Audience)[\s\S]*(Goal|Constraints|Success criteria)/i,
    ],
    [
      "uses question gate or assumptions",
      /Question Gate|QUESTION GATE|Assumptions/i,
    ],
    [
      "provides concrete implementation steps",
      /Plan[\s\S]*(OAuth|callback|token|session|account-link|account link)/i,
    ],
    [
      "includes test and verification coverage",
      /Tests and Verification|Tests|Verification|Unit:|Integration:|Security checks/i,
    ],
    [
      "covers rollout or migration risk",
      /rollout|migration|feature flag|rollback|risk/i,
    ],
    ["stops at plan checkpoint", /PLAN CHECKPOINT/i],
    [
      "names concrete ownership areas",
      /File Map|routes\/auth|services\/oauth|db\/migrations|affected files|file paths/i,
    ],
    [
      "does not claim learned preferences without decisions",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
  ],
  "executive-report": [
    [
      "frames audience and decision",
      /Frame[\s\S]*(Audience|Leadership|Executive team)[\s\S]*(Goal|decision|Success criteria)/i,
    ],
    [
      "uses report structure",
      /Executive Summary[\s\S]*(Context|Findings)[\s\S]*(Recommendation|Risks)[\s\S]*Next Steps/i,
    ],
    [
      "recommendation is visible",
      /Recommendation[\s\S]*(onboarding|SMB|retention|churn)/i,
    ],
    [
      "checks evidence gaps",
      /caveat|causality|limited|evidence|cohort|root cause/i,
    ],
    ["checks risks or tradeoffs", /Risks|Tradeoffs|lag|uncertainty/i],
    [
      "includes concrete next steps",
      /Next Steps[\s\S]*(owners|metrics|weekly|30-day|sprint)/i,
    ],
    ["stops at plan checkpoint", /PLAN CHECKPOINT/i],
    [
      "does not claim learned preferences without decisions",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
  ],
  "fiction-chapter": [
    [
      "frames fiction revision",
      /Frame[\s\S]*(Fiction chapter|chapter opening revision|Artifact)/i,
    ],
    ["frames genre and tone", /Genre and tone|quiet suspense|quieter|tense/i],
    ["checks POV", /POV/i],
    ["checks continuity", /continuity/i],
    [
      "asks for missing draft before rewriting",
      /QUESTION GATE|paste the actual opening|source text/i,
    ],
    [
      "preserves user intent",
      /preserving story intent|preserve.*voice|preserve.*intent|preserve.*plot/i,
    ],
    [
      "does not rewrite without source",
      (text) => !/Revision:|Revised opening:|Here is the revised/i.test(text),
    ],
    [
      "does not claim learned preferences without decisions",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
  ],
  "preference-conflict": [
    [
      "explicit instruction wins",
      /Explicit user instruction beats inferred preference|current (explicit )?(request|instruction)[\s\S]*overrides|prioritize.*detailed|explicit.*request/i,
    ],
    [
      "prior preference remains scoped",
      /prior.*concise|earlier concise|concise-report preference.*scoped|not a permanent preference|current-task constraint/i,
    ],
    [
      "does not apply global brevity",
      /concise.*not applied|overrides[\s\S]*concise|differs from.*concision|detailed research memo|not a permanent preference/i,
    ],
    [
      "plans or asks for detailed memo context",
      /memo topic|decision to support|decision or topic|all caveats|full caveats|detailed format|detailed memo|primary audience|deadline and target length/i,
    ],
    [
      "asks on low confidence",
      /QUESTION GATE|need these answers|share the topic|ask before applying|low confidence/i,
    ],
    [
      "does not archive old preference without evidence",
      (text) => !/archive.*old preference/i.test(text),
    ],
    [
      "does not promote one task into durable preference",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
    [
      "keeps current task constraint controlling",
      /current instruction|current-task|current task|current task requirement|for this task/i,
    ],
  ],
  "no-learning-evidence": [
    [
      "honors no-questions instruction",
      /No questions|skip questions|asked to skip questions|proceed without questions|No need/i,
    ],
    ["states assumptions", /Assumptions:|ASSUMPTIONS/i],
    [
      "produces plan and draft or direct draft",
      /Plan[\s\S]*Draft|Draft[\s\S]*Subject:/i,
    ],
    ["or stops at plan checkpoint before drafting", /PLAN CHECKPOINT/i],
    [
      "names missing product detail",
      /placeholder|product facts|assumptions|review decisions|\[Feature|\[primary outcome/i,
    ],
    [
      "does not learn from unreviewed draft",
      /no learned preferences|no reusable preference was learned|no .*preferences can be promoted|unreviewed/i,
    ],
    [
      "treats skipped questions as weak",
      /skipped questions.*weak|preference-learning.*weak/i,
    ],
    [
      "does not claim learned preferences without decisions",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
  ],
  "rejected-plan": [
    ["frames migration report", /Frame[\s\S]*(Migration report|Artifact)/i],
    [
      "presents first plan",
      /Plan[\s\S]*(Executive Summary|Migration Context|Risks|Dependencies)/i,
    ],
    ["stops at plan checkpoint", /PLAN CHECKPOINT/i],
    [
      "blocks drafting before approval",
      (text) => !/Draft:|Here is the report|Migration Report\n/i.test(text),
    ],
    [
      "includes risk-aware structure",
      /Risks|Dependencies|Validation|rollback|operational/i,
    ],
    ["states assumptions", /Assumptions/i],
    [
      "does not claim rejected structure as preference",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
    ["is ready for replan turn", /describe what to change|approve/i],
  ],
  "durable-storage": [
    [
      "frames session-only constraint",
      /session-only|do not create project files/i,
    ],
    [
      "explicitly avoids file creation",
      /will not create|will not.*update|do not create .*\.writers-loop/i,
    ],
    [
      "mentions journal or prefs files",
      /journal\.jsonl|prefs\.md|journal|preference records/i,
    ],
    [
      "tracks decisions in conversation only",
      /conversation only|this chat|session only|session-only/i,
    ],
    [
      "mentions durable opt-in or rejection",
      /durable|persist|project-local|portable/i,
    ],
    ["mentions project-local storage", /project-local/i],
    ["mentions portable storage or redaction", /portable|redacted summaries/i],
    [
      "warns about privacy or sensitive content",
      /sensitive draft text|private preferences|privacy/i,
    ],
    [
      "does not promote storage mode from one task",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
  ],
  "style-distillation": [
    [
      "frames source and reuse",
      /Frame[\s\S]*(Sources|source type|Intended reuse|artifact type)/i,
    ],
    [
      "separates style from content",
      /separate style from content|style facts.*content facts|Style Versus Content/i,
    ],
    [
      "avoids copying private facts",
      /do not copy|avoid.*plot|private facts|project-specific claims/i,
    ],
    [
      "produces style pack",
      /Style Pack[\s\S]*(Observable Traits|Do:|Avoid:|Reusable Prompts)/i,
    ],
    ["includes confidence", /Confidence|confidence notes/i],
    [
      "asks before durable save",
      /ask before saving|session-only|durable|save/i,
    ],
    ["can apply via main loop", /Frame|critique|revision|apply.*style pack/i],
    [
      "does not claim learned preferences without decisions",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
  ],
  translation: [
    [
      "frames source and target",
      /Frame[\s\S]*(Source language|Target language|locale|Mode)/i,
    ],
    [
      "uses translation mode",
      /literal|natural|localized|parallel|review-only/i,
    ],
    [
      "preserves fixed tokens",
      /Preserve[\s\S]*(markdown|file paths|commands|code|URLs|IDs|names)/i,
    ],
    [
      "uses glossary or glossary note",
      /Glossary|term choices|ambiguous terms/i,
    ],
    ["reviews fidelity", /Fidelity|meaning fidelity|omissions|additions/i],
    [
      "reviews style",
      /Style|tone preservation|voice preservation|naturalness/i,
    ],
    ["proposes revision path", /Proposed Changes|revise|targeted/i],
    [
      "does not claim learned preferences without decisions",
      (text) => !/Learned Preferences[\s\S]*Rule:/i.test(text),
      { critical: true },
    ],
  ],
};

const RESPONSE_THRESHOLDS = {
  "coding-plan": 6,
  "executive-report": 6,
  "fiction-chapter": 5,
  "preference-conflict": 6,
  "no-learning-evidence": 5,
  "rejected-plan": 5,
  "durable-storage": 5,
  "style-distillation": 6,
  translation: 6,
};

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
    "references/checkpoints.md",
    "references/critique-rubrics.md",
    "references/multi-agent.md",
    "references/preference-journal.md",
    "references/preference-signals.md",
    "references/style-distillation.md",
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
  const criteria = scenario.criteria.map(([name, pattern, options = {}]) => ({
    name,
    passed: typeof pattern === "function" ? pattern(text) : pattern.test(text),
    critical: Boolean(options.critical),
  }));
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
