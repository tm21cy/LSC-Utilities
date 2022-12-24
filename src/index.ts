/**
 * The index (startup) file of the bot. Alterations to this file will affect command or event handling, bootup instructions, intents, or logging capabilities.
 */

import { Client, Collection, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"
import path from "path" // Aids the filesystem module in resolving directory paths.
import fs from "fs" // Filesystem module.
import pino from "pino" // Allows for error logging.

dotenv.config()

/* Initialize a new Client */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
})

/* Initializes our error logging with Pino */
const log = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            ignore: "pid,hostname"
        }
    }
})

/* Resolve the token if it exists. */
let token = process.env.TOKEN
if (!token) {
    log.fatal("TOKEN environment variable not found. Please add a TOKEN variable, containing the token of the application, to the .env file before starting.")
    process.exit(1) // Force-quit the startup.
}

client.commands = new Collection() // This will typically cause an error, resolved by the module declaration below.

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	client.commands.set(command.data?.name, command) // Synchronizes command execution files into the command handler.
}


const eventsPath = path.join(__dirname, "events")
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file)
	const event = require(filePath)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args)) // Synchronizes and handles once events.
	} else {
		client.on(event.name, (...args) => event.execute(...args)) // Synchronizes and handles on events.
	}
}

// Error Handler

process.on("unhandledRejection", (err: Error) => {
  log.error(err.stack);
});

const debug = false;
if (debug) {
  client.on("debug", console.log);
}

declare module "discord.js" {
	export interface Client {
		commands: Collection<unknown, any> // This declares a command attribute on the Client interface, which resolves null pointing during typical execution.
	}
}

client.login(token as string) // Coerce to string to ensure the token is read appropriately.

export { client, log }