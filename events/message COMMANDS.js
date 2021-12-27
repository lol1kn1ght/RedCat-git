const f = require("../config/modules");

class Event {
  constructor() {}

  async execute(bot, mongo, message) {
    if (
      !message.content.startsWith(f.config.prefix) ||
      message.author.bot ||
      message.channel.type === "dm"
    )
      return;
    var args = message.content.split(` `);
    var command = args[0].replace(f.config.prefix, ``).toLowerCase();
    args.splice(0, 1);

    try {
      var commands = Object.keys(Bot.commands);
      var commandName = commands.filter(val =>
        val.split(" ").includes(command)
      )[0];
      if (!commandName) return;
      var Command = Bot.commands[commandName];

      if (
        (!f.config.allowed_types.includes(Command.options.type) ||
          Command.options.type === "WIP") &&
        message.author.id !== f.config.owner
      )
        return;

      let db = mongo.db(message.guild.id).collection("settings");
      let guild_settings = await db.find({guildID: message.guild.id}).toArray();
      f.server_settings = guild_settings[0] || {};

      f.prefix = guild_settings.prefix || f.config.prefix;

      let command_options = Command.options;

      let check_permission = f.checkMemberPerms(
        message.member,
        message,
        Command.options.type,
        {permissions: command_options.permissions},
        {channels: command_options.allowedChannels},
        {roles: command_options.allowedRoles}
      );

      if (!check_permission) return message.react("❌");

      Command.execute(bot, message, args, mongo);
    } catch (e) {
      console.error(e);
      bot.users.cache.get(f.config.owner).send(`Ошибка в ${command}: ${e}`);
    }
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
