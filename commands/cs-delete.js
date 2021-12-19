class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let item_name = args.join(" ");
    if (!item_name)
      return f.msgFalse(message, "Вы не указали название предмета.");

    let shop_db = db.collection("clubs_shop");
    let shop_data = await shop_db.find().toArray();

    let item = shop_data.filter(
      item => item.name.toLowerCase() === item_name.toLowerCase()
    )[0];

    if (!item) return f.msgFalse(message, "Вы указали несуществующий предмет.");

    shop_db.deleteOne({
      id: item.id
    });

    f.msg(message, `Успешно удален предмет **${item.name}**!`);
  }

  #getOptions() {
    return {
      aliases: "cs-delete club-shop-delete",
      description: "Удалить предмет из магазина",
      usage: "cs-delete [название предмета]",
      enabled: true,
      type: "Магазин Клубов",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "club-shop-delete",
      description: this.options.description,
      options: [
        {
          name: "item_name",
          description: "название предмета",
          type: 3,
          required: true
        }
      ]
    };
  }
}
module.exports = Command;
