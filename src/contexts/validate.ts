import {
  MessageContextMenuCommandInteraction,
  NewsChannel,
  TextChannel,
  ThreadChannel
} from "discord.js";
import channelIds from "../channelIds";
import {log} from "../index";

/**
 * Handler for the Validate Report Context Command.
 */
module.exports = {
  name: "Validate Report",
  async execute(interaction: MessageContextMenuCommandInteraction) {
    try {
      if (
        !interaction.guild?.members
          .resolve(interaction.user.id)
          ?.roles.cache.has(process.env.IT_ROLE as string) // Same as Invalidate, make sure to set this in .env
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
        (interaction.channel instanceof TextChannel || interaction.channel instanceof NewsChannel) &&
        interaction.targetMessage.hasThread
      ) { // If the channel holds true for (TextChannel OR NewsChannel) AND hasThread
        interaction.targetMessage.thread?.send({
          content: `<@${interaction.targetMessage.author.id}>, your report has been marked **valid** by ${interaction.user.tag}.`,
        });
        await interaction.reply({
          content: "Marked valid.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "Please use this command on the original message, not in the thread.",
          ephemeral: true,
        });
      }
    } catch (err: any) {
      log.error(err.stack);
      await interaction.reply({
        content: `Looks like an error occurred - please let a member of Management know if this persists.`,
        ephemeral: true,
      });
    }
  }
}