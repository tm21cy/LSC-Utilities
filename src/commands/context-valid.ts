import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Validate Report")
    .setType(ApplicationCommandType.Message),
};
