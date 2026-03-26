import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { getTemplates, mergeTemplates } from "@dotignore/templates";
import { detectConflicts } from "@dotignore/shared";
import type { TemplateCategory } from "@dotignore/shared";
import { writeFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const categoryLabels: Record<TemplateCategory, string> = {
  language: "Programming Languages",
  framework: "Frameworks & Libraries",
  os: "Operating Systems",
  ide: "IDEs & Editors",
};

const categories: TemplateCategory[] = ["language", "framework", "ide", "os"];

/** Scan a directory for well-known project files and return matching template IDs */
function detectTemplates(dir: string): string[] {
  let files: string[] = [];
  try {
    files = readdirSync(dir);
  } catch {
    return [];
  }

  const detected = new Set<string>();
  const has = (name: string) => files.includes(name);
  const hasExt = (ext: string) => files.some((f) => f.endsWith(ext));

  // Languages
  if (has("package.json")) detected.add("node");
  if (has("go.mod") || has("go.sum") || hasExt(".go")) detected.add("go");
  if (has("Cargo.toml") || hasExt(".rs")) detected.add("rust");
  if (has("requirements.txt") || has("pyproject.toml") || has("setup.py") || hasExt(".py")) detected.add("python");
  if (has("pom.xml") || has("build.gradle") || has("build.gradle.kts") || hasExt(".java")) detected.add("java");
  if (hasExt(".cs") || hasExt(".csproj") || hasExt(".sln")) detected.add("csharp");
  if (has("Package.swift") || hasExt(".swift")) detected.add("swift");
  if (has("pubspec.yaml") || hasExt(".dart")) detected.add("flutter");

  // Frameworks
  if (has("next.config.js") || has("next.config.ts") || has("next.config.mjs")) detected.add("nextjs");
  if (has("manage.py")) detected.add("django");
  if (has("artisan")) detected.add("laravel");
  if (has("Gemfile") && has("config")) detected.add("rails");

  // IDEs
  if (has(".vscode")) detected.add("vscode");
  if (has(".idea")) detected.add("jetbrains");

  return [...detected];
}

export const initCommand = new Command("init")
  .description("Create a .gitignore file interactively or from flags")
  .option("-o, --output <path>", ".gitignore output path", ".gitignore")
  .option("-t, --templates <ids>", "Comma-separated template IDs (non-interactive)")
  .option("--detect", "Auto-detect templates from the current directory")
  .option("-f, --force", "Overwrite existing file without prompting")
  .option("--dry-run", "Preview output without writing to disk")
  .option("-m, --merge", "Append to existing .gitignore instead of overwriting")
  .action(
    async (options: {
      output: string;
      templates?: string;
      detect?: boolean;
      force?: boolean;
      dryRun?: boolean;
      merge?: boolean;
    }) => {
      console.log(chalk.bold.cyan("\n🚀 dotignore — Smart .gitignore Generator\n"));

      const allTemplates = getTemplates();
      let selectedIds: string[] = [];

      // ── 1. Non-interactive: --templates flag ──
      if (options.templates) {
        const ids = options.templates.split(",").map((s) => s.trim()).filter(Boolean);
        const invalid = ids.filter((id) => !allTemplates.find((t) => t.id === id));
        if (invalid.length > 0) {
          console.log(chalk.red(`\n✗ Unknown template(s): ${invalid.join(", ")}`));
          console.log(chalk.dim(`  Run ${chalk.white("dotignore list")} to see available templates.\n`));
          process.exit(1);
        }
        selectedIds = ids;
        console.log(chalk.dim(`  Using: ${ids.join(", ")}\n`));
      }
      // ── 2. Auto-detect ──
      else if (options.detect) {
        const detected = detectTemplates(process.cwd());
        if (detected.length === 0) {
          console.log(chalk.yellow("  ⚠ No recognizable project files found. Switching to interactive mode.\n"));
        } else {
          console.log(chalk.dim(`  Detected: ${detected.join(", ")}\n`));
          const { confirmed } = await inquirer.prompt<{ confirmed: string[] }>([
            {
              type: "checkbox",
              name: "confirmed",
              message: "Detected templates (customize if needed):",
              choices: detected.map((id) => ({
                name: allTemplates.find((t) => t.id === id)?.name ?? id,
                value: id,
                checked: true,
              })),
            },
          ]);
          selectedIds = confirmed;
        }
      }

      // ── 3. Interactive fallback ──
      if (selectedIds.length === 0 && !options.templates) {
        for (const category of categories) {
          const templates = allTemplates.filter((t) => t.category === category);
          if (templates.length === 0) continue;

          const { selected } = await inquirer.prompt<{ selected: string[] }>([
            {
              type: "checkbox",
              name: "selected",
              message: `${categoryLabels[category]}:`,
              choices: templates.map((t) => ({
                name: `${t.name} — ${t.description}`,
                value: t.id,
              })),
            },
          ]);
          selectedIds.push(...selected);
        }
      }

      if (selectedIds.length === 0) {
        console.log(chalk.yellow("\n⚠ No templates selected. Exiting.\n"));
        return;
      }

      const { content } = mergeTemplates(selectedIds);

      // ── Conflict detection ──
      const conflicts = detectConflicts(content);
      if (conflicts.length > 0) {
        console.log(chalk.yellow(`\n⚠ ${conflicts.length} potential conflict(s) detected:\n`));
        for (const c of conflicts) {
          const icon = c.severity === "error" ? chalk.red("✗") : chalk.yellow("⚡");
          console.log(`  ${icon} ${c.message}`);
        }
        console.log();
      }

      // ── Preview ──
      const lines = content.split("\n");
      console.log(chalk.dim("─".repeat(50)));
      console.log(chalk.bold("\nPreview:\n"));
      console.log(chalk.dim(lines.slice(0, 20).join("\n")));
      if (lines.length > 20) {
        console.log(chalk.dim(`\n... and ${lines.length - 20} more lines`));
      }
      console.log(chalk.dim("\n" + "─".repeat(50)));

      // ── Dry run ──
      if (options.dryRun) {
        console.log(chalk.cyan(`\n  --dry-run: no file written.`));
        console.log(chalk.dim(`  Would write ${lines.length} lines to ${options.output}\n`));
        return;
      }

      // ── Merge into existing ──
      const outputPath = resolve(options.output);
      if (options.merge && existsSync(outputPath)) {
        const existing = readFileSync(outputPath, "utf-8");
        const separator = `\n\n# ─── Added by dotignore (${new Date().toISOString().slice(0, 10)}) ───\n`;
        writeFileSync(outputPath, existing.trimEnd() + separator + content, "utf-8");
        console.log(chalk.green(`\n✓ Merged into ${options.output}!`));
        console.log(chalk.dim(`  ${selectedIds.length} template(s), ${lines.length} new lines\n`));
        return;
      }

      // ── Overwrite guard ──
      if (existsSync(outputPath) && !options.force) {
        const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
          {
            type: "confirm",
            name: "overwrite",
            message: `${options.output} already exists. Overwrite?`,
            default: false,
          },
        ]);
        if (!overwrite) {
          console.log(chalk.yellow("\nCancelled.\n"));
          return;
        }
      }

      writeFileSync(outputPath, content, "utf-8");
      console.log(chalk.green(`\n✓ ${options.output} created successfully!`));
      console.log(chalk.dim(`  ${selectedIds.length} template(s) merged, ${lines.length} lines\n`));
    }
  );
