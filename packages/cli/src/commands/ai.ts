import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { getTemplates } from "@dotignore/templates";
import type {
  TemplateCategory,
  GenerateAiResponse,
} from "@dotignore/shared";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_API_BASE = "https://dotignore.dev";

const categoryLabels: Record<TemplateCategory, string> = {
  language: "Programming Languages",
  framework: "Frameworks & Libraries",
  os: "Operating Systems",
  ide: "IDEs & Editors",
};

const categories: TemplateCategory[] = ["language", "framework", "ide", "os"];

export const aiCommand = new Command("ai")
  .description("Generate a .gitignore with AI-powered suggestions")
  .option("-k, --key <apiKey>", "API key (or set DOTIGNORE_API_KEY env var)")
  .option("-d, --description <desc>", "Short description of your project")
  .option("-t, --templates <ids>", "Comma-separated base template IDs")
  .option("-o, --output <path>", ".gitignore output path", ".gitignore")
  .option("-f, --force", "Overwrite existing file without prompting")
  .option("--dry-run", "Preview output without writing to disk")
  .option("-m, --merge", "Append to existing .gitignore instead of overwriting")
  .option("--api-base <url>", "API base URL", DEFAULT_API_BASE)
  .action(
    async (options: {
      key?: string;
      description?: string;
      templates?: string;
      output: string;
      force?: boolean;
      dryRun?: boolean;
      merge?: boolean;
      apiBase: string;
    }) => {
      const apiKey = options.key || process.env.DOTIGNORE_API_KEY;
      if (!apiKey) {
        console.log(chalk.red("\n✗ API key required."));
        console.log(chalk.dim("  Provide via --key or DOTIGNORE_API_KEY environment variable."));
        console.log(chalk.dim("  Get a key at: https://dotignore.dev/dashboard\n"));
        process.exit(1);
      }

      console.log(chalk.bold.magenta("\n🤖 dotignore AI — Smart Suggestions\n"));

      // ── Project description ──
      let description = options.description;
      if (!description) {
        const answer = await inquirer.prompt<{ description: string }>([
          {
            type: "input",
            name: "description",
            message: "Briefly describe your project:",
            validate: (v: string) => v.trim().length > 0 || "Description cannot be empty",
          },
        ]);
        description = answer.description;
      }

      // ── Base templates ──
      const allTemplates = getTemplates();
      let selectedIds: string[] = [];

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
      } else {
        const { wantTemplates } = await inquirer.prompt<{ wantTemplates: boolean }>([
          {
            type: "confirm",
            name: "wantTemplates",
            message: "Would you like to select base templates as well?",
            default: true,
          },
        ]);

        if (wantTemplates) {
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
      }

      // ── API call with spinner ──
      const spinner = ora("Fetching AI suggestions…").start();

      try {
        const res = await fetch(`${options.apiBase}/api/generate/ai`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            templates: selectedIds,
            projectDescription: description,
          }),
        });

        if (!res.ok) {
          spinner.fail("API request failed.");
          const err = (await res.json().catch(() => ({ error: res.statusText }))) as { error: string };
          console.log(chalk.red(`\n✗ Error (${res.status}): ${err.error}\n`));
          process.exit(1);
        }

        const data = (await res.json()) as GenerateAiResponse;
        spinner.succeed("AI suggestions ready.");

        // ── Show AI suggestions ──
        if (data.aiSuggestions.length > 0) {
          console.log(chalk.bold("\n🧠 AI Suggestions:\n"));
          for (const s of data.aiSuggestions) {
            console.log(`  ${chalk.green("+")} ${chalk.bold(s.rule)}`);
            console.log(`    ${chalk.dim(s.reason)}`);
          }
          console.log();
        }

        // ── Show conflicts ──
        if (data.conflicts.length > 0) {
          console.log(chalk.yellow(`⚠ ${data.conflicts.length} potential conflict(s):\n`));
          for (const c of data.conflicts) {
            const icon = c.severity === "error" ? chalk.red("✗") : chalk.yellow("⚡");
            console.log(`  ${icon} ${c.message}`);
          }
          console.log();
        }

        // ── Dry run ──
        if (options.dryRun) {
          const lines = data.content.split("\n");
          console.log(chalk.cyan(`\n  --dry-run: no file written.`));
          console.log(chalk.dim(`  Would write ${lines.length} lines to ${options.output}\n`));
          return;
        }

        // ── Merge ──
        const outputPath = resolve(options.output);
        if (options.merge && existsSync(outputPath)) {
          const existing = readFileSync(outputPath, "utf-8");
          const separator = `\n\n# ─── Added by dotignore AI (${new Date().toISOString().slice(0, 10)}) ───\n`;
          writeFileSync(outputPath, existing.trimEnd() + separator + data.content, "utf-8");
          console.log(chalk.green(`\n✓ Merged into ${options.output}!`));
          console.log(chalk.dim(`  ${data.aiSuggestions.length} AI suggestion(s) added\n`));
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

        writeFileSync(outputPath, data.content, "utf-8");
        console.log(chalk.green(`\n✓ ${options.output} generated with AI!`));
        console.log(chalk.dim(`  ${data.aiSuggestions.length} AI suggestion(s) added\n`));
      } catch (err) {
        spinner.fail("Connection error.");
        console.log(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      }
    }
  );