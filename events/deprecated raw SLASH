const f = require("../config/modules");

class Event {
  constructor() {}

  async execute(bot, mongo, event) {
    if (event.t !== "INTERACTION_CREATE" || !f.config.slash_commands) return;
    let interaction = event.d;
    let slash_response = content => {
      bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: content
          }
        }
      });
    };

    let db = mongo.db(interaction.guild_id);
    let args;
    if (interaction.data.options)
      args = interaction.data.options.map(val => val.value);
    else args = [];
    args = args.join(" ").split(` `);
    let i = interaction;
    let guild = bot.guilds.cache.get(interaction.guild_id);

    let interaction_name = interaction.data.name;
    let commands_names = Object.keys(Bot.commands);
    let command_name = commands_names.filter(name =>
      name.split(` `).includes(interaction_name)
    )[0];

    let command = Bot.commands[command_name];
    let command_options = command.options;
    if (!command) return;

    let message = {
      author: guild.members.cache.get(i.member.user.id).user,
      member: guild.members.cache.get(i.member.user.id),
      guild: guild,
      channel: guild.channels.cache.get(i.channel_id),
      mentions: {
        channels: new Discord.Collection(),
        members: new Discord.Collection()
      }
    };

    let check_permission = f.checkMemberPerms(
      message.member,
      message,
      command.options.type,
      {permissions: command_options.permissions},
      {channels: command_options.allowedChannels},
      {roles: command_options.allowedRoles}
    );

    if (!check_permission)
      return slash_response(":x: У вас недостаточно прав.");
    slash_response(`Выполняю команду ${interaction.data.name}`);

    let settings_db = db.collection("settings");
    let settings_data = await settings_db
      .find({guildID: message.guild.id})
      .toArray();
    let settings = settings_data[0] || {};
    f.server_settings = settings;

    f.prefix = settings.preifx || f.config.prefix;

    await command.execute(bot, message, args, mongo);
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
