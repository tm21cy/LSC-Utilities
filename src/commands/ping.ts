import { Stopwatch } from "@sapphire/stopwatch";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DurationFormatter } from "@sapphire/time-utilities";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with the websocket latency."),
  async execute(interaction: CommandInteraction) {
    try {
      await interaction.reply("📡 Ping 1");
      const stopwatch = new Stopwatch().start();
      await interaction.editReply("🛰️ Ping 2");
      stopwatch.stop();

      const client = interaction.client;
      const wsPing = interaction.client.ws.ping;
      const uptime = new DurationFormatter().format(client.uptime);

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
