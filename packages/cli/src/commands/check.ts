import { Command } from "commander";
import chalk from "chalk";
import { detectConflicts } from "@dotignore/shared";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export const checkCommand = new Command("check")
  .description("Mevcut .gitignore dosyasını çakışma tespiti ile analiz et")
  .argument("[path]", ".gitignore dosya yolu", ".gitignore")
  .action(async (filePath: string) => {
    const fullPath = resolve(filePath);

    if (!existsSync(fullPath)) {
      console.log(chalk.red(`\n✗ Dosya bulunamadı: ${filePath}\n`));
      process.exit(1);
    }

    const content = readFileSync(fullPath, "utf-8");
    const lines = content.split("\n");
    const ruleCount = lines.filter(
      (l) => l.trim() && !l.startsWith("#")
    ).length;

    console.log(chalk.bold.cyan(`\n🔍 dotignore check — ${filePath}\n`));
    console.log(chalk.dim(`  ${lines.length} satır, ${ruleCount} kural\n`));

    const conflicts = detectConflicts(content);

    if (conflicts.length === 0) {
      console.log(
        chalk.green("  ✓ Hiçbir çakışma tespit edilmedi. Dosyanız temiz!\n")
      );
      return;
    }

    const errors = conflicts.filter((c) => c.severity === "error");
    const warnings = conflicts.filter((c) => c.severity === "warning");

    if (errors.length > 0) {
      console.log(chalk.red.bold(`  ${errors.length} hata:\n`));
      for (const c of errors) {
        console.log(
          `    ${chalk.red("✗")} [Satır ${c.lines[0]}–${c.lines[1]}] ${c.message}`
        );
      }
      console.log();
    }

    if (warnings.length > 0) {
      console.log(chalk.yellow.bold(`  ${warnings.length} uyarı:\n`));
      for (const c of warnings) {
        console.log(
          `    ${chalk.yellow("⚡")} [Satır ${c.lines[0]}–${c.lines[1]}] ${c.message}`
        );
      }
      console.log();
    }

    console.log(
      chalk.dim(`  Toplam: ${errors.length} hata, ${warnings.length} uyarı\n`)
    );

    if (errors.length > 0) {
      process.exit(1);
    }
  });
