#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ignoredDirs = new Set([".git", "node_modules", ".artifacts", ".writers-loop"]);
const ignoredFiles = new Set(["tools/scan-secrets.mjs", "tools/validate-skill.mjs"]);

const patterns = [
  [
    "credential assignment",
    /(api[_-]?key|secret|token|password|private[_-]?key|access[_-]?key)\s*[:=]\s*['"]?[A-Za-z0-9_+./=-]{12,}/i,
  ],
  ["private key block", /BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY/],
  ["OpenAI-style key", /sk-[A-Za-z0-9_-]{20,}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9_]{20,}/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{20,}/],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const absolute = path.join(dir, entry);
    const relative = path.relative(repoRoot, absolute);
    const stat = statSync(absolute);
    if (stat.isDirectory()) {
      if (ignoredDirs.has(entry)) return [];
      return walk(absolute);
    }
    return [relative];
  });
}

function entropy(value) {
  const counts = new Map();
  for (const char of value) counts.set(char, (counts.get(char) ?? 0) + 1);
  let result = 0;
  for (const count of counts.values()) {
    const probability = count / value.length;
    result -= probability * Math.log2(probability);
  }
  return result;
}

function highEntropyCandidates(line) {
  return [...line.matchAll(/[A-Za-z0-9_+\-/=]{32,}/g)]
    .map((match) => match[0])
    .filter((token) => new Set(token).size >= 12)
    .filter((token) => entropy(token) >= 4.5);
}

const findings = [];
for (const file of walk(repoRoot)) {
  if (ignoredFiles.has(file)) continue;
  let text;
  try {
    text = readFileSync(path.join(repoRoot, file), "utf8");
  } catch {
    continue;
  }
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    for (const [name, pattern] of patterns) {
      if (pattern.test(line)) {
        findings.push(`${file}:${index + 1}: ${name}`);
      }
    }
    for (const token of highEntropyCandidates(line)) {
      findings.push(
        `${file}:${index + 1}: high-entropy candidate ${token.slice(0, 12)}...${token.slice(-6)}`,
      );
    }
  });
}

if (findings.length > 0) {
  console.error("Secret scan failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Secret scan passed: no candidate secrets found.");
