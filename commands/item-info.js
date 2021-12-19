class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let item_name = args.join(" ").toLowerCase();
    if (!item_name)
      return f.msg(
        message,
        `Вы не указали название предмета.\nИспользование: ${this.options.usage}`
      );

    let items_db = db.collection("shop");
    let items = await items_db.find().toArray();
    let item = items.filter((item) => item.name.toLowerCase() === item_name)[0];

    if (!item) return f.msgFalse(message, "Вы указали несуществующий предмет.");

    let message_arr = item.message ? item.message.split("$$") : [];

    if (item.role && !item.role.push) item.role = [item.role];

    let info_embed = new Discord.MessageEmbed()
      .setTitle(`Информация о предмете:`)
      .setColor(f.config.defColor)

      .addField("Название:", item.name, true)
      .addField("Цена:", f.discharge(item.cost) + f.currency, true)
      .addField("Описание:", item.description || "Описание не указано.")
      .addField(
        "Роль:",
        item.role
          ? item.role
              ?.map((role_id) => message.guild.roles.cache.get(role_id))
              .join(", ")
          : "Роль не указана.",
        true
      )
      .addField(
        "Заработок:",
        `${f.discharge(item.income || 0)} ${f.currency}`,
        true
      )
      .addField(
        "Сообщение:",
        message_arr[0]
          ? `**Сообщение**: ${message_arr[0]} ${
              message_arr[1] ? `\n**Ембед**: ${message_arr[1]}` : ""
            }`
          : "Сообщение не указано."
      );
    message.channel.send(info_embed);
  }

  #getOptions() {
    return {
      aliases: "info item-info",
      description: "посмотреть информацию о предмете",
      usage: "info [название предмета]",
      enabled: true,
      type: "Магазин",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "item-info",
      description: this.options.description,
    };
  }
}
module.exports = Command;
