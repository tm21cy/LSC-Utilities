import {ApplicationCommand, ApplicationCommandType, ComponentType, Interaction, InteractionType} from "discord.js";
import { log } from "..";
import { v4 as uuidv4 } from "uuid";

/**
 * A collection of handlers for each distinct interaction.
 */
module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction) {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand: {
        switch (interaction.commandType) {
          case ApplicationCommandType.ChatInput: {
            try {
              const command = interaction.client.commands.get(interaction.commandName);
              if (!command) return;
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
            break;
          }
          case ApplicationCommandType.Message: {
            try {
              const command = interaction.client.contexts.get(interaction.commandName);
              if (!command) return;
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
            break;
          }
        }
        break;
      }
      case InteractionType.ModalSubmit: {
        try {
          const prefix = interaction.customId.split("-")[0]
          let modal = interaction.client.modals.get(`${prefix}`)
          if (!modal) return
          await modal.execute(interaction).catch((error: unknown) => {
            const errorId = uuidv4();
            log.error(error, errorId);
            interaction.reply({
                content: `There was an error while executing this command. Error ID: ${errorId}`,
                embeds: [],
                files: [],
              });
          });
        } catch (err: any) {
          const errorId = uuidv4();
          log.error(err, errorId);
          interaction.reply({
            content: `There was an error while executing this command. Error ID: ${errorId}`,
            embeds: [],
            files: [],
          });
        }
      }
      break;
      case InteractionType.MessageComponent: {
        switch (interaction.componentType) {
          case ComponentType.Button: {
            let prefix = interaction.customId.split("-")[0]
            let btn = interaction.client.buttons.get(`${prefix}`);
            if (!btn) return;
            await btn.execute(interaction).catch((error: unknown) => {
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
            break;
          }
        }
      }
    }
  },
};
