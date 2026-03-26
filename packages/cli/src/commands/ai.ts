import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { getTemplates } from "@dotignore/templates";
import type {
  TemplateCategory,
  GenerateAiResponse,
} from "@dotignore/shared";
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_API_BASE = "https://dotignore.dev";

const categoryLabels: Record<TemplateCategory, string> = {
  language: "Programlama Dilleri",
  framework: "Framework'ler",
  os: "İşletim Sistemleri",
  ide: "IDE / Editörler",
};

const categories: TemplateCategory[] = ["language", "framework", "ide", "os"];

export const aiCommand = new Command("ai")
  .description("AI destekli .gitignore önerileri al")
  .option("-k, --key <apiKey>", "API anahtarı (veya DOTIGNORE_API_KEY env)")
  .option("-d, --description <desc>", "Proje açıklaması")
  .option("-o, --output <path>", ".gitignore dosya yolu", ".gitignore")
  .option("--api-base <url>", "API base URL", DEFAULT_API_BASE)
  .action(
    async (options: {
      key?: string;
      description?: string;
      output: string;
      apiBase: string;
    }) => {
      const apiKey = options.key || process.env.DOTIGNORE_API_KEY;
      if (!apiKey) {
        console.log(chalk.red("\n✗ API anahtarı gerekli."));
        console.log(
          chalk.dim(
            "  --key ile veya DOTIGNORE_API_KEY ortam değişkeni ile belirtin."
          )
        );
        console.log(
          chalk.dim(
            "  API anahtarı almak için: https://dotignore.dev/dashboard\n"
          )
        );
        process.exit(1);
      }

      console.log(
        chalk.bold.magenta("\n🤖 dotignore AI — Akıllı Öneriler\n")
      );

      // Proje açıklaması
      let description = options.description;
      if (!description) {
        const answer = await inquirer.prompt<{ description: string }>([
          {
            type: "input",
            name: "description",
            message: "Projenizi kısaca tanımlayın:",
            validate: (v: string) =>
              v.trim().length > 0 || "Açıklama boş olamaz",
          },
        ]);
        description = answer.description;
      }

      // Temel şablon seçimi
      const allTemplates = getTemplates();
      const selectedIds: string[] = [];

      const { wantTemplates } = await inquirer.prompt<{
        wantTemplates: boolean;
      }>([
        {
          type: "confirm",
          name: "wantTemplates",
          message: "Temel şablonlar da seçmek ister misiniz?",
          default: true,
        },
      ]);

      if (wantTemplates) {
        for (const category of categories) {
          const templates = allTemplates.filter(
            (t) => t.category === category
          );
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
      }

      // API çağrısı
      console.log(chalk.dim("\nAI önerileri alınıyor...\n"));

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
          const err = (await res
            .json()
            .catch(() => ({ error: res.statusText }))) as {
            error: string;
          };
          console.log(
            chalk.red(`\n✗ API hatası (${res.status}): ${err.error}\n`)
          );
          process.exit(1);
        }

        const data = (await res.json()) as GenerateAiResponse;

        // AI önerilerini göster
        if (data.aiSuggestions.length > 0) {
          console.log(chalk.bold("🧠 AI Önerileri:\n"));
          for (const s of data.aiSuggestions) {
            console.log(`  ${chalk.green("+")} ${chalk.bold(s.rule)}`);
            console.log(`    ${chalk.dim(s.reason)}`);
          }
          console.log();
        }

        // Çakışmaları göster
        if (data.conflicts.length > 0) {
          console.log(
            chalk.yellow(`⚠ ${data.conflicts.length} potansiyel çakışma:\n`)
          );
          for (const c of data.conflicts) {
            const icon =
              c.severity === "error" ? chalk.red("✗") : chalk.yellow("⚡");
            console.log(`  ${icon} ${c.message}`);
          }
          console.log();
        }

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

        writeFileSync(outputPath, data.content, "utf-8");
        console.log(
          chalk.green(`\n✓ ${options.output} AI destekli olarak oluşturuldu!`)
        );
        console.log(
          chalk.dim(
            `  ${data.aiSuggestions.length} AI önerisi eklendi\n`
          )
        );
      } catch (err) {
        console.log(
          chalk.red(`\n✗ Bağlantı hatası: ${(err as Error).message}\n`)
        );
        process.exit(1);
      }
    }
  );
