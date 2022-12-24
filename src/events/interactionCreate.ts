import { Interaction } from "discord.js";
import { log } from "..";
import { v4 as uuidv4 } from "uuid";
module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction).catch((error: unknown) => {
        const errorId = uuidv4();
        log.error(error, errorId);
        interaction.deferred
          ? interaction.editReply({
              content: `There was an error while executing this command. Error ID: ${errorId}`,
              embeds: [],
              files: [],
            })
          : interaction.reply({
              content: `There was an error while executing this command. Error ID: ${errorId}`,
              embeds: [],
              files: [],
            });
      });
    } catch (error) {
      const errorId = uuidv4();
      log.error(error, errorId);
      interaction.deferred
        ? interaction.editReply({
            content: `There was an error while executing this command. Error ID: ${errorId}`,
            embeds: [],
            files: [],
          })
        : interaction.reply({
            content: `There was an error while executing this command. Error ID: ${errorId}`,
            embeds: [],
            files: [],
          });
    }
  },
};
