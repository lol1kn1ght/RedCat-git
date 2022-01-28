const {MessageActionRow, MessageButton} = require("discord.js");
const UnbelievaClient = require("unb-api").Client;
const Unbelieva = new UnbelievaClient(f.unb_token);

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    let users_db = db.collection("users");

    // let all_users = await users_db.find().toArray();
    //
    // let duplicates_users = all_users.filter(
    //   user => all_users.filter(u => u.login === user.login).length != 1
    // );
    //
    // console.log(duplicates_users.map(user => user.login));
    //
    // let ids = [...new Set(duplicates_users.map(user => user.login))];
    //
    // console.log(ids);
    // let lb = await Unbelieva.getGuildLeaderboard(message.guild.id, {
    //   sort: "cash"
    // });
    //
    // let members = await message.guild.members.fetch({
    //   id: lb.map(user => user.user_id)
    // });
    //
    // let done = [];
    //
    // let lb_filtred = lb.filter(user => members.has(user.user_id));
    //
    // let result_message = await message.channel.send(
    //   `Обработано \`${done.length}\` человек из \`${lb_filtred.length}\``
    // );
    //
    // setInterval(() => {
    //   result_message.edit(
    //     `Обработано \`${done.length}\` человек из \`${lb_filtred.length}\``
    //   );
    // }, 2000);
    //
    // for (let user of lb_filtred) {
    //   console.log(`${user.user_id}: ${user.total}`);
    //   await users_db.insertOne({
    //     login: user.user_id,
    //     coins: user.total
    //   });
    //   done.push(user);
    // }
  }

  #getOptions() {
    return {
      aliases: "test",
      description: "test",
      enabled: true,
      type: "WIP",
      permissions: [`OWNER`],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "test",
      description: this.options.description
    };
  }
}
module.exports = Command;
