import {ModalSubmitInteraction, TextChannel} from "discord.js";
import {log} from "../index";

/**
 * Handles the Invalidate Report reason modal.
 */
module.exports = {
  name: "inv",
  async execute(interaction: ModalSubmitInteraction) {
    try {
      const authorId = interaction.customId.split("-")[1];
      const channelId = interaction.customId.split("-")[2];
      const messageId = interaction.customId.split("-")[3];
      const input = interaction.fields.getTextInputValue("inv");

      const originalChannel = (await interaction.guild?.channels.fetch(
        channelId as string
      )) as TextChannel;

      const originalMessage = await originalChannel.messages.fetch(messageId);

      const thread = originalMessage.thread;

      if (!thread)
        return interaction.reply({
          content:
            "Error: This modal was created on a report or message with no thread.",
          ephemeral: true,
        });

      await thread.delete("Report marked as invalid.");
      await originalMessage.delete();

      await originalChannel.send({
        content: `<@${authorId}>, your report has been marked **invalid**.\n\nReason: ${
          !input || input.length == 0 ? "No reason provided." : input
        }`,
      });

      await interaction.reply({
        content: "Marked invalid",
        ephemeral: true,
      });
    } catch (err: any) {
      log.error(err.stack);
      await interaction.reply({
        content: `Looks like an error occurred - please let a member of Management know if this persists.`,
        ephemeral: true,
      });
    }
  }
}