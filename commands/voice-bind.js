class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    let channel =
      message.guild.channels.cache.get(args[0]) ||
      message.mentions.channels.first();

    if (!channel || channel.type !== `voice`)
      return f.msgFalse(message, `Вы не указали нужный канал.`);

    let collections_list = await db.listCollections().toArray(); // Список коллекций в базе данных

    if (!collections_list.filter((val) => val.name === "settings")[0]) {
      // Проверка если не существует коллекции settings, то создать ее
      await db.createCollection("settings");
    }

    let settings_db = db.collection("settings");
    let settings_data = await settings_db
      .find({ guildID: message.guild.id })
      .toArray(); // Поиск настроек сервера по айди сервера
    let guild_settings = settings_data[0] || {};

    let voice_lobbyies = guild_settings.autoVoiceLobbyies || []; // Массив для айди автолобби-каналов

    if (voice_lobbyies.includes(channel.id)) {
      voice_lobbyies.splice(voice_lobbyies.indexOf(channel.id), 1); // Вырезать айди из массива автолобби-каналов
      updateData({ autoVoiceLobbyies: voice_lobbyies }); // Обновить массив с айди каналов в базе данных
      return f.msg(
        message,
        `Вы успешно удалили **${channel.name}** из лобби для автоканалов.`
      );
    }

    if (!voice_lobbyies.includes(channel.id)) {
      voice_lobbyies.push(channel.id); // Добавить айди в массив автолобби-каналов
      updateData({ autoVoiceLobbyies: voice_lobbyies }); // Обновить массив с айди каналов в базе данных
      return f.msg(
        message,
        `Вы успешно установили **${channel.name}** как лобби для автоканалов.`
      );
    }

    function updateData(data) {
      // Функция по обновлению данных в бд
      if (!guild_settings.guildID) {
        // Если нету настроек сервера, то создать их и записать туда новые значения
        settings_db.insertOne({
          guildID: message.guild.id,
          ...data,
        });
      }

      if (guild_settings.guildID) {
        // Если есть настройки сервера, то перезаписать туда данные
        settings_db.updateOne(
          {
            guildID: message.guild.id,
          },
          {
            $set: data,
          }
        );
      }
    }
  }

  #getOptions() {
    return {
      aliases: "voice-bind",
      description: "задать/удалить лобби для автовойс каналов {ADMINISTRATOR}",
      enabled: true,
      type: "Голосовые каналы",
      permissions: [`ADMINISTRATOR`],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "voice-bind",
      description: this.options.description,
      options: [
        {
          name: "channel_id",
          description: "айди канала для изменения",
          type: 7,
          required: true,
        },
      ],
    };
  }
}
module.exports = Command;
