class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);
    await Bot.reloadCommands();
    f.msg(message, ":white_check_mark: Успешно перезагружены все команды!");
  }

  #getOptions() {
    return {
      aliases: "reload",
      description: "овнер бота знает что это за команда",
      enabled: true,
      type: "Администрация --hidden",
      permissions: ["OWNER"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "reload",
      description: this.options.description,
    };
  }
}
module.exports = Command;
