const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    let item_name = args.join(" ");
    if (!item_name)
      return f.msgFalse(
        message,
        `Вы не указали название предмета для его использования.\nИспользование: ${this.options.usage}`
      );

    let items_db = db.collection("shop");
    let items_data = await items_db.find().toArray();

    let item = items_data.filter(
      (item) => item.name.toLowerCase() === item_name.toLowerCase()
    )[0];
    if (!item) return f.msgFalse(message, "Вы указали несуществующий предмет.");

    let author = await Profile(db, message.author.id);
    let inv = author.getData().inventory;
    let item_inv = inv.filter((inv_item) => inv_item.id === item.id)[0];
    if (!item_inv)
      return f.msgFalse(message, "У вас отсуствует выбранный предмет.");

    f.msg(message, `Вы успешно использовали предмет **${item.name}**`);
    f.splice_item(db, message.author.id, item.id, 1);

    if (item.role) {
      try {
        message.member.roles.add(item.role);
      } catch (e) {}
    }

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
            icon_url: message.author.displayAvatarURL({ dynamic: true }),
          },
          description: embed_message,
          color: f.config.defColor,
          timestamp: new Date(),
        });

        message.channel.send(def_message, { embed: embed });
      } else {
        message.channel.send(item.message);
      }
    }
  }

  #getOptions() {
    return {
      aliases: "use item-use",
      description: "использовать имеющийся у вас предмет",
      usage: "use [название предмета]",
      enabled: true,
      type: "Магазин",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "item-use",
      description: this.options.description,
    };
  }
}
module.exports = Command;
