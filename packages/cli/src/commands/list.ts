import { Command } from "commander";
import chalk from "chalk";
import { getTemplates, getTemplatesByCategory } from "@dotignore/templates";
import type { TemplateCategory } from "@dotignore/shared";

const categoryLabels: Record<TemplateCategory, string> = {
  language: "Programming Languages",
  framework: "Frameworks & Libraries",
  os: "Operating Systems",
  ide: "IDEs & Editors",
};

const categoryColors: Record<TemplateCategory, chalk.Chalk> = {
  language: chalk.cyan,
  framework: chalk.green,
  os: chalk.magenta,
  ide: chalk.yellow,
};

export const listCommand = new Command("list")
  .description("List all available templates")
  .option("-c, --category <category>", "Filter by category (language|framework|os|ide)")
  .option("-s, --search <query>", "Search templates by name or description")
  .option("--ids", "Show only template IDs (useful for scripting)")
  .action(
    (options: { category?: string; search?: string; ids?: boolean }) => {
      const allTemplates = getTemplates();

      let templates = allTemplates;

      if (options.category) {
        const cat = options.category as TemplateCategory;
        const valid: TemplateCategory[] = ["language", "framework", "os", "ide"];
        if (!valid.includes(cat)) {
          console.log(chalk.red(`\n✗ Invalid category: "${options.category}"`));
          console.log(chalk.dim(`  Valid values: ${valid.join(", ")}\n`));
          process.exit(1);
        }
        templates = getTemplatesByCategory(cat);
      }

      if (options.search) {
        const q = options.search.toLowerCase();
        templates = templates.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q)
        );
      }

      if (templates.length === 0) {
        console.log(chalk.yellow("\n  No templates found.\n"));
        return;
      }

      if (options.ids) {
        console.log(templates.map((t) => t.id).join("\n"));
        return;
      }

      console.log(chalk.bold.cyan(`\n📋 dotignore — Available Templates\n`));
      console.log(chalk.dim(`  ${templates.length} template(s) found\n`));

      const categories: TemplateCategory[] = ["language", "framework", "ide", "os"];
      const grouped = categories.filter((cat) => {
        const inCat = templates.filter((t) => t.category === cat);
        return inCat.length > 0;
      });

      for (const cat of grouped) {
        const inCat = templates.filter((t) => t.category === cat);
        const color = categoryColors[cat];
        const label = categoryLabels[cat];

        console.log(color.bold(`  ${label} (${inCat.length})`));
        console.log(chalk.dim("  " + "─".repeat(44)));

        for (const t of inCat) {
          console.log(
            `  ${chalk.white.bold(t.id.padEnd(18))}  ${chalk.dim(t.description)}`
          );
        }
        console.log();
      }

      console.log(
        chalk.dim(
          `  Usage: dotignore init --templates ${templates.slice(0, 2).map((t) => t.id).join(",")}\n`
        )
      );
    }
  );
