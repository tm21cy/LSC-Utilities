import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";

/**
 * Builder for the "Invalidate Report" Context Command.
 */
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Invalidate Report")
    .setType(ApplicationCommandType.Message),
};
