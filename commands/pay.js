class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    var author = await Profile(db, message.author.id);
    var balanceAuthor = author.getBalance();

    var member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      f.msgFalse(
        message,
        `Вы не указали участника для передачи денег.\nИспользование: \`${this.options.usage}\``
      );
    if (member.user.bot || member.id === message.author.id)
      return f.msgFalse(
        message,
        "Вы неправильно указали участника для передачи денег."
      );

    if (args[1] === "all") {
      var amount = balanceAuthor;
    } else {
      var amount = Number(args[1]);
      if (isNaN(amount) || amount < 0)
        return f.msgFalse(
          message,
          "Вы неправильно указали количество для передачи."
        );
    }

    if (amount > balanceAuthor)
      return f.msgFalse(
        message,
        `У вас недостаточно средств для этой операции. Ваш баланс: **${f.discharge(
          balanceAuthor
        )}${f.currency}**`
      );

    var user = await Profile(db, member.id);
    let removed_money = await author.removeMoney(amount);
    let added_money = await user.addMoney(amount);

    console.log(removed_money);
    console.log(added_money);

    f.economy_logs({
      member_for: message.member,
      member_by: member,
      reason: `Give: Given money to ${member.user.tag}`,
      type: "-",
      amount: amount,
      final_coins: removed_money.balance.after
    });

    f.economy_logs({
      member_for: member,
      member_by: message.member,
      reason: `Give: Given money to ${member.user.tag}`,
      type: "+",
      amount: amount,
      final_coins: added_money.balance.after
    });

    f.msg(
      message,
      `Вы успешно перевели **${f.discharge(amount)}**${f.currency} на счет **${
        member.user.tag
      }**.\nВаш баланс - **${f.discharge(author.getBalance())}${f.currency}**`
    );
  }

  #getOptions() {
    return {
      aliases: "pay give",
      description: "передать деньги другому участнику",
      usage: "pay [упоминание участника]",
      enabled: true,
      type: "Экономика",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "give",
      description: this.options.description,
      options: [
        {
          name: "member_mention",
          description: "упоминание участника кому передать деньги",
          type: 6,
          required: true
        },
        {
          name: "amount",
          description: "количество денег для передачи",
          type: 4,
          required: true
        }
      ]
    };
  }
}
module.exports = Command;
