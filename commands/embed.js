class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);
  }

  #getOptions() {
    return {
      aliases: "embed",
      description: "код превратить в ембед и отправить",
      enabled: true,
      type: "Администрация --hidden",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "embed",
      description: this.options.description,
      type: "Администрация",
    };
  }
}
module.exports = Command;
