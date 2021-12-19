const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let option = args[args.length - 1];

    args.splice(args.length - 1, 1);
    let club_name = args.join(" ").toLowerCase();

    if (!club_name)
      return f.msgFalse(
        message,
        "Вы не указали название клуба для редактирования."
      );

    if (!option || !["канал", "роль"].includes(option.toLowerCase()))
      return f.msgFalse(
        messsage,
        "Вы не указали опцию для редактирования.\nОпции для редактирования: `канал, роль`"
      );

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();

    let club = clubs_data.filter(
      (club) => club.name.toLowerCase() === club_name
    )[0];
    if (!club) return f.msgFalse(message, "Вы указали несуществующий клуб.");

    let ask_value = await f.msg(
      message,
      `Укажите значение для параметра ${option}:`
    );

    let ask = await this.messageAwait(
      ask_value,
      (msg) => msg.author.id === message.author.id
    ).catch((e) => {
      ask_message.delete();
      f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
      return;
    });

    if (!ask.first())
      return f.msgFalse(message, "Вы не указали значение опции.");

    let value = ask.first()?.content;

    switch (option.toLowerCase()) {
      case "канал":
      case "channel":
        club.channel = value;
        break;
      case "роль":
      case "role":
        club.role = value;
        break;
    }

    clubs_db.updateOne(
      {
        owner: club.owner,
      },
      {
        $set: club,
      }
    );

    f.msg(
      message,
      `Вы успешно установили значение свойства **${option}** на \`${value}\``
    );
  }

  async messageAwait(message, filter) {
    let new_message = await message.channel
      .awaitMessages(filter, {
        max: 1,
        time: 180000,
      })
      .catch((e) => {
        throw new Error("timeout expired");
      });

    return new_message;
  }

  #getOptions() {
    return {
      aliases: "set-club",
      description: "Установить предмет для клуба",
      usage: "set-club [название клуба] [опция]",
      enabled: true,
      type: "Клубы",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: ["582260552588460053"],
    };
  }

  #getSlashOptions() {
    return {
      name: "set-club",
      description: this.options.description,
    };
  }
}
module.exports = Command;
