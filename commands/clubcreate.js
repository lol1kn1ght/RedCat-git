const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    let club_name = args.join(" ");
    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();
    let author_club = clubs_data.filter(
      (club) =>
        (club && club.members?.includes(message.author.id)) ||
        club.owner === message.author.id
    )[0];
    if (author_club)
      return f.msgFalse(message, "Вы уже состоите в другом клубе.");
    let same_names = clubs_data.filter(
      (club) => club.name.toLowerCase() === club_name.toLowerCase()
    )[0];
    if (same_names)
      return f.msgFalse(message, "Клуб с таким именем уже существует.");
    if (club_name.legnth > 20)
      return f.msgFalse(
        message,
        "Название клуба слишком длинное. Максимальная длинна - 20 символов."
      );
    if (!args[0]) return f.msgFalse(message, "Вы не указали название клуба.");
    f.msg(message, `Вы успешно создали клуб с названием **${club_name}**`, {
      color: f.config.defColor,
    });

    let club_data = {
      name: club_name,
      owner: message.author.id,
      description: false,
      members: [message.author.id],
      requests: [],
      admins: [],
      inventory: [],
      level: 1,
      money: 0,
    };
    clubs_db.insertOne(club_data);
  }

  #getOptions() {
    return {
      aliases: "clubcreate",
      description: "создать свой клуб",
      enabled: true,
      type: "Клубы",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: ["666311313806589977"],
    };
  }

  #getSlashOptions() {
    return {
      name: "clubcreate",
      description: this.options.description,
    };
  }
}
module.exports = Command;
