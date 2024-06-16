import {
  ChatInputCommandInteraction,
  CommandInteraction,
  GuildMember,
  Interaction,
} from "discord.js";
import { Client } from "./Client";

export interface ExecutableData {
  client: Client;
  executor: GuildMember;
  interaction: Interaction;
}

export interface Executable<T> {
  handle(data: T): Promise<any>;
}
