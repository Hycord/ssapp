import { Command } from "../lib/Discord";
import { Accept } from "./suggestion/accept";
import { Deny } from "./suggestion/deny";
import { Implement } from "./suggestion/implement";

export class Suggestion extends Command {
  constructor() {
    super({
      name: "suggestion",
      description: "This is not used :P",
      developerOnly: false,
      subCommands: [new Accept(), new Deny(), new Implement()],
    });
  }
}
