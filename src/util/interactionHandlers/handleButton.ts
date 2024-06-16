import { Client, Embed } from "../../lib/Discord";
import {
  ButtonInteraction,
  EmbedBuilder,
  ModalSubmitInteraction,
} from "discord.js";

export async function handleButton(
  client: Client,
  interaction: ButtonInteraction
) {
  console.log(interaction.customId);
  const [id, ...data] = interaction.customId.split("~");
  switch (id) {
    case "acceptSuggestion":
      const suggesId = Number(data[0]);
      try {
        await interaction.deferUpdate();
        if (!suggesId) throw null;
        const suggestionData = await client.prisma.suggestion.update({
          where: { id: suggesId },
          data: {
            status: "ACCEPTED",
            reviewedAt: new Date(),
            reviewedBy: interaction.user.id,
          },
        });

        const channel = await client.channels.fetch(suggestionData.channelId);
        if (!channel || !channel.isTextBased()) throw null;
        const message = await channel.messages.fetch(
          suggestionData.messageId as any
        );

        const newEmbed = EmbedBuilder.from(message.embeds[0]);

        newEmbed.setFooter({
          text: `ID: ${suggesId} | Status: 🔨 Accepted by @${interaction.user.username}`,
        });

        newEmbed.setColor("#CAFFBF");

        await message.edit({
          embeds: [newEmbed],
        });

        await interaction.editReply({
          content: `The suggestion has been updated. Please run \`/suggestion implement ${suggesId}\` once you have implemented this suggestion.`,

          embeds: [],
          components: [],
        });
      } catch (e) {
        return await interaction.editReply({
          content: `Unable to update data for suggestion with ID ${suggesId}. Please try again!`,

          embeds: [],
          components: [],
        });
      }
      break;
    case "denySuggestion":
      const suggestionId = Number(data[0]);
      try {
        await interaction.deferUpdate();
        if (!suggestionId) throw null;
        const suggestionData = await client.prisma.suggestion.update({
          where: { id: suggestionId },
          data: {
            status: "DENIED",
            reviewedAt: new Date(),
            reviewedBy: interaction.user.id,
          },
        });

        const channel = await client.channels.fetch(suggestionData.channelId);
        if (!channel || !channel.isTextBased()) throw null;
        const message = await channel.messages.fetch(
          suggestionData.messageId as any
        );

        const newEmbed = EmbedBuilder.from(message.embeds[0]);

        newEmbed.setFooter({
          text: `ID: ${suggestionId} | Status: ❌ Denied by @${interaction.user.username}`,
        });

        newEmbed.setColor("#FFADAD");

        await message.edit({
          embeds: [newEmbed],
        });

        await interaction.editReply({
          content: `The suggestion has been updated.`,

          embeds: [],
          components: [],
        });
      } catch (e) {
        return await interaction.editReply({
          content: `Unable to update data for suggestion with ID ${suggestionId}. Please try again!`,

          embeds: [],
          components: [],
        });
      }
      break;
    case "implementSuggestion":
      const sugId = Number(data[0]);
      try {
        await interaction.deferUpdate();
        if (!sugId) throw null;
        const suggestionData = await client.prisma.suggestion.update({
          where: { id: sugId },
          data: {
            status: "IMPLEMENTED",
            implementedAt: new Date(),
            implementedBy: interaction.user.id,
          },
        });

        const channel = await client.channels.fetch(suggestionData.channelId);
        if (!channel || !channel.isTextBased()) throw null;
        const message = await channel.messages.fetch(
          suggestionData.messageId as any
        );

        const newEmbed = EmbedBuilder.from(message.embeds[0]);

        newEmbed.setFooter({
          text: `ID: ${sugId} | Status: ✅ Implemented by @${interaction.user.username}`,
        });

        newEmbed.setColor("#FDFFB6");

        await message.edit({
          embeds: [newEmbed],
        });

        await interaction.editReply({
          content: `The suggestion has been updated.`,
          embeds: [],
          components: [],
        });
      } catch (e) {
        return await interaction.editReply({
          content: `Unable to update data for suggestion with ID ${sugId}. Please try again!`,
          embeds: [],
          components: [],
        });
      }
      break;
    case "cancel":
      await interaction.deferUpdate();
      await interaction.deleteReply();
      break;
  }
}
