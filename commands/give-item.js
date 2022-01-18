class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    let usage = `\nИспользование: \`${this.options.usage}\``;

    let member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0]));

    if (!member) return f.msgFalse(message, "Вы не указали участника." + usage);

    args.splice(0, 1);

    let item_name = args
      .join(" ")
      .toLowerCase()
      .trim();

    if (!item_name)
      return f.msgFalse(message, "Вы не указали название предмета." + usage);

    let shop_db = db.collection("shop");
    let shop_data = await shop_db.find().toArray();

    let item = shop_data.filter(
      item => item.name.toLowerCase() === item_name
    )[0];
    if (!item) {
      var amount = Number(args[args.length - 1]);

      if (!isNaN(amount)) {
        args.splice(args.length - 1, 1);
      }
      item_name = args.join(" ").trim();

      item = shop_data.filter(item => item.name.toLowerCase() === item_name)[0];

      if (!item)
        return f.msgFalse(message, "Вы указали несуществующий предмет.");
    }

    f.push_item(db, member.id, item.id, isNaN(amount) ? undefined : amount);
    f.msg(
      message,
      `Вы успешно добавили участнику **${member.user.tag}** **${
        isNaN(amount) ? 1 : amount
      }x** **${item.name}**`
    );
  }

  #getOptions() {
    return {
      aliases: "give-item",
      description: "выдать кому-то предмет из магазина.",
      usage:
        "give-item [упоминание участника] [название предмета] (количество предметов)",
      enabled: true,
      type: "Магазин",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "give-item",
      description: this.options.description,
      options: [
        {
          name: "member_id",
          description: "айди",
          type: 3,
          required: true
        },
        {
          name: "item_name",
          description: "название предмета",
          type: 3,
          required: true
        },
        {
          name: "amount",
          description: "количество предметов",
          type: 4,
          required: true
        }
      ]
    };
  }
}
module.exports = Command;
