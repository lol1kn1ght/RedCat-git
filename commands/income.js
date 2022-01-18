class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let role =
      message.mentions.members.first() ||
      message.guild.roles.cache.get(args[0]);

    if (!role)
      return f.msgFalse(
        message,
        "Вы не указали роль для добавления заработка."
      );

    let ask_message = await f.msg(
      message,
      "Вы хотите `добавить` или `удалить` заработок для роли?"
    );

    let ask = await this.messageAwait(
      ask_message,
      (msg) => msg.author.id === message.author.id
    ).catch((e) => {
      ask_message.delete();
      f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
      return;
    });

    let income_db = db.collection("income");
    let income_role = await income_db.findOne({
      role: role.id,
    });

    switch (ask.first()?.content?.toLowerCase()) {
      case "добавить":
      case "add":
        let ask_income = await f.msg(
          message,
          "Укажите новый заработок для роли."
        );

        let ask = await this.messageAwait(
          ask_income,
          (msg) => msg.author.id === message.author.id
        ).catch((e) => {
          ask_message.delete();
          f.msgFalse(message, `${message.member}, Время ожидания истекло.`);
          return;
        });

        let income = Number(ask.first()?.content);
        if (isNaN(income) || income === 0)
          return f.msgFalse(message, "Вы указали неверный заработок роли.");

        let role_income = {
          role: role.id,
          income: income,
        };

        if (income_role?.role) {
          income_db.updateOne(
            {
              role: role.id,
            },
            {
              $set: {
                income: income,
              },
            }
          );

          f.msg(
            message,
            `Вы успешно установили заработок для роли на **${f.discharge(
              income
            )} ${f.currency}**`
          );
        } else {
          income_db.insertOne(role_income);
          f.msg(
            message,
            `Вы успешно добавили заработок для роли в **${f.discharge(
              income
            )} ${f.currency}**`
          );
        }

        break;
      case "удалить":
      case "delete":
        income_db.deleteOne({
          role: role.id,
        });

        f.msg(message, `Вы успешно удалили заработок для роли.`);
        break;
    }
  }

  async messageAwait(message, filter) {
    let new_message = await message.channel
      .awaitMessages({ filter, max: 1, time: 180000 })
      .catch((e) => {
        throw new Error("timeout expired");
      });

    return new_message;
  }

  #getOptions() {
    return {
      aliases: "income",
      description: "Задать заработок для роли",
      usage: "income [айди или упоминание роли]",
      enabled: true,
      type: "Магазин",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: ["582260552588460053"],
    };
  }

  #getSlashOptions() {
    return {
      name: "income",
      description: this.options.description,
    };
  }
}
module.exports = Command;
