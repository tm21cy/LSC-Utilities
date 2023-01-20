import {EmbedBuilder, ModalSubmitInteraction} from "discord.js";
import * as data from "../reportChannels.json";
import {log} from "../index";

/**
 * Handles the anon report details modal.
 */
module.exports = {
  name: "details",
  async execute(interaction: ModalSubmitInteraction) {
    try {
      const input = interaction.fields.getTextInputValue("details");
      const opt = interaction.customId.split("-")[1];
      let channel; // Is this incredibly slow? Yes. Have I tried my best effort to *not* make it slow? Also yes.
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
    } catch (err: any) {
      log.error(err.stack);
      await interaction.reply({
        content: `Looks like an error occurred - please let a member of Management know if this persists.`,
        ephemeral: true,
      });
    }
  }
}