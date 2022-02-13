const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    let item_name = args.join(" ").toLowerCase();
    if (!args[0])
      return f.msgFalse(
        message,
        `Вы не указали название предмета для покупки.\nИспользование: \`${this.options.usage}\``
      );

    let items_db = db.collection("shop");
    let items_data = await items_db.find().toArray();

    let item = items_data.filter(
      item => item.name.toLowerCase() === item_name
    )[0];
    if (!item) return f.msgFalse(message, "Вы указали несуществующий предмет.");

    let author = await Profile(db, message.author.id);

    if (author.coins < item.cost)
      return f.msgFalse(
        message,
        `У вас недостаточно средств для покупки этого предмета.\nВам не хватает еще: **${f.discharge(
          item.cost - author.coins
        )}${f.currency}**`
      );

    let money = await author.removeMoney(item.cost);

    f.economy_logs({
      member_for: message.member,
      member_by: message.guild.me,
      reason: `Buy: Bought "${item.name}"`,
      type: "-",
      amount: item.cost,
      final_coins: money.balance.after
    });

    f.push_item(db, message.author.id, item.id, 1);
    f.msg(
      message,
      `Вы успешно приобрели предмет **${
        item.name
      }**\nВаш баланс: **${f.discharge(author.coins)}${f.currency}**`
    );
  }

  #getOptions() {
    return {
      aliases: "buy",
      description: "купить какой-то предмет",
      usage: `buy [название предмета]`,
      enabled: true,
      type: "Магазин",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "buy",
      description: this.options.description
    };
  }
}
module.exports = Command;
