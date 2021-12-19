class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    Bot._events = undefined;

    Bot.reLoadEvents();
  }

  #getOptions() {
    return {
      aliases: "reload-events",
      description: "",
      enabled: true,
      type: "WIP",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "reload-events",
      description: this.options.description
    };
  }
}
module.exports = Command;
