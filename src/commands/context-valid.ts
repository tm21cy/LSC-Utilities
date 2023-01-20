import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";

/**
 * Builder for the "Validate Report" Context Command.
 */
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Validate Report")
    .setType(ApplicationCommandType.Message),
};
