class Event {
  constructor() {}

  async execute(bot, mongo, olds, news) {
    let guildDB = mongo.db((olds || news).guild.id);
    var settings = guildDB.collection(`settings`);
    settings
      .find({
        guildID: (olds || news).guild.id
      })
      .toArray((err, settingsData) => {
        var settings = settingsData[0];
        if (!settings) settings = {};
        var lobbyies = settings.autoVoiceLobbyies;
        if (!lobbyies) lobbyies = [];
        if (news && news.channel) {
          if (lobbyies.includes(news.channel.id)) {
            news.guild.channels
              .create(
                `Комната ${
                  news.member.nickname
                    ? news.member.nickname
                    : news.member.user.username
                }`,
                {
                  parent: news.channel.parent.id,
                  type: `GUILD_VOICE`,
                  bitrate: 65000,
                  userLimit: news.channel.userLimit,
                  permissionOverwrites: [
                    ...[...news.channel.permissionOverwrites.cache].map(
                      permission => permission[1]
                    ),
                    {
                      id: news.member.id,
                      allow: ["PRIORITY_SPEAKER"]
                    },
                    {
                      id: bot.user.id,
                      allow: ["STREAM"]
                    }
                  ]
                }
              )
              .then(chan => {
                chan.setPosition(news.channel.position + 1);
                news.setChannel(chan).catch(e => chan.delete());
              });
          }
        }
        if (olds && olds.channel) {
          if (
            olds.channel.members.size === 0 &&
            olds.channel.bitrate === 65000 &&
            !lobbyies.includes(olds.channel.id)
          )
            olds.channel.delete(`Пустой автоканал.`);
        }
      });
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
