const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    var member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    var profile = await Profile(db, member.id);
    var balance = profile.coins;

    f.msg(
      message,
      `Баланс **${member.user.tag}** - **${f.discharge(balance)}${
        f.currency
      }**`,
      { color: f.config.defColor }
    );
  }

  #getOptions() {
    return {
      aliases: "bal balance",
      description: "команда для проверки своего или чужого баланса",
      usage: "bal (упоминание участника)",
      enabled: true,
      type: "Экономика",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "balance",
      description: this.options.description,
      options: [
        {
          name: "member_mention",
          description: "упоминание пользователя для просмотра баланса",
          type: 6,
          required: false,
        },
      ],
    };
  }
}
module.exports = Command;
