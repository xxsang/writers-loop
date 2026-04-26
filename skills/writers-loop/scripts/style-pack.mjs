#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const PREFERENCE_DIR = ".writers-loop";
const STYLES_DIR = "styles";

function usage() {
  console.error(`Usage:
  node scripts/style-pack.mjs init [project-dir]
  node scripts/style-pack.mjs save [project-dir] <style-name> <style-pack-file>
  node scripts/style-pack.mjs list [project-dir]
  node scripts/style-pack.mjs show [project-dir] <style-name>

Default project-dir is the current working directory.
Save expects a reviewed style pack file, not raw source samples.`);
}

function resolveProjectDir(arg) {
  return path.resolve(arg ?? process.cwd());
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function slug(value) {
  const normalized = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "style-pack";
}

function stylePaths(projectDir) {
  const root = path.join(projectDir, PREFERENCE_DIR);
  const styles = path.join(root, STYLES_DIR);
  return { root, styles };
}

function styleFile(projectDir, styleName) {
  return path.join(stylePaths(projectDir).styles, `${slug(styleName)}.md`);
}

function init(projectDir) {
  const paths = stylePaths(projectDir);
  mkdirSync(paths.styles, { recursive: true });
  console.log(`Initialized ${paths.styles}`);
}

function wrapStylePack(styleName, sourcePath, content) {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Style pack file is empty.");
  }
  const lines = [
    `# Style Pack: ${styleName}`,
    "",
    `_Saved from ${path.basename(sourcePath)} on ${new Date().toISOString()}._`,
    "",
    trimmed,
    "",
  ];
  return lines.join("\n");
}

function save(projectDir, styleName, sourcePath) {
  const name = normalizeText(styleName);
  if (!name) throw new Error("Missing style name.");
  if (!sourcePath) throw new Error("Missing style pack file.");
  const absoluteSource = path.resolve(sourcePath);
  if (!existsSync(absoluteSource)) {
    throw new Error(`Style pack file does not exist: ${absoluteSource}`);
  }
  init(projectDir);
  const content = readFileSync(absoluteSource, "utf8");
  const destination = styleFile(projectDir, name);
  writeFileSync(destination, wrapStylePack(name, absoluteSource, content), "utf8");
  console.log(`Saved style pack: ${destination}`);
}

function list(projectDir) {
  const paths = stylePaths(projectDir);
  if (!existsSync(paths.styles)) {
    console.log("No style packs found.");
    return;
  }
  const files = readdirSync(paths.styles)
    .filter((file) => file.endsWith(".md"))
    .sort();
  if (files.length === 0) {
    console.log("No style packs found.");
    return;
  }
  for (const file of files) {
    console.log(file.replace(/\.md$/, ""));
  }
}

function show(projectDir, styleName) {
  const file = styleFile(projectDir, styleName);
  if (!existsSync(file)) {
    throw new Error(`Style pack not found: ${slug(styleName)}`);
  }
  process.stdout.write(readFileSync(file, "utf8"));
}

function parseInitOrList(args) {
  return {
    projectDir: resolveProjectDir(args[0]),
  };
}

function parseShow(args) {
  if (args.length === 1) {
    return {
      projectDir: resolveProjectDir(),
      styleName: args[0],
    };
  }
  return {
    projectDir: resolveProjectDir(args[0]),
    styleName: args[1],
  };
}

function parseSave(args) {
  if (args.length === 2) {
    return {
      projectDir: resolveProjectDir(),
      styleName: args[0],
      sourcePath: args[1],
    };
  }
  return {
    projectDir: resolveProjectDir(args[0]),
    styleName: args[1],
    sourcePath: args[2],
  };
}

const [command, ...args] = process.argv.slice(2);

try {
  if (command === "init") {
    const parsed = parseInitOrList(args);
    init(parsed.projectDir);
  } else if (command === "save") {
    const parsed = parseSave(args);
    save(parsed.projectDir, parsed.styleName, parsed.sourcePath);
  } else if (command === "list") {
    const parsed = parseInitOrList(args);
    list(parsed.projectDir);
  } else if (command === "show") {
    const parsed = parseShow(args);
    show(parsed.projectDir, parsed.styleName);
  } else {
    usage();
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
