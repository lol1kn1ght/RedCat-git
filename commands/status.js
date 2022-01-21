class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let embed = new Discord.MessageEmbed()
      .setThumbnail(
        bot.user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setTitle(`Статус ${bot.user.tag}:`)
      .addField(
        `Время работы:`,
        f.msToTime(new Date().getTime() - bot.readyTimestamp),
        true
      )
      .addField(`Пинг:`, f.discharge(bot.ws.ping), true)
      .addField(`Количество юзеров:`, f.discharge(bot.users.cache.size))
      .setColor(f.config.defColor);
    message.channel.send({ embeds: [embed] });
  }

  #getOptions() {
    return {
      aliases: "status",
      description: "посмотреть статус бота",
      enabled: true,
      type: "Статистика",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "status",
      description: this.options.description,
    };
  }
}
module.exports = Command;
