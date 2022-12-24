import {
  ActionRowBuilder,
  Interaction,
  ModalBuilder,
  NewsChannel,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  ThreadChannel,
} from "discord.js";
import { log } from "..";
import channelIds from "../channelIds";

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction) {
    if (interaction.isContextMenuCommand()) {
      try {
        if (
          !interaction.guild?.members
            .resolve(interaction.user.id)
            ?.roles.cache.has("929524295435173958")
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
        ) {
          return interaction.reply({
            content:
              "This is not a report channel - this command would be useless.",
            ephemeral: true,
          });
        }
        if (
          interaction.commandName == "Invalidate Report" &&
          interaction.isMessageContextMenuCommand()
        ) {
          const opt = new TextInputBuilder()
            .setLabel("Reason (optional)")
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
        } else if (
          interaction.commandName == "Validate Report" &&
          interaction.isMessageContextMenuCommand()
        ) {
          if (
            (interaction.channel instanceof TextChannel || interaction.channel instanceof NewsChannel) &&
            interaction.targetMessage.hasThread
          ) {
            interaction.targetMessage.thread?.send({
              content: `<@${interaction.targetMessage.author.id}>, your report has been marked **valid** by ${interaction.user.tag}.`,
            });
            interaction.reply({
              content: "Marked valid.",
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content:
                "Please use this command on the original message, not in the thread.",
              ephemeral: true,
            });
          }
        }
      } catch (err: any) {
        log.error(err.stack);
        interaction.reply({
          content: `Looks like an error occurred - please let a member of Management know if this persists.`,
          ephemeral: true,
        });
      }
    }
  },
};
