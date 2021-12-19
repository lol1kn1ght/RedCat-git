const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);
    let option = args[args.length - 1];
    args.splice(args.length - 1, 1);
    let item_name = args.join(" ").toLowerCase();

    if (!item_name)
      return f.msgFalse(
        message,
        `Вы не указали опцию для редактирования.\nИспользование: \`${this.options.usage}\``
      );
    if (!option)
      return f.msgFalse(
        message,
        `Вы не указали опцию для редактирования.\nИспользование: \`${this.options.usage}\``
      );

    let shop_db = db.collection("clubs_shop");
    this.shop_db = shop_db;
    let items_data = await shop_db.find().toArray();
    console.log(items_data);
    let item = items_data.filter(
      item => item.name.toLowerCase() === item_name
    )[0];
    if (!item)
      return f.msgFalse(
        message,
        `Вы указали несуществующий предмет.\n\nПример команды: \`${this.options.usage}\``
      );

    switch (option) {
      case "name":
      case "название":
        let ask_name = await f.msg(message, "Укажите новое имя для предмета:", {
          color: f.config.defColor
        });

        let name_message = await this.messageAwait(
          ask_name,
          msg => msg.author.id === message.author.id
        ).catch(e => {
          f.msgFalse(message, `${message.author}, Время ожидания истекло.`);
          return;
        });

        let new_name = name_message.first().content;
        f.msg(
          message,
          `Вы успешно изменили название предмета с **${item.name}** на **${new_name}**.`
        );
        item.name = new_name;
        this.updateData(item);
        break;
      case "cost":
      case "стоимость":
        var ask_cost = await f.msg(message, "Введите новую цену для предмета:");

        let cost_message = await this.messageAwait(
          ask_cost,
          msg => msg.author.id === message.author.id
        ).catch(e => {
          console.log(e);
          f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
          return;
        });

        let new_cost = Number(cost_message.first().content);
        if (isNaN(new_cost) || new_cost < 0)
          return f.msgFalse(message, "Неправильно указана стоимость предмета.");

        f.msg(
          message,
          `Вы успешно изменили стоимость предмета с **${f.discharge(
            item.cost
          )}**${f.currency} на **${f.discharge(new_cost)}${f.currency}**`
        );
        item.cost = new_cost;
        this.updateData(item);
        break;
      case "message":
      case "сообщение":
        let ask_message = await f.msg(
          message,
          "Укажите новое сообщение для отправки в чат при покупке предмета.\nПоставьте `$$` что бы весь текст после этих знаков обернуть в embed.",
          {
            color: f.config.defColor
          }
        );

        let new_message = await this.messageAwait(
          ask_message,
          msg => msg.member.id === message.author.id
        ).catch(e => {
          f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
          return;
        });

        if (!new_message)
          return f.msgFalse(
            message,
            "Вы не указали новое сообщение для отправки при покупке."
          );

        f.msg(message, "Вы успешно установили новое сообщение для отправки.");

        item.message = new_message.first().content;
        this.updateData(item);
        break;
      case "description":
      case "описание":
        let ask_desc = await f.msg(
          message,
          "Укажите новое описание предмета.",
          {color: f.config.defColor}
        );

        let new_desc = await this.messageAwait(
          ask_desc,
          msg => msg.author.id === message.author.id
        ).catch(e => {
          f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
          return;
        });

        let desc = new_desc.first().content;
        if (desc.length > 100)
          return f.msgFalse(
            message,
            "Длинна описания не должна превышать **100** символов."
          );

        item.description = desc;
        this.updateData(item);
        f.msg(message, "Вы успешно установили новое описание для предмета!");
        break;
      default:
        f.msgFalse(
          message,
          `Опции \`${option}\` не найдено. Попробуйте:\n\`\`\`название, описание, цена, роль, сообщение, заработок\`\`\``
        );
    }
  }

  async updateData(data) {
    this.shop_db.updateOne(
      {
        id: data.id
      },
      {
        $set: data
      }
    );
  }

  async messageAwait(message, filter) {
    let new_message = await message.channel
      .awaitMessages(filter, {
        max: 1,
        time: 180000
      })
      .catch(e => {
        throw new Error("timeout expired");
      });

    return new_message;
  }

  #getOptions() {
    return {
      aliases: "cs-edit club-shop-edit",
      description: "позволяет отредактировать существующий в магазине предмет",
      usage: "cs-edit [название предмета] [опция для редактирования]",
      enabled: true,
      type: "Магазин Клубов",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "club-shop-edit",
      description: this.options.description
    };
  }
}
module.exports = Command;
