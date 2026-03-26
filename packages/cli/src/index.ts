import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { aiCommand } from "./commands/ai.js";
import { checkCommand } from "./commands/check.js";
import { listCommand } from "./commands/list.js";

const program = new Command();

program
  .name("dotignore")
  .description("Smart .gitignore generator — AI suggestions & conflict detection")
  .version("0.1.0");

program.addCommand(listCommand);
program.addCommand(initCommand);
program.addCommand(aiCommand);
program.addCommand(checkCommand);

program.parse();
