const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);
    var member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0]));

    if (!member)
      return f.msgFalse(
        message,
        `Вы не указали участника для удаления денег.\nИспользование: \`${this.options.usage}\``
      );

    var amount = Number(args[1]);
    if (isNaN(amount) || amount < 0)
      return f.msgFalse(message, "Вы неправильно указали сумму для удаления.");

    var target = await Profile(db, member.id);
    if (target.coins < amount)
      return f.msgFalse(
        message,
        "У выбранного вами участника денег меньше, чем вы хотите удалить."
      );
    await target.removeMoney(amount);
    f.economy_logs({
      member_for: member,
      member_by: message.member,
      reason: `remove-moeny: Given money to ${member.user.tag}`,
      type: "-",
      amount
    });

    f.msg(
      message,
      `Вы успешно удалили **${f.discharge(amount)}${f.currency}** со счета **${
        member.user.tag
      }**.\nНовый баланс - **${f.discharge(target.coins)}${f.currency}**`
    );
  }

  #getOptions() {
    return {
      aliases: "remove remove-money",
      description:
        "удалить деньги со счета какого-то участника. {ADMINISTRATOR}",
      usage: "remove [упоминание участника] [сумма]",
      enabled: true,
      type: "Экономика",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "remove-money",
      description: this.options.description,
      options: [
        {
          name: "member-mention",
          description: "упоминание пользователя",
          type: 6,
          required: true
        },
        {
          name: "amount",
          description: "количество денег для удаления",
          type: 4,
          required: true
        }
      ]
    };
  }
}
module.exports = Command;
