import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {log} from "../index";

/**
 * Button handler for anon-start, which is submitted on an anonymous report start.
 */
module.exports = {
  name: "anon_start",
  async execute(interaction: ButtonInteraction) {
    try {
      const opt = interaction.customId.split("-")[1]; // Grab the channel option
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
    } catch (err: any) {
      log.error(err.stack);
      await interaction.reply({
        content: `Looks like an error occurred - please let a member of Management know if this persists.`,
        ephemeral: true,
      });
    }
  }
}