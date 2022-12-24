import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Invalidate Report")
    .setType(ApplicationCommandType.Message),
};
