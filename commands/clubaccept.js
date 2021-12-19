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
      return f.msgFalse(message, "Вы не указали участника для кика из клуба.");

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();
    let club = clubs_data.filter(
      (club) =>
        club.owner === message.author.id ||
        club.admins?.includes(message.author.id)
    )[0];

    if (!club) return f.msgFalse(message, "Вы не управляете ни одним клубом.");

    if (!club.requests?.includes(member.id))
      return f.msgFalse(
        message,
        `**${member.user.tag}** Не подавал заявку в ваш клуб.`
      );
    if (club.banneds?.includes(member.id))
      return f.msgFalse(
        message,
        `**${member.user.tag}** Забанен в этом клубе.`
      );

    for (let other_club of clubs_data) {
      let all_members = [
        ...new Set(
          other_club.members.concat(other_club.admins || [], [other_club.owner])
        ),
      ];

      if (all_members.includes(member.id)) {
        f.msgFalse(message, `**${member.user.tag}** Уже состоит в клубе.`);

        club.requests.splice(club.requests.indexOf(member.id), 1);

        clubs_db.updateOne(
          {
            owner: club.owner,
          },
          {
            $set: {
              requests: club.requests,
            },
          }
        );

        return;
      }
    }

    club.members.push(member.id);
    club.requests.splice(club.requests.indexOf(member.id), 1);
    clubs_db.updateOne(
      {
        owner: club.owner,
      },
      {
        $set: {
          members: club.members,
          requests: club.requests,
        },
      }
    );

    f.msg(message, `Вы успешно приняли **${member.user.tag}** в свой клуб.`);
  }

  #getOptions() {
    return {
      aliases: "clubaccept",
      description: "принять человека в свой клуб",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "clubaccept",
      description: this.options.description,
    };
  }
}
module.exports = Command;
