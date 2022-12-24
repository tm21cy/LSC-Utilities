import {
  EmbedBuilder,
  Interaction,
  ModalSubmitInteraction,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { log } from "..";
import * as data from "../reportChannels.json";

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;
    try {
      if (interaction.customId.startsWith("details")) {
        const input = interaction.fields.getTextInputValue("details");
        const opt = interaction.customId.split("-")[1];
        let channel;
        switch (opt) {
          case "server":
            channel = data.server;
            break;
          case "tos":
            channel = data.tos;
            break;
          case "raid":
            channel = data.raid;
            break;
          case "nuke":
            channel = data.nuke;
            break;
          case "dm":
            channel = data.dm;
            break;
          case "scam":
            channel = data.scam;
            break;
          case "nsfw":
            channel = data.nsfw;
            break;
          case "staff":
            channel = data.staff;
            break;
          case "other":
            channel = data.other;
            break;
          case "admin":
            channel = data.admin;
            break;
          default:
            return;
        }

        const embed = new EmbedBuilder()
          .setTitle("Anonymous Report")
          .setColor("Red")
          .setDescription(input)
          .setFooter({
            text: "Anonymous Report | Please click all media links to view them.",
          });

        interaction.guild?.channels.fetch(channel)?.then((channel) => {
          if (channel?.isTextBased())
            channel.send({ embeds: [embed] }).then(() =>
              interaction.reply({
                content: "Your anonymous report has been submitted.",
                ephemeral: true,
              })
            );
        });
      }
      if (interaction.customId.startsWith("inv")) {
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

        thread.delete("Report marked as invalid.");
        originalMessage.delete();

        originalChannel.send({
          content: `<@${authorId}>, your report has been marked **invalid**.\n\nReason: ${
            !input || input.length == 0 ? "No reason provided." : input
          }`,
        });

        interaction.reply({
          content: "Marked invalid",
          ephemeral: true,
        });
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
