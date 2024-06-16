import { Command, CommandData } from "../lib/Discord";
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export class Suggest extends Command {
  constructor() {
    super({
      name: "suggest",
      description: "Open a modal to submit a new suggestion.",
      admninistratorOnly: false,
      developerOnly: false,
    });
  }

  override async execute({ client, executor, interaction }: CommandData) {
    const modal = new ModalBuilder()
      .setCustomId(`suggestion`)
      .setTitle("Create Suggestion");

    const titleRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("title")
          .setLabel("Title")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMinLength(5)
      );
    const descriptionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Description")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMinLength(15)
      );

    modal.addComponents(titleRow, descriptionRow);

    await interaction.showModal(modal);
  }
}
