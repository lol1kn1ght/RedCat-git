class Event {
  constructor() {}

  async execute(bot, mongo, message) {
    if (message.author.bot) return;
    let db = mongo.db(message.guild.id).collection("settings");
    let guild_settings = await db.find({guildID: message.guild.id}).toArray();
    this.server_settings = guild_settings[0] || {};

    this.role_payday(bot, mongo, message);
    this.club_payday(bot, mongo, message);
  }

  async role_payday(bot, mongo, message) {
    let date = new Date();
    let author_income = f.day_income[message.author.id];

    let db = mongo.db(message.guild.id);

    if (!author_income) {
      let users_db = db.collection("users");
      let user_data = await users_db.find({login: message.author.id}).toArray();
      author_income = user_data[0] || {};
    }

    if (author_income.last_collect) {
      let income_date = new Date(author_income?.last_collect);
      if (this.check_today(income_date)) return;
    }
    if (author_income.no_roles) {
      let no_roles = new Date(author_income.no_roles);

      if (this.check_today(no_roles)) return;
    }

    let shop_db = db.collection("shop");
    let shop_data = await shop_db.find().toArray();
    let payday_db = db.collection("income");
    let payday_data = (await payday_db.find().toArray()) || [];

    let income_roles = [...shop_data, ...payday_data].filter(
      item =>
        item.role && item.income && message.member.roles.cache.has(item.role)
    );

    if (!income_roles[0]) {
      author_income.no_roles = date.getTime();
      f.day_income[message.author.id] = author_income;

      return;
    }

    let income_amount = 0;

    if (income_roles[1])
      income_amount = income_roles.reduce((prev_value, current_value) => {
        return (prev_value.income || prev_value) + (current_value.income || 0);
      });
    else income_amount = income_roles[0].income;

    let author_profile = await Profile(db, message.author.id);

    let income_roles_ids = income_roles.map(role_data => role_data.role);

    let roles = message.member.roles.cache
      .filter(role => income_roles_ids.includes(role.id))
      .map(role => role);

    let money = await author_profile.addMoney(income_amount);
    f.economy_logs({
      member_for: message.member,
      member_by: message.guild.me,
      reason: `ROLE-COLLECT for ${roles.join(", ")}`,
      type: "+",
      amount: income_amount,
      final_coins: money.balance.after,
    });

    author_profile.updateData({last_collect: date.getTime()});

    author_income.last_collect = date.getTime();
    f.day_income[message.author.id] = author_income;
  }

  async club_payday(bot, mongo, message) {
    let amount = this.server_settings?.club_payday || 100;
    let db = mongo.db(message.guild.id);

    let date = new Date();
    let author_income = f.club_day_income[message.author.id];

    var clubs_db = db.collection("clubs");
    var clubs_data = await clubs_db.find().toArray();
    var club = clubs_data.filter(club =>
      club.members?.includes(message.author.id)
    )[0];

    if (!author_income) {
      let users_db = db.collection("users");
      let user_data = await users_db.find({login: message.author.id}).toArray();
      author_income = user_data[0] || {};

      f.club_day_income[message.author.id] = author_income;
    }

    if (!club) {
      author_income.no_club = date.getTime();

      return;
    }

    if (author_income.last_club_collect) {
      let income_date = new Date(author_income?.last_club_collect);
      if (this.check_today(income_date)) return;
    }
    if (author_income.no_club) {
      let no_club = new Date(author_income.no_club);

      if (this.check_today(no_club)) return;
    }

    let author_profile = await Profile(db, message.author.id);

    clubs_db.updateOne(
      {
        owner: club.owner
      },
      {
        $set: {
          money: (club.money || 0) + amount
        }
      }
    );
    author_profile.updateData({last_club_collect: date.getTime()});

    f.clubEconomy_logs({
      club_for: club,
      member_by: message.member,
      reason: `CLUB-COLLECT`,
      type: "+",
      amount: amount,
      final_coins: (club.money || 0) + amount,
    });

    author_income.last_club_collect = date.getTime();
    f.club_day_income[message.author.id] = author_income;
  }

  check_today(date) {
    let today_date = new Date();

    return (
      date.getDate() === today_date.getDate() &&
      date.getMonth() === today_date.getMonth() &&
      date.getFullYear() === today_date.getFullYear()
    );
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
