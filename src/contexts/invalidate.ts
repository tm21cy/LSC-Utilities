import {
  ActionRowBuilder,
  MessageContextMenuCommandInteraction, ModalBuilder,
  NewsChannel,
  TextChannel, TextInputBuilder, TextInputStyle,
  ThreadChannel
} from "discord.js";
import channelIds from "../channelIds";
import {log} from "../index";

/**
 * Handler for the Invalidate Report Context Command
 */
module.exports = {
  name: "Invalidate Report",
  async execute(interaction: MessageContextMenuCommandInteraction) {
    try {
      if (
        !interaction.guild?.members
          .resolve(interaction.user.id)
          ?.roles.cache.has(process.env.IT_ROLE as string) // Set a role for IT in .env if this doesn't work / returns false positives.
      ) {
        return interaction.reply({
          content:
            "You can only use this command if you're on the LSC Investigations Team.",
          ephemeral: true,
        });
      }
      if (
        !channelIds.includes(interaction.channelId) &&
        !(interaction.channel instanceof ThreadChannel)
      ) { // If the channel isn't a report channel, or attached thread, return.
        return interaction.reply({
          content:
            "This is not a report channel - this command would be useless.",
          ephemeral: true,
        });
      }

        const opt = new TextInputBuilder()
          .setLabel("Reason (optional)") // Adds an optional field for denial rationale.
          .setCustomId(`inv`)
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);
        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
          opt
        );
        const modal = new ModalBuilder()
          .setCustomId(
            `inv-${interaction.targetMessage.author.id}-${interaction.channelId}-${interaction.targetMessage.id}`
          )
          .setTitle("Report Invalidation")
          .addComponents(row);

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