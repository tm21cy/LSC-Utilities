import { Client } from "discord.js";
import { log } from "..";

module.exports = {
  name: "ready",
  once: true,
  execute(client: Client) {
    log.info(
		`Client ready with ${client.users.cache.size} users across ${client.guilds.cache.size} guilds.\n\n${client.guilds.cache.toJSON()}`
	  );
  },
};
