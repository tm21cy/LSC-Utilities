import {
  ChatInputCommandInteraction,
  CommandInteraction,
  PermissionsBitField,
  Role,
  SlashCommandBuilder,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Commands used to handle roles.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a role to a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to add a role to.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to add.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a role from a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("the user to remove a role from.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to add.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-pingable")
        .setDescription("Sets a role to either pingable or unpingable.")
        .addRoleOption((option) =>
          option
            .setName("target")
            .setDescription("The role to change.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("state")
            .setDescription("True for pingable, false for unpingable.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Removes a role from the server.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to delete.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Creates a new role.")
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription("Hex color, formatted as rrggbb without #.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the role.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("pingable")
            .setDescription("Whether this role should be pingable or not.")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (
        !(interaction.member?.permissions as PermissionsBitField).has(
          PermissionsBitField.Flags.ManageRoles
        )
      ) {
        return interaction.reply({
          content:
            "You can't use this command! Only users with `Manage Roles` can use this command.",
          ephemeral: true,
        });
      }
      if (interaction.options.getSubcommand() === "add") {
        const user = interaction.options.getUser("target", true);
        const role = interaction.options.getRole("role", true) as Role;
        interaction.guild?.members.fetch(user).then((user) =>
          user.roles.add(role).then(() => {
            interaction.reply({
              content: `Role ID ${role.id} \`(${role.name})\` added to ${user.displayName}.`,
            });
          })
        );
      }
      if (interaction.options.getSubcommand() === "remove") {
        const user = interaction.options.getUser("target", true);
        const role = interaction.options.getRole("role", true) as Role;
        interaction.guild?.members.fetch(user).then((user) => {
          if (!user.roles.cache.some((r) => r.id === role.id)) {
            return interaction.reply({
              content: "The user targeted does not currently hold this role.",
              ephemeral: true,
            });
          } else {
            user.roles.remove(role).then(() =>
              interaction.reply({
                content: `Role ID ${role.id} \`(${role.name})\` removed from ${user.displayName}.`,
              })
            );
          }
        });
      }
      if (interaction.options.getSubcommand() === "set-pingable") {
        const state = interaction.options.getBoolean("state", true);
        const role = interaction.options.getRole("target", true) as Role;
        interaction.guild?.roles.fetch(role.id)?.then((role) => {
          role?.setMentionable(state).then(() => {
            interaction.reply({
              content: `Role ID ${role.id} \`(${role.name})\ mentionable now set to ${state}.`,
            });
          });
        });
      }
      if (interaction.options.getSubcommand() === "delete") {
        const role = interaction.options.getRole("role", true) as Role;
        interaction.guild?.roles.delete(role).then(() =>
          interaction.reply({
            content: `Role ID ${role.id} \`(${role.name})\` removed from server.`,
          })
        );
      }
      if (interaction.options.getSubcommand() === "create") {
        let color = interaction.options.getString("color", true);
        const name = interaction.options.getString("name", true);
        const pingable = interaction.options.getBoolean("pingable", true);

        if (color.startsWith("#")) color = color.slice(1);

        interaction.guild?.roles
          .create({
            name: name,
            mentionable: pingable,
            color: Number(`0x${color}`),
          })
          .then((role) => {
            interaction.reply({
              content: `Role created:\nRole Name: ${role.name}\nRole Color: ${color}\nMentionable: ${pingable}`,
            });
          });
      }
    } catch (err) {
      interaction.reply({
        content: `Looks like an error occurred - please let a member of Management know if this persists.`,
        ephemeral: true,
      });
    }
  },
};
