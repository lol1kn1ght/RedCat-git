class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    let users_db = db.collection("users");
    let fs = require("fs");
    // bot.guilds.cache.each((guild) => console.log(guild.name));
    // {"settings":{"sendAuthMail":false},"auth":{"emailVerified":false},"statistic":{"rep":0,"coins":0,"rating":0,"lastLogin":0},"events":{"achievements":[],"skills":[]},"profile":{"avatar":"http://storage.easygaming.su/emptyAvatar.jpg","banner":"http://storage.easygaming.su/emptyBanner.jpg"},"info":{"contacts":{"links":{"email":"","phone":""},"title":""},"statuses":[],"bio":""},"roles":[{"_id":"61075b03b5bb1366b0d11e2e","name":"user","level":0}],"friends":["613e54eab0d29060db948d4a"],"subscribed":[],"deleted":false,"_id":"613e5532b0d29060db948e2b","username":"loli_knight","email":"kyrochka58@gmail.com","displayName":"loli_knight","link":"loli_knight","verifyStr":"2a08THXdDEsb38LglDOAoHkeVVW2rqvCZXDSvZ1kd92tccR5PsZWDG2","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxM2U1NTMyYjBkMjkwNjBkYjk0OGUyYiIsImlhdCI6MTYzMTQ3NDk5NCwiZXhwIjoxNjMxNDc4NTk0fQ.oNgm0SmJD3sf22ySbPFSxyVCQfw7lv5_eXDtu4wy6M8","refreshToken":"c7044701-1eff-4dec-a347-e54d019c7279"}
  }

  #getOptions() {
    return {
      aliases: "test",
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
