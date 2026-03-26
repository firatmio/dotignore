import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { aiCommand } from "./commands/ai.js";
import { checkCommand } from "./commands/check.js";

const program = new Command();

program
  .name("dotignore")
  .description(
    "Akıllı .gitignore oluşturucu — AI destekli öneriler ve çakışma tespiti"
  )
  .version("0.1.0");

program.addCommand(initCommand);
program.addCommand(aiCommand);
program.addCommand(checkCommand);

program.parse();
