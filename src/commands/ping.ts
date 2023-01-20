import { Stopwatch } from "@sapphire/stopwatch";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DurationFormatter } from "@sapphire/time-utilities";

/**
 * Returns the websocket ping and message latency as distinct values.
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with the websocket latency."),
  async execute(interaction: CommandInteraction) {
    try {
      await interaction.reply("📡 Ping 1");
      const stopwatch = new Stopwatch().start();
      await interaction.editReply("🛰️ Ping 2");
      stopwatch.stop(); // Tracks message latency.

      const client = interaction.client;
      const wsPing = interaction.client.ws.ping; // Ping to the API.
      const uptime = new DurationFormatter().format(client.uptime); // Instance uptime.

      interaction.editReply(
        `⏱️ Message Latency: ${stopwatch.toString()}\n🛰️ Websocket Latency: ${wsPing}ms\n🔌 Uptime: ${uptime}`
      );
    } catch (err) {
      interaction.reply({
        content: `Looks like an error occurred - please let a member of Management know if this persists.`,
        ephemeral: true,
      });
    }
  },
};
