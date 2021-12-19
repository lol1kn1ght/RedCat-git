class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    var fetch = require("node-fetch");

    var res = await fetch("http://127.0.0.1:3000/");
    console.log(res);
  }

  #getOptions() {
    return {
      aliases: "get",
      description: "test",
      enabled: true,
      type: "WIP",
      permissions: [`OWNER`],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "test",
      description: this.options.description,
    };
  }
}
module.exports = Command;
