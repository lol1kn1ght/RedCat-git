class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);
    try {
      message.delete({
        timeout: 30000,
      });
    } catch (e) {}

    if (!args[0])
      return f.msgFalse(message, `Вы не указали что хотите сделать.`);
    if (!message.member.voice.channel)
      return f.msgFalse(
        message,
        `Вы должны находиться в своем голосовом канале для вызова команды.`
      );
    let channel = message.member.voice.channel;
    if (
      !message.member.voice.channel
        .memberPermissions(message.member)
        .has("PRIORITY_SPEAKER") ||
      message.member.voice.channel.bitrate !== 65000
    )
      return f.msgFalse(
        message,
        `У вас недостаточно прав для редактирования этого канала.`
      );
    switch (args[0]) {
      case `название`:
      case "name":
        if (!args[1])
          return f.msgFalse(message, `Вы не указали название канала.`);
        args.splice(0, 1);
        channel.edit({
          name: args.join(` `),
        });
        f.msg(
          message,
          `Вы успешно установили название комнаты: **${args.join(` `)}**`
        );
        break;
      case "лимит":
      case "limit":
        let limit = Number(args[1]);
        if (!limit) return f.msgFalse(message, `Лимит должен быть числом.`);
        if (limit > 99 || limit < 1)
          return f.msgFalse(message, `Не правильно указан лимит комнаты.`);
        channel.edit({
          userLimit: limit,
        });
        f.msg(message, `Вы успешно установили лимит в **${args[1]}** человек.`);
        break;
      case "открыть":
      case "open":
        channel.updateOverwrite(message.guild.id, {
          CONNECT: true,
        });
        f.msg(message, `Вы успешно открыли дверь в комнату для других людей.`);
        break;
      case "закрыть":
        channel.updateOverwrite(message.guild.id, {
          CONNECT: false,
        });
        f.msg(message, `Вы успешно закрыли дверь в комнату для других людей.`);
        break;
      case "выгнать":
      case "кикнуть":
      case "кик":
      case "kick":
        member =
          message.guild.members.cache.get(args[1]) ||
          message.mentions.members.first();
        if (!member)
          return f.msgFalse(
            message,
            `Вы не указали человека, которого хотите выгнать.`
          );
        if (!member.voice.channel || member.voice.channel.id !== channel.id)
          return f.msgFalse(
            message,
            `Этот человек не находится в вашей комнате.`
          );
        member.voice.setChannel(null);
        f.msg(
          message,
          `Вы успешно выгнали **${member.user.tag}** из своей комнаты.`
        );
        break;
      case "бан":
      case "ban":
        var member =
          message.guild.members.cache.get(args[1]) ||
          message.mentions.members.first();
        if (!member)
          return f.msgFalse(
            message,
            ` Вы не указали участника для бана в своем канале.`
          );
        if (member.user.bot)
          return f.msgFalse(message, `Вы не можете забанить бота.`);
        channel.updateOverwrite(member.id, {
          CONNECT: false,
        });
        if (member.voice.channel && member.voice.channel.id === channel.id)
          member.voice.setChannel(null);
        f.msg(
          message,
          `Вы успешно запретили входить участнику **${member.user.tag}** в ваш канал.`
        );
        break;
      case "разбан":
      case "unban":
        var member =
          message.guild.members.cache.get(args[1]) ||
          message.mentions.members.first();
        if (!member)
          return f.msgFalse(
            message,
            `Вы не указали участника для разбана в своем канале.`
          );
        if (member.user.bot)
          return f.msgFalse(message, `Вы не можете разбанить бота.`);
        channel.updateOverwrite(member.id, {
          CONNECT: null,
        });
        f.msg(
          message,
          `Вы успешно разрешили входить участнику **${member.user.tag}** в ваш канал.`
        );
        break;
      default:
        f.msgFalse(
          message,
          `Вы неправильно указали опции: \nДоступные опции: \`название, лимит, открыть, закрыть, выгнать, бан, разбан\``
        );
    }
  }

  #getOptions() {
    return {
      aliases: "ac",
      description: "изменить параметры автовойс канала",
      enabled: true,
      type: "Голосовые каналы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "ac",
      description: this.options.description,
      options: [
        {
          name: "option",
          description: "опция для изменения",
          required: true,
          type: 3,
          choices: [
            {
              name: "название вашего канала",
              value: "name",
            },
            {
              name: "лимит участников в вашем канале",
              value: "limit",
            },
            {
              name: "закрыть ваш канал",
              value: "close",
            },
            {
              name: "открыть ваш канал",
              value: "open",
            },
            {
              name: "выгнать участника из вашего канала",
              value: "kick",
            },
            {
              name: "запретить участнику заходить в ваш канал",
              value: "ban",
            },
            {
              name: "разрешить участнику заходить в ваш канал",
              value: "unban",
            },
          ],
        },
        {
          name: "option_value",
          description: "новое значение опции",
          required: false,
          type: 3,
        },
      ],
    };
  }
}
module.exports = Command;
