class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let member_profile = await Profile(db, message.author.id);

    if (args[0] === "all") {
      var amount = member_profile.coins;
    } else {
      var amount = Number(args[0]);
    }

    if (isNaN(amount))
      return f.msgFalse(message, "Сумма для депозита должна быть числом.");

    if (amount < 1)
      return f.msgFalse(
        message,
        "Сумма для депозита должна быть положительной."
      );

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();

    let club = clubs_data.filter(club =>
      club.members.includes(message.author.id)
    )[0];

    if (!club) return f.msgFalse(message, "Вы не находитесь ни в каком клубе.");

    if (member_profile.coins < amount)
      return f.msgFalse(message, "У вас недостаточно средств для депозита.");

    let money = await member_profile.removeMoney(amount);

    club.money = (club.money || 0) + amount;

    f.clubEconomy_logs({
      club_for: club,
      member_by: message.member,
      reason: `CLUB-DEP`,
      type: "+",
      amount: amount,
      final_coins: club.money,
    });

    clubs_db.updateOne(
      {
        owner: club.owner
      },
      {
        $set: {
          money: club.money
        }
      }
    );

    f.economy_logs({
      member_for: message.member,
      member_by: message.guild.me,
      reason: "clubdep command: deposit to club",
      type: "-",
      amount: amount,
      final_coins: money.balance.after
    });

    f.msg(
      message,
      `Вы успешно перевели **${f.discharge(amount)}${
        f.currency
      }** на счет своего клуба`
    );
  }

  #getOptions() {
    return {
      aliases: "clubdep",
      description: "Положить валюту на счет своего клуба.",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "clubdep",
      description: this.options.description
    };
  }
}
module.exports = Command;
