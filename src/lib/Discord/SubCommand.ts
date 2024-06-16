import {
  ChatInputCommandInteraction,
  InteractionCollector,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { Executable, ExecutableData } from "./Executable";

export interface SubCommandData extends ExecutableData {
  interaction: ChatInputCommandInteraction;
}

export interface SubCommandOptions {
  developerOnly?: boolean; // Deaults to TRUE
  defer?: boolean; // Defaults to FALSE; Used for long-lasting Subcommands. Never defer when showing a modal.
  ephemeral?: boolean; // Defaults to FALSE; Used when defer is true
  name: string;
  description: string;
}

export class SubCommand
  extends SlashCommandSubcommandBuilder
  implements Executable<SubCommandData>
{
  protected _ephemeral: boolean;
  protected _developerOnly?: boolean;
  protected _defer: boolean;

  constructor({
    description,
    name,
    defer = false,
    ephemeral = false,
    developerOnly = true,
  }: SubCommandOptions) {
    super();

    this._developerOnly = developerOnly;
    this._defer = defer;
    this._ephemeral = ephemeral;

    this.setName(name);
    this.setDescription(developerOnly ? "[DEV] " + description : description);
  }

  public async handle(data: SubCommandData): Promise<any> {
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

  protected async execute(data: SubCommandData): Promise<any> {
    return await data.interaction[this._defer ? "editReply" : "reply"]({
      content: "This command has not been implemented.",
      ...(this._defer ? {} : { ephemeral: true }),
    });
  }
}
