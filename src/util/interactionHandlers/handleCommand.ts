import { Client, Embed } from "../../lib/Discord";
import {
  ButtonInteraction,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalSubmitInteraction,
} from "discord.js";

export async function handleCommand(
  client: Client,
  interaction: ChatInputCommandInteraction
) {
  const commandName = interaction.commandName;

  if (!client.commands.has(commandName)) {
    return await interaction.reply({
      content: "Something has gone terribly wrong. Please try again later!",
      ephemeral: true,
    });
  }

  const memberId = interaction.user.id;
  const guild = await client.guilds.fetch(interaction.guild!.id);
  const member = await guild.members.fetch(memberId);

  if (!member) {
    return await interaction.reply({
      content: "Something has gone terribly wrong. Please try again later!",
      ephemeral: true,
    });
  }

  client.commands.get(commandName)!.handle({
    client: client,
    interaction,
    executor: member,
  });
}
