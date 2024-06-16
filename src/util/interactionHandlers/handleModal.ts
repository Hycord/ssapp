import { Client, Embed } from "../../lib/Discord";
import { ModalSubmitInteraction } from "discord.js";

export async function handleModal(
  client: Client,
  interaction: ModalSubmitInteraction
) {
  await interaction.deferReply({
    ephemeral: true,
  });
  const modalId = interaction.customId;

  if (modalId != "suggestion")
    return await interaction.editReply({
      content: "This modal is unknown. Please try again!",
    });

  const channel = await client.channel();
  if (!channel || !channel.isTextBased())
    return await interaction.editReply({
      content:
        "There was an error submitting your suggestion. Please try again!",
    });

  const memberId = interaction.user.id;
  const guild = await client.guilds.fetch(interaction.guild!.id);
  const member = await guild.members.fetch(memberId);

  const title = interaction.fields.getTextInputValue("title");
  const description = interaction.fields.getTextInputValue("description");
  try {
    const { id } = await client.prisma.suggestion.create({
      data: {
        title,
        description,
        author: interaction.user.id,
        channelId: client.channelId,
      },
    });

    const embed = new Embed()
      .setColor("#9BF6FF")
      .setTitle(`New Suggestion`)
      .setDescription(
        `**Title**:\n ${title.replaceAll("`", "")}\n
  **Description**:\n ${description.replaceAll("`", "")}\n
  **Submitted By**: <@${member.id}> (\`@${member.user.username}\`)`
      )
      .setFooterText(`ID: ${id} | Status: ⚠️ Not Reviewed`);

    const message = await channel.send({
      embeds: [embed],
    });

    await client.prisma.suggestion.update({
      where: {
        id,
      },
      data: {
        messageId: message.id,
      },
    });

    await interaction.editReply({
      content: `Suggestion submitted, Suggestion ID: \`${id}\``,
    });
  } catch (e) {
    return await interaction.reply({
      ephemeral: true,
      content:
        "There was an issue submitting your suggestion. Please try again later.",
    });
  }
}
