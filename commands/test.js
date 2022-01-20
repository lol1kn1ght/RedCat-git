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
        .setCustomId("763080675548332082"),

      new MessageButton()
        .setStyle("SECONDARY")
        .setEmoji("👀")
        .setCustomId("724513678149550161"),

      new MessageButton()
        .setStyle("SECONDARY")
        .setEmoji("🐺")
        .setCustomId("746029718217818132"),

      new MessageButton()
        .setStyle("SECONDARY")
        .setEmoji("<:RDR_rep_good:821121079279616021>")
        .setCustomId("798422475905040445")
    );

    let msg = await bot.channels.cache
      .get("652521261058228236")
      .messages.fetch("817426126350975017");

    msg.edit({
      components: [rolesrow2]
    });
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
