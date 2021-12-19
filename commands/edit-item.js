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

    let shop_db = db.collection("shop");
    this.shop_db = shop_db;
    let items_data = await shop_db.find().toArray();
    let item = items_data.filter(
      (item) => item.name.toLowerCase() === item_name
    )[0];
    if (!item)
      return f.msgFalse(
        message,
        "Вы указали несуществующий предмет.\n\nПример команды: `edit-item (название предмета) (опция для редактирования)`"
      );

    switch (option) {
      case "name":
      case "название":
        let ask_name = await f.msg(message, "Укажите новое имя для предмета:", {
          color: f.config.defColor,
        });

        let name_message = await this.messageAwait(
          ask_name,
          (msg) => msg.author.id === message.author.id
        ).catch((e) => {
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
          (msg) => msg.author.id === message.author.id
        ).catch((e) => {
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
      case "role":
      case "роль":
        let ask_role = await f.msg(message, "Укажите роль для предмета:", {
          color: f.config.defColor,
        });

        let role_message = await this.messageAwait(
          ask_role,
          (msg) => msg.member.id === msg.author.id
        ).catch((e) => {
          f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
          return;
        });

        let new_role =
          role_message.first().mentions.roles.first() ||
          message.guild.roles.cache.get(role_message.first().content);
        if (!new_role)
          return f.msgFalse(message, "Вы не указали новую роль предмета.");

        if (
          new_role.position >=
          message.guild.members.cache.get(bot.user.id).roles.highest.position
        )
          return f.msgFalse(
            message,
            "Бот не может управлять указанной вами ролью.\nПоставьте роль бота выше этой роли."
          );

        let ask_method_message = await f.msg(
          message,
          "Вы хотите `добавить` роль для выдачи или `удалить`?"
        );
        let ask_method = await this.messageAwait(
          ask_method_message,
          (msg) => msg.member.id === msg.author.id
        ).catch((e) => {
          f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
          return;
        });

        if (!ask_method?.first())
          return f.msgFalse(message, "Вы не указали что хотите сделать.");

        switch (ask_method?.first().content) {
          case "добавить":
          case "add":
            f.msg(
              message,
              `Вы успешно добавили новую роль ${new_role} для предмета.`
            );

            let new_roles = item.role
              ? item.role.push
                ? item.role
                : [item.role]
              : [];

            console.log(new_roles);
            new_roles.push(new_role.id);

            item.role = [...new Set(new_roles)];
            this.updateData(item);
            break;
          case "удалить":
          case "delete":
            f.msg(message, `Вы успешно удалили роль ${new_role} для предмета.`);
            if (!item.role) item.role = [];

            item.role.splice(item.role.indexOf(new_role.id), 1);
            this.updateData(item);
            break;
        }
        break;
      case "message":
      case "сообщение":
        let ask_message = await f.msg(
          message,
          "Укажите новое сообщение для отправки в чат при покупке предмета.\nПоставьте `$$` что бы весь текст после этих знаков обернуть в embed.",
          {
            color: f.config.defColor,
          }
        );

        let new_message = await this.messageAwait(
          ask_message,
          (msg) => msg.member.id === message.author.id
        ).catch((e) => {
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
          { color: f.config.defColor }
        );

        let new_desc = await this.messageAwait(
          ask_desc,
          (msg) => msg.author.id === message.author.id
        ).catch((e) => {
          f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
          return;
        });

        let desc = new_desc.first().content;
        if (desc.length > 300)
          return f.msgFalse(
            message,
            "Длинна описания не должна превышать **100** символов."
          );

        item.description = desc;
        this.updateData(item);
        f.msg(message, "Вы успешно установили новое описание для предмета!");
        break;

      case "income":
      case "заработок":
        let ask_income = await f.msg(message, "Укажите заработок роли.", {
          color: f.config.defColor,
        });

        let new_income = await this.messageAwait(
          ask_income,
          (msg) => msg.author.id === message.author.id
        ).catch((e) => {
          f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
          return;
        });

        let income = Number(new_income.first().content);
        if (isNaN(income))
          return f.msgFalse(message, "Заработок должен быть числом.");
        if (income <= 0)
          return f.msgFalse(message, "Неправильно указан заработок.");

        item.income = income;
        this.updateData(item);
        f.msg(message, "Вы успешно установили новый заработок для роли.");
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
        id: data.id,
      },
      {
        $set: data,
      }
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
      aliases: "edit-item item-edit",
      description: "позволяет отредактировать существующий в магазине предмет",
      usage: "edit-item [название предмета] [опция для редактирования]",
      enabled: true,
      type: "Магазин",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: ["582260552588460053"],
    };
  }

  #getSlashOptions() {
    return {
      name: "edit-item",
      description: this.options.description,
    };
  }
}
module.exports = Command;
