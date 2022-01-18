const {MessageActionRow, MessageButton} = require("discord.js");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    let users_db = db.collection("users");
    let fs = require("fs");

    const rolesrow2 = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SECONDARY")
        .setEmoji("<a:r_wakeup:876654370081628161>")
        .setCustomId("drgames"),

      new MessageButton()
        .setStyle("SECONDARY")
        .setEmoji("👀")
        .setCustomId("poiskgames"),

      new MessageButton()
        .setStyle("SECONDARY")
        .setEmoji("🐺")
        .setCustomId("poiskohot"),

      new MessageButton()
        .setStyle("SECONDARY")
        .setEmoji("<:RDR_rep_good:821121079279616021>")
        .setCustomId("hachuverif")
    );
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
