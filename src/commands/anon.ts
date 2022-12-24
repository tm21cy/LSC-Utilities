import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anon-report")
    .setDescription("Create an anonymous report against a user")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The report category.")
        .addChoices(
          {
            name: "Server Report",
            value: "server",
          },
          {
            name: "TOS Violator",
            value: "tos",
          },
          {
            name: "Raid/Raiders Report",
            value: "raid",
          },
          {
            name: "Nuke/Nukers Report",
            value: "nuke",
          },
          {
            name: "DM Advertising",
            value: "dm",
          },
          {
            name: "Scam/Scammer Report",
            value: "scam",
          },
          {
            name: "NSFW Report",
            value: "nsfw",
          },
          {
            name: "Bad Staff Report",
            value: "staff",
          },
          {
            name: "Other",
            value: "other",
          },
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const opt = interaction.options.getString("category");
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Start")
          .setStyle(ButtonStyle.Success)
          .setCustomId(`anon-start-${opt}`)
      );
      const embed = new EmbedBuilder()
        .setTitle("Anonymous Report")
        .setDescription(
          "When you have gathered all of your evidence, please click the Start button to initiate an anonymous report modal. Please have **image links** ready, not raw images. You will be asked to input your report into a text box in a private modal - no user information is stored regarding this report. Please note that your report must fit inside one modal text input - for any longer reports, we suggest using a Google Doc or other file hosting service.\n\nWhen you feel ready, click Start to begin. Please note: abuse of this system may result in a ban from LSC."
        )
        .setColor("Blurple");
      interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });
    } catch (err) {
      interaction.reply({
        content: `Looks like an error occurred - please let a member of Management know if this persists.`,
        ephemeral: true,
      });
    }
  },
};
