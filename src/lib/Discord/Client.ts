import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client as DiscordJSClient,
  EmbedBuilder,
  Guild,
  GuildMember,
  ModalSubmitInteraction,
  Partials,
  User,
  type ClientOptions as DiscordJSClientOptions,
} from "discord.js";
import { Embed } from "./Embed";
import { Command } from "./Command";
import { SubCommand } from "./SubCommand";
import { PrismaClient } from "@prisma/client";

export interface DiscordClientOptions extends DiscordJSClientOptions {
  guildId: string; // The guild ID which commands will be pushed to when not in production
  production: boolean; // Push commands globally?
  channelId: string; // Used specifically for the suggestions bot. Channel to send suggestions to
}

export class Client extends DiscordJSClient {
  public commands: Map<string, Command> = new Map();
  public guildId: string;
  public production: boolean;
  public channelId: string;
  public prisma: PrismaClient;

  constructor(options: DiscordClientOptions) {
    super(options);

    this.guildId = options.guildId;
    this.production = options.production;
    this.channelId = options.channelId;

    this.prisma = new PrismaClient();
  }

  public async pushCommands(): Promise<void> {
    if (/* this.production */ false) {
      // Always push to dev guild.
      await this.application!.commands.set([
        ...Array.from(this.commands.values()).map((command) =>
          command.toJSON()
        ),
      ]);
    } else {
      const guild = await this.guilds.cache.get(this.guildId);
      await guild!.commands.set([
        ...Array.from(this.commands.values()).map((command) =>
          command.toJSON()
        ),
      ]);
    }
  }

  public async guild() {
    return await this.guilds.fetch(this.guildId);
  }

  public async channel() {
    return await this.channels.fetch(this.channelId);
  }

  public addCommand(command: Command): void {
    this.commands.set(command.name, command);
  }

  public isDeveloper(user: GuildMember | User) {
    const developerIds = ["322144499734151169"];

    return developerIds.includes(user.id);
  }
}
