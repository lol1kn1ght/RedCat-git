class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0]));

    if (!member)
      return f.msgFalse(
        message,
        `Не указан участник.\nИспользование: \`${this.options.usage}\``
      );

    args.splice(0, 1);

    let item_name = args.join(" ").trim();
    if (!item_name)
      return f.msgFalse(
        message,
        `Вы не указали название предмета.\nИспользование: \`${this.options.usage}\``
      );

    let member_data = (await Profile(db, member.id)).data || {};
    let inventory = member_data.inventory || [];

    if (!inventory[0])
      return f.msgFalse(message, `У указанного участника инвентарь пуст.`);

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

      item_name = args
        .join(" ")
        .toLowerCase()
        .trim();
      item = shop_data.filter(item => item.name.toLowerCase() === item_name)[0];

      if (!item)
        return f.msgFalse(message, `Вы указали несуществующий предмет.`);
    }

    f.splice_item(db, member.id, item.id, isNaN(amount) ? undefined : amount);

    f.msg(
      message,
      `Вы успешно забрали у **${member.user.tag} ${
        isNaN(amount) ? 1 : amount
      }x ${item.name}**`
    );
  }

  #getOptions() {
    return {
      aliases: "take-item",
      description: "забрать предмет из инвентаря участника",
      usage:
        "take-item [упоминание участника] [название предмета] (количество)",
      enabled: true,
      type: "WIP",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "take-item",
      description: this.options.description,
      options: [
        {
          name: "member_id",
          description: "айди участника",
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
          required: false
        }
      ]
    };
  }
}
module.exports = Command;
