import fs from "fs"
import path from "path"
import { Routes } from "discord.js"
import { REST } from "@discordjs/rest"
import { log } from "."
import { Stopwatch } from "@sapphire/stopwatch"

require("dotenv").config()

class Command {
    name: string
    description: string

    constructor(name: string, description: string) {
        this.name = name
        this.description = description
    }
}

const commands: any = []
const cmdData: Command[] = []
const cols = ["name", "description"]
const commandsPath = path.join(__dirname, "commands")



const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	commands.push(command.data.toJSON())
    cmdData.push(new Command(command.data.name, command.data.description))
}
console.table(cmdData, cols)
log.info(`Found ${commands.length} commands. Registering...`)
const time = new Stopwatch()

const rest = new REST({ version: "10" }).setToken(
	process.env.TOKEN as string
)

rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), { body: commands })
	.then(() => {
		log.info(`Successfully registered ${commands.length} commands in ${time.toString()}`)
	})
	.catch((error) => {
		time.stop()
		log.error(error, "Failed to register application commands.")
	})