const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();

    let club = clubs_data.filter(
      club =>
        club?.admins.includes(message.author.id) ||
        club.owner === message.author.id
    )[0];
    if (!club)
      return f.msgFalse(
        message,
        "У вас нет клуба которым вы можете управлять."
      );

    let item_name = args.join(" ");
    if (!item_name)
      return f.msgFalse(
        message,
        `Вы не указали название предмета для его использования.\nИспользование: ${this.options.usage}`
      );

    let items_db = db.collection("clubs_shop");
    let items_data = await items_db.find().toArray();

    let item = items_data.filter(
      item => item.name.toLowerCase() === item_name.toLowerCase()
    )[0];
    if (!item) return f.msgFalse(message, "Вы указали несуществующий предмет.");

    let inv = club.inventory || [];
    let item_inv = inv.filter(inv_item => inv_item.id === item.id)[0];
    if (!item_inv)
      return f.msgFalse(message, "В вашем клубе отсуствует выбранный предмет.");

    f.msg(message, `Вы успешно использовали предмет **${item.name}**`);
    f.club_inv_splice(db, club, item.id, 1);

    if (item.message) {
      if (item.message.includes("$$")) {
        let split_message = item.message.split("$$");

        let def_message = split_message[0];
        let embed_message = split_message[1];

        if (!def_message || !embed_message)
          return message.channel.send(item.message);

        let embed = new Discord.MessageEmbed({
          author: {
            name: message.author.tag,
            icon_url: message.author.displayAvatarURL({dynamic: true})
          },
          description: embed_message,
          color: f.config.defColor,
          timestamp: new Date()
        });

        message.channel.send(def_message, {embed: embed});
      } else {
        message.channel.send(item.message);
      }
    }
  }

  #getOptions() {
    return {
      aliases: "clubuse club-use",
      description: "использовать имеющийся в вашем клубе предмет",
      usage: "use [название предмета]",
      enabled: true,
      type: "Магазин Клубов",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "club-use",
      description: this.options.description
    };
  }
}
module.exports = Command;
