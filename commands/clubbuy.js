class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();

    let club = clubs_data.filter(
      club =>
        club?.admins.includes(message.author.id) ||
        club.owner === message.author.id
    )[0];
    if (!club)
      return f.msgFalse(
        message,
        "У вас нет клуба которым вы можете управлять."
      );

    let item_name = args.join(" ");
    if (!item_name)
      f.msgFalse(message, "Вы не указали название предмета для покупки.");

    let items_db = db.collection("clubs_shop");
    let items_data = await items_db.find().toArray();

    let item = items_data.filter(
      item => item.name.toLowerCase() === item_name.toLowerCase()
    )[0];

    if (!item) return f.msgFalse(message, "Вы указали несуществующий предмет.");

    if ((club.money || 0) < item.cost)
      return f.msgFalse(
        message,
        "У вашего клуба недостаточно средств для покупки."
      );

    f.club_push_item(db, club, item.id, 1);

    clubs_db.updateOne(
      {
        owner: club.owner
      },
      {
        $set: {money: club.money - item.cost}
      }
    );

    f.clubEconomy_logs({
      club_for: club,
      member_by: message.member,
      reason: `CLUB-BUY ${item.name}`,
      type: "-",
      amount: item.cost
    });

    f.msg(message, `Вы успешно приобрели **${item.name}** для своего клуба`);
  }

  #getOptions() {
    return {
      aliases: "clubbuy",
      description: "Купить предмет для клуба",
      enabled: true,
      type: "Магазин Клубов",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "",
      description: this.options.description
    };
  }
}
module.exports = Command;
