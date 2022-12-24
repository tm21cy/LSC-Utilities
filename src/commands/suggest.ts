import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest a new feature or improvement to LSC.")
    .addStringOption((option) =>
      option
        .setName("suggestion")
        .setDescription("The suggestion you want to submit")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.getString("suggestion", true);
    const suggestions = (await interaction.guild?.channels.fetch(
      "846683365402738698"
    )) as TextChannel;

    const embed = new EmbedBuilder()
      .setTitle(`New Suggestion`)
      .setDescription(`${input}\n\nSubmitted by: <@${interaction.user.id}>`)
      .setFooter({ text: "Please vote with the appropriate emoji." })
      .setColor("Red");

    suggestions.send({ embeds: [embed] }).then((message) => {
      message.react("<:check:926693392656765139>");
      message.react("➖");
      message.react("<:cancel:923749063348858900>");
    });

    interaction.reply({
      content: "Done!",
      ephemeral: true,
    });
  },
};
