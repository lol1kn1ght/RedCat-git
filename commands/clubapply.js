const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let club_name = args.join(" ").toLowerCase();
    if (!club_name)
      return f.msgFalse(
        message,
        "Вы не указали название клуба куда подать заявку."
      );

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();
    let club = clubs_data.filter(
      (club) => club.name.toLowerCase() === club_name
    )[0];

    if (!club) return f.msgFalse(message, "Вы указали несуществующий клуб.");
    if (club.banneds?.includes(message.author.id))
      return f.msgFalse(message, "Вы были забанены в этом клубе.");

    for (let other_club of clubs_data) {
      let all_members = [
        ...new Set(
          other_club.members.concat(other_club.admins || [], [other_club.owner])
        ),
      ];
      if (all_members.includes(message.author.id))
        return f.msgFalse(message, "Вы уже состоите в каком-то клубе.");
    }

    if (club.requests.includes(message.author.id))
      return f.msgFalse(
        message,
        `Вы уже подали заявку в этот клуб.\nОтменить все свои заявки в клубы можно через команду \`${f.prefix}clubsreject\``
      );

    club.requests.push(message.author.id);

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

    f.msg(message, `Вы успешно подали заявку в **${club.name}**`);
  }

  #getOptions() {
    return {
      aliases: "clubapply",
      description: "подать заявку в какой-то клуб",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "clubapply",
      description: this.options.description,
    };
  }
}
module.exports = Command;
