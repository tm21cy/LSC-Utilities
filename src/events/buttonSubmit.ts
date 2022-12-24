import {
  ActionRowBuilder,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { log } from "..";

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    try {
      if (interaction.customId.startsWith("anon-start")) {
        const opt = interaction.customId.split("-")[2];
        const modal = new ModalBuilder()
          .setTitle("Anonymous Report")
          .setCustomId(`details-${opt}`);

        const input = new TextInputBuilder()
          .setCustomId("details")
          .setLabel("Report Details:")
          .setRequired(true)
          .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>().setComponents(
          input
        );

        modal.addComponents(row);

        await interaction.showModal(modal);
      }
    } catch (err: any) {
      log.error(err.stack);
      interaction.reply({
        content: `Looks like an error occurred - please let a member of Management know if this persists.`,
        ephemeral: true,
      });
    }
  },
};
