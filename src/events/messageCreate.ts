import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import channelIds from "../channelIds";
import roleids from "../roleids";


module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message: Message) {
    if (
      !channelIds.includes(message.channel.id) ||
      (message.author.bot && message.embeds.length == 0)
    )
      return;

    const source = message.content;
      const regex = /^[0-9]{13,}$/g;
    let result = source.match(regex);
    let set = [...new Set(result)];
    let resarr = Array.from(set).filter(a => {
      return !roleids.includes(a);
    })
    if (resarr && resarr.length != 0) {
      message.channel.send({
        content: `${resarr.join(" ")}`,
      });
    }
    message
      .startThread({
        name: `${message.author.tag} - Report Thread`,
      })
      .then((thread) => {
        const embed = new EmbedBuilder()
          .setTitle("Report Thread")
          .setDescription(
            `${message.author.tag}, thanks for your report. A member of the Investigations Team will be here shortly to validate or invalidate the details of your report. Please feel free to use this thread to discuss the report with other users or members of our staff team.\n\nIf your report has not been validated in over 48 hours, please contact a member of IT or Management. Thank you.`
          )
          .setColor("Blurple");
        thread.send({
          content: `<@${message.author.id}>`,
          embeds: [embed],
        });
      });
  },
};
