import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { getTemplates, mergeTemplates } from "@dotignore/templates";
import { detectConflicts } from "@dotignore/shared";
import type { TemplateCategory } from "@dotignore/shared";
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const categoryLabels: Record<TemplateCategory, string> = {
  language: "Programlama Dilleri",
  framework: "Framework'ler",
  os: "İşletim Sistemleri",
  ide: "IDE / Editörler",
};

const categories: TemplateCategory[] = ["language", "framework", "ide", "os"];

export const initCommand = new Command("init")
  .description("İnteraktif .gitignore dosyası oluştur")
  .option("-o, --output <path>", ".gitignore dosya yolu", ".gitignore")
  .action(async (options: { output: string }) => {
    console.log(
      chalk.bold.cyan("\n🚀 dotignore — Akıllı .gitignore Oluşturucu\n")
    );

    const allTemplates = getTemplates();
    const selectedIds: string[] = [];

    for (const category of categories) {
      const templates = allTemplates.filter((t) => t.category === category);
      if (templates.length === 0) continue;

      const { selected } = await inquirer.prompt<{ selected: string[] }>([
        {
          type: "checkbox",
          name: "selected",
          message: `${categoryLabels[category]} seçin:`,
          choices: templates.map((t) => ({
            name: `${t.name} — ${t.description}`,
            value: t.id,
          })),
        },
      ]);

      selectedIds.push(...selected);
    }

    if (selectedIds.length === 0) {
      console.log(
        chalk.yellow("\n⚠ Hiçbir şablon seçilmedi. Çıkış yapılıyor.\n")
      );
      return;
    }

    const { content } = mergeTemplates(selectedIds);

    // Çakışma tespiti
    const conflicts = detectConflicts(content);
    if (conflicts.length > 0) {
      console.log(
        chalk.yellow(
          `\n⚠ ${conflicts.length} potansiyel çakışma tespit edildi:\n`
        )
      );
      for (const c of conflicts) {
        const icon =
          c.severity === "error" ? chalk.red("✗") : chalk.yellow("⚡");
        console.log(`  ${icon} ${c.message}`);
      }
      console.log();
    }

    // Önizleme
    const lines = content.split("\n");
    console.log(chalk.dim("─".repeat(50)));
    console.log(chalk.bold("\nÖnizleme:\n"));
    console.log(chalk.dim(lines.slice(0, 20).join("\n")));
    if (lines.length > 20) {
      console.log(chalk.dim(`\n... ve ${lines.length - 20} satır daha`));
    }
    console.log(chalk.dim("\n" + "─".repeat(50)));

    // Dosyaya yaz
    const outputPath = resolve(options.output);

    if (existsSync(outputPath)) {
      const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
        {
          type: "confirm",
          name: "overwrite",
          message: `${options.output} zaten mevcut. Üzerine yazılsın mı?`,
          default: false,
        },
      ]);
      if (!overwrite) {
        console.log(chalk.yellow("\nİptal edildi.\n"));
        return;
      }
    }

    writeFileSync(outputPath, content, "utf-8");
    console.log(
      chalk.green(`\n✓ ${options.output} dosyası başarıyla oluşturuldu!`)
    );
    console.log(
      chalk.dim(
        `  ${selectedIds.length} şablon birleştirildi, ${lines.length} satır\n`
      )
    );
  });
