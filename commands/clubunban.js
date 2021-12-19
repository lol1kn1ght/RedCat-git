const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let member =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.guild.members.cache.find(
        (guild_member) =>
          guild_member.user.tag.toLowerCase() === args.join(" ").toLowerCase()
      );

    if (!member)
      return f.msgFalse(message, "Вы не указали участника для разбана.");

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();

    let club = clubs_data.filter(
      (club) =>
        club.owner === message.author.id ||
        club.admins?.includes(message.author.id)
    )[0];

    if (!club) return f.msgFalse(message, "Вы не управляете ни одним клубом.");

    if (!club.banneds?.includes(member.id))
      return f.msgFalse(
        message,
        "Выбранный участник не забанен в вашем клубе."
      );

    club.banneds?.splice(club.banneds.indexOf(member.id), 1);

    clubs_db.updateOne(
      {
        owner: club.owner,
      },
      {
        $set: {
          banneds: club.banneds,
        },
      }
    );

    f.msg(
      message,
      `Вы успешно разбанили **${member.user.tag}** в своем клубе.`
    );
  }

  #getOptions() {
    return {
      aliases: "clubunban",
      description: "разбанить забаненного в вашем клубе участника",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "clubunban",
      description: this.options.description,
    };
  }
}
module.exports = Command;
