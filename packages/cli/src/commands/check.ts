import { Command } from "commander";
import chalk from "chalk";
import { detectConflicts } from "@dotignore/shared";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export const checkCommand = new Command("check")
  .description("Analyze a .gitignore file for conflicts and issues")
  .argument("[path]", ".gitignore file path", ".gitignore")
  .option("-f, --fix", "Auto-remove exact duplicate rules and rewrite the file")
  .action(async (filePath: string, options: { fix?: boolean }) => {
    const fullPath = resolve(filePath);

    if (!existsSync(fullPath)) {
      console.log(chalk.red(`\n✗ File not found: ${filePath}\n`));
      process.exit(1);
    }

    const content = readFileSync(fullPath, "utf-8");
    const lines = content.split("\n");
    const ruleLines = lines.filter((l) => l.trim() && !l.startsWith("#"));
    const ruleCount = ruleLines.length;

    console.log(chalk.bold.cyan(`\n🔍 dotignore check — ${filePath}\n`));
    console.log(chalk.dim(`  ${lines.length} lines, ${ruleCount} rules\n`));

    // ── Duplicate detection ──
    const seen = new Map<string, number>();
    const duplicates: Array<{ rule: string; first: number; second: number }> = [];
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      if (seen.has(trimmed)) {
        duplicates.push({ rule: trimmed, first: seen.get(trimmed)! + 1, second: idx + 1 });
      } else {
        seen.set(trimmed, idx);
      }
    });

    if (duplicates.length > 0) {
      console.log(chalk.yellow.bold(`  ${duplicates.length} duplicate rule(s):\n`));
      for (const d of duplicates) {
        console.log(`    ${chalk.yellow("⊡")} "${d.rule}" (line ${d.first} & ${d.second})`);
      }
      console.log();
    }

    const conflicts = detectConflicts(content);

    if (conflicts.length === 0 && duplicates.length === 0) {
      console.log(chalk.green("  ✓ No issues detected. Your file is clean!\n"));
      return;
    }

    const errors = conflicts.filter((c) => c.severity === "error");
    const warnings = conflicts.filter((c) => c.severity === "warning");

    if (errors.length > 0) {
      console.log(chalk.red.bold(`  ${errors.length} error(s):\n`));
      for (const c of errors) {
        console.log(`    ${chalk.red("✗")} [Line ${c.lines[0]}–${c.lines[1]}] ${c.message}`);
      }
      console.log();
    }

    if (warnings.length > 0) {
      console.log(chalk.yellow.bold(`  ${warnings.length} warning(s):\n`));
      for (const c of warnings) {
        console.log(`    ${chalk.yellow("⚡")} [Line ${c.lines[0]}–${c.lines[1]}] ${c.message}`);
      }
      console.log();
    }

    console.log(
      chalk.dim(`  Total: ${errors.length} error(s), ${warnings.length} warning(s), ${duplicates.length} duplicate(s)\n`)
    );

    // ── --fix: remove exact duplicates ──
    if (options.fix && duplicates.length > 0) {
      const dedupedLines: string[] = [];
      const written = new Set<string>();
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && written.has(trimmed)) continue;
        dedupedLines.push(line);
        if (trimmed && !trimmed.startsWith("#")) written.add(trimmed);
      }
      writeFileSync(fullPath, dedupedLines.join("\n"), "utf-8");
      console.log(chalk.green(`  ✓ Fixed: removed ${duplicates.length} duplicate rule(s) from ${filePath}\n`));
    }

    if (errors.length > 0) {
      process.exit(1);
    }
  });
