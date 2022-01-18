class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);
    var member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return f.msgFalse(
        message,
        `Вы не указали участника для добавления денег.\nИспользование: \`${this.options.usage}\``
      );

    var amount = Number(args[1]);
    if (isNaN(amount) || amount <= 0)
      return f.msgFalse(message, "Вы неправильно указали сумму для передачи.");

    var target = await Profile(db, member.id);
    await target.addMoney(amount);

    f.economy_logs({
      member_for: member,
      member_by: message.member,
      reason: "Add-money command",
      type: "+",
      amount
    });
    f.msg(
      message,
      `Вы успешно добавили **${f.discharge(amount)}${f.currency}** на счет **${
        member.user.tag
      }**.\nНовый баланс - **${f.discharge(target.coins)}${f.currency}**`
    );
  }

  #getOptions() {
    return {
      aliases: "add add-money",
      description: "добавить деньги на чей-то счет",
      usage: "add [упоминание участника] [сумма]",
      enabled: true,
      type: "Экономика",
      permissions: [`ADMINISTRATOR`],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "add-money",
      description: this.options.description,
      options: [
        {
          name: "member_mention",
          description:
            "упоминание участника кому перевести деньги {ADMINISTRATOR}",
          type: 6,
          required: true
        },
        {
          name: "amount",
          description: "количество монет для добавления",
          required: true,
          type: 4
        }
      ]
    };
  }
}
module.exports = Command;
