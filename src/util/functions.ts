import { Embed } from "../lib/Discord";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  CommandInteraction,
  ComponentType,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from "discord.js";

export function chunkArray<T>(size: number, array: T[]) {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr as T[][];
}

export async function createPaginatedEmbed(
  interaction: CommandInteraction,
  embeds: Embed[],
  itemsPerPage: number,
  page = 1
): Promise<void> {
  try {
    const totalPages = Math.ceil(embeds.length / itemsPerPage);
    let currentPage = page <= totalPages ? page : 1;

    const previousButton = () =>
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Primary);
    const pageButton = () =>
      new ButtonBuilder()
        .setCustomId("page")
        .setLabel(`${currentPage}/${totalPages}`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(true);
    const nextButton = () =>
      new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Primary);

    const updateEmbed = async (): Promise<void> => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = currentPage * itemsPerPage;
      const pageEmbeds = embeds.slice(start, end);

      const paginationRow = new ActionRowBuilder<ButtonBuilder>();

      // if (currentPage > 1) {
      // } else {
      //   paginationRow.addComponents(previousButton.setDisabled(true));
      // }
      paginationRow.addComponents(previousButton());

      paginationRow.addComponents(pageButton());

      paginationRow.addComponents(nextButton());
      // if (currentPage < totalPages) {
      // } else {
      //   paginationRow.addComponents(nextButton.setDisabled(true));
      // }

      await interaction.editReply({
        embeds: pageEmbeds,
        components: [paginationRow],
      });
    };
    const collector = interaction.channel?.createMessageComponentCollector({
      filter: (int) => int.user.id === interaction.user.id,
      time: 30000,
    });
    collector?.on("end", async () => {
      try {
        await disableComponents(interaction);
      } catch (e) {
        console.log("Original message was deleted or edited.");
      }
    });
    collector?.on("collect", async (int) => {
      try {
        const reply = await interaction.fetchReply();
        if (reply.interaction?.id != interaction.id) return;
        if (int.customId === "previous") {
          if (currentPage > 1) {
            currentPage--;
            await updateEmbed();
          } else {
            currentPage = totalPages;
            await updateEmbed();
          }
        } else if (int.customId === "next") {
          if (currentPage < totalPages) {
            currentPage++;
            await updateEmbed();
          } else {
            currentPage = 1;
            await updateEmbed();
          }
        }
        await int.deferUpdate();
      } catch (e) {}
    });

    await updateEmbed();
  } catch (e) {
    console.log(e);
  }
}

export async function disableComponents(interaction: CommandInteraction) {
  const reply = await interaction.fetchReply();
  if (!reply) return undefined;
  return interaction.editReply({
    embeds: reply.embeds,
    content: reply.content,
    components: [
      ...reply.components.map((r) => {
        return new ActionRowBuilder<any>().addComponents(
          ...r.components
            .map((c) => {
              if (c.type == ComponentType.Button) {
                return new ButtonBuilder(c.data).setDisabled(true);
              } else if (c.type == ComponentType.RoleSelect) {
                return new RoleSelectMenuBuilder(c.data).setDisabled(true);
              } else if (c.type == ComponentType.UserSelect) {
                return new UserSelectMenuBuilder(c.data).setDisabled(true);
              } else if (c.type == ComponentType.ChannelSelect) {
                return new ChannelSelectMenuBuilder(c.data).setDisabled(true);
              } else if (c.type == ComponentType.StringSelect) {
                return new StringSelectMenuBuilder(c.data).setDisabled(true);
              } else if (c.type == ComponentType.MentionableSelect) {
                return new MentionableSelectMenuBuilder(c.data).setDisabled(
                  true
                );
              } else return undefined;
            })
            .filter((c) => c !== undefined)
        );
      }),
    ],
  });
}
