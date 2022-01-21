const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();

    let club = clubs_data.filter(
      club =>
        club.owner === message.author.id ||
        club.admins?.includes(message.member.id)
    )[0];
    if (!club) return f.msgFalse(message, "Вы не управляете никаким клубом.");

    if (!club.banneds?.[0])
      return f.msgFalse(message, "Список забаненных пуст.");
  }

  #getOptions() {
    return {
      aliases: "clubbans",
      description: "просмотреть список забаненных участников в вашем клубе",
      enabled: true,
      type: "WIP",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "clubbans",
      description: this.options.description
    };
  }
}
module.exports = Command;
