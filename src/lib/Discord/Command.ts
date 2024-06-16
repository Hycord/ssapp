import {
  ChatInputCommandInteraction,
  InteractionCollector,
  SlashCommandBuilder,
} from "discord.js";
import { Executable, ExecutableData } from "./Executable";
import { SubCommand } from "./SubCommand";

export interface CommandData extends ExecutableData {
  interaction: ChatInputCommandInteraction;
}

export interface CommandOptions {
  developerOnly?: boolean; // Deaults to TRUE
  admninistratorOnly?: boolean; // Defaults to TRUE
  defaultMemberPermissions?: string | number | bigint | null | undefined; // Used for when it is not an admin or developer only command.
  defer?: boolean; // Defaults to FALSE; Used for long-lasting commands. Never defer when showing a modal.
  ephemeral?: boolean; // Defaults to FALSE; Used when defer is true
  description: string;
  name: string;
  subCommands?: SubCommand[];
}

export class Command
  extends SlashCommandBuilder
  implements Executable<CommandData>
{
  protected _subCommands: Map<string, SubCommand> = new Map();
  protected _admninistratorOnly: boolean;
  protected _developerOnly: boolean;
  protected _defer: boolean;
  protected _ephemeral: boolean;

  constructor(options: CommandOptions) {
    const {
      description,
      name,
      admninistratorOnly = true,
      defer = false,
      ephemeral = false,
      developerOnly = true,
      defaultMemberPermissions,
      subCommands = [],
    } = options;
    super();

    this._developerOnly = developerOnly;
    this._admninistratorOnly = admninistratorOnly;
    this._defer = defer;
    this._ephemeral = ephemeral;

    this.setName(name);
    this.setDescription(developerOnly ? "[DEV] " + description : description);

    if (developerOnly) {
      this.setDefaultMemberPermissions(null); // Handled interally. Should be open so devs can access in any server.
    } else if (admninistratorOnly) {
      this.setDefaultMemberPermissions("0");
    } else {
      this.setDefaultMemberPermissions(defaultMemberPermissions);
    }

    this.setDMPermission(false);

    for (const subCommand of subCommands) {
      // console.log(`Adding ${subCommand.name}`);
      this.addSubcommand(subCommand);
      this._subCommands.set(subCommand.name, subCommand);
    }
  }

  public async handle(data: CommandData): Promise<any> {
    if (this._developerOnly && !data.client.isDeveloper(data.executor))
      return await data.interaction.reply({
        content: "This command can only be executed by a developer!",
        ephemeral: true,
      });

    if (this._defer)
      await data.interaction.deferReply({
        ephemeral: this._ephemeral,
      });
    this.execute(data);
  }

  protected async execute(data: CommandData): Promise<any> {
    if (this._subCommands.size == 0) {
      return await data.interaction[this._defer ? "editReply" : "reply"]({
        content:
          "This command has not been implemented properly and is expected to have a sub command.",
        ...(this._defer ? {} : { ephemeral: true }),
      });
    }

    const subCommandName = data.interaction.options.getSubcommand(false);
    if (!subCommandName) return;
    const subCommand = this._subCommands.get(subCommandName);
    if (!subCommand) return;
    subCommand.handle(data);
  }
}
