class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let amount = Number(args[0]);

    if (isNaN(amount))
      return f.msgFalse(message, "Сумма для снятия должна быть числом.");

    if (amount < 0)
      return f.msgFalse(
        message,
        "Сумма для снятия не должна быть меньше нуля."
      );

    let clubs_db = db.collection("clubs");
    let club_data = await clubs_db.findOne({owner: message.author.id});

    let club = club_data;

    if (!club) return f.msgFalse(message, "Вы не владеете никаким клубом.");

    let member_profile = await Profile(db, message.author.id);

    if (club.money < amount)
      return f.msgFalse(
        message,
        "На счету клуба недостаточно средств для этой операции."
      );

    member_profile.addMoney(amount);

    club.money = (club.money || 0) - amount;

    f.clubEconomy_logs({
      club_for: club,
      member_by: message.member,
      reason: `CLUB-WITHDRAW`,
      type: "-",
      amount: amount
    });

    f.economy_logs({
      member_for: message.member,
      member_by: message.guild.me,
      reason: "clubwithdraw command: witdraw from club",
      type: "+",
      amount
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

    f.msg(
      message,
      `Вы успешно сняли **${f.discharge(amount)}${
        f.currency
      }** со счета своего клуба`
    );
  }

  #getOptions() {
    return {
      aliases: "clubwith",
      description: "Снять валюту со счета своего клуба.",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "club-deposit",
      description: this.options.description
    };
  }
}
module.exports = Command;
